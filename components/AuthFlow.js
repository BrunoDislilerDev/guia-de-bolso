"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import IconBack from "@/components/IconBack";
import { createClient } from "@/lib/supabase";

/**
 * IconGoogle - Google brand icon for OAuth button.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconGoogle({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

/**
 * IconMessage - Message icon for SMS login option.
 * @param {object} props
 * @param {string} [props.className]
 * @returns {import('react').ReactElement}
 */
function IconMessage({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 4h16a2 2 0 012 2v10a2 2 0 01-2 2H8l-6 4V6a2 2 0 012-2zm2 5v2h12V9H6zm0 4v2h8v-2H6z" />
    </svg>
  );
}

/**
 * Formats a Brazilian phone number as the user types.
 * @param {string} value - Raw input value.
 * @returns {string} Formatted phone string.
 */
function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/**
 * Strips non-digits from a phone string and limits to 11 digits.
 * @param {string} value - Raw input value.
 * @returns {string} Digits-only phone string.
 */
function cleanPhone(value) {
  return value.replace(/\D/g, "").slice(0, 11);
}

/**
 * AuthFlow - Multi-step login with Google OAuth and SMS OTP verification.
 * @param {object} props
 * @param {boolean} [props.compact] - Compact styling for use inside modals.
 * @returns {import('react').ReactElement}
 */
export default function AuthFlow({ compact = false }) {
  const router = useRouter();
  const [screen, setScreen] = useState("main");
  const [oauthLoading, setOauthLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(30);
  const [resendCount, setResendCount] = useState(0);
  const inputsRef = useRef([]);

  const digits = cleanPhone(phone);
  const phoneE164 = `+55${digits}`;
  const codeValue = code.join("");

  useEffect(() => {
    if (screen !== "code" || resendSeconds <= 0) return undefined;
    const timer = setTimeout(() => setResendSeconds((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [screen, resendSeconds]);

  /**
   * Starts Google OAuth sign-in via Supabase.
   * @returns {Promise<void>}
   */
  async function handleGoogle() {
    setOauthLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setOauthLoading(false);
  }

  /**
   * Sends or resends an SMS OTP to the entered phone number.
   * @param {boolean} [isResend] - Whether this is a resend attempt.
   * @returns {Promise<void>}
   */
  async function sendCode(isResend = false) {
    setPhoneError("");
    setCodeError("");

    if (digits.length !== 11) {
      setPhoneError("Digite um número válido com DDD e 9 dígitos.");
      return;
    }

    if (isResend && resendCount >= 3) {
      setCodeError("Muitas tentativas. Aguarde alguns minutos.");
      return;
    }

    setSendingCode(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ phone: phoneE164 });
    setSendingCode(false);

    if (error) {
      setPhoneError("Falha ao enviar SMS. Verifique o número e tente novamente.");
      setCodeError("Falha ao reenviar SMS. Tente novamente.");
      return;
    }

    if (isResend) setResendCount((current) => current + 1);
    setResendSeconds(30);
    setScreen("code");
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  }

  /**
   * Verifies the 6-digit SMS code and redirects on success.
   * @returns {Promise<void>}
   */
  async function verifyCode() {
    setCodeError("");
    setVerifying(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneE164,
      token: codeValue,
      type: "sms",
    });
    setVerifying(false);

    if (error) {
      setCode(["", "", "", "", "", ""]);
      setCodeError(
        error.message?.toLowerCase().includes("expired")
          ? "Código expirado. Solicite um novo código."
          : "Código incorreto. Tente novamente."
      );
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
      return;
    }

    setScreen("success");
    setTimeout(() => router.push("/"), 1500);
  }

  /**
   * Updates a single OTP digit and focuses the next input.
   * @param {number} index - Digit index (0–5).
   * @param {string} value - Input value for that cell.
   * @returns {void}
   */
  function updateCode(index, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    setCodeError("");
    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  }

  /**
   * Moves focus to the previous OTP input on backspace when current cell is empty.
   * @param {number} index - Digit index (0–5).
   * @param {import('react').KeyboardEvent} event - Keyboard event.
   * @returns {void}
   */
  function handleCodeKeyDown(index, event) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  /**
   * Fills all OTP inputs when a 6-digit code is pasted.
   * @param {import('react').ClipboardEvent} event - Paste event.
   * @returns {void}
   */
  function handlePaste(event) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length !== 6) return;
    event.preventDefault();
    setCode(pasted.split(""));
    inputsRef.current[5]?.focus();
  }

  /**
   * Returns to the phone entry screen and clears OTP state.
   * @returns {void}
   */
  function resetPhone() {
    setScreen("phone");
    setCode(["", "", "", "", "", ""]);
    setCodeError("");
    setResendSeconds(30);
    setResendCount(0);
  }

  const titleClass = compact
    ? "text-2xl font-bold text-[#1a4a3a]"
    : "text-2xl font-bold text-white";
  const subtitleClass = compact
    ? "mt-2 text-sm text-[#5a6b66]"
    : "mt-2 text-sm text-white/70";

  if (screen === "success") {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-[#b8e6d4] text-4xl text-[#1a4a3a]">
          ✓
        </div>
        <h2 className={compact ? "mt-5 text-xl font-bold text-[#1a4a3a]" : "mt-5 text-xl font-bold text-white"}>
          Login realizado com sucesso!
        </h2>
      </div>
    );
  }

  if (screen === "phone") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setScreen("main")}
          className={`mb-5 inline-flex items-center gap-1.5 text-sm font-semibold ${
            compact ? "text-[#1a4a3a]" : "text-white/80"
          }`}
        >
          <IconBack className="h-4 w-4" />
          Voltar
        </button>
        <h2 className={titleClass}>Entrar com SMS</h2>
        <p className={subtitleClass}>Digite seu telefone para receber um código de acesso</p>
        <input
          type="tel"
          value={phone}
          onChange={(event) => {
            setPhone(formatPhone(event.target.value));
            setPhoneError("");
          }}
          placeholder="(48) 9 9608-7543"
          className={`mt-6 w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ${
            compact
              ? "bg-[#f0f4f3] text-[#1a2e28] focus:ring-[#1a4a3a]/30"
              : "bg-white text-[#1a2e28] focus:ring-white/40"
          }`}
        />
        {phoneError && <p className="mt-2 text-sm text-red-400">{phoneError}</p>}
        <button
          type="button"
          disabled={digits.length !== 11 || sendingCode}
          onClick={() => sendCode(false)}
          className={`mt-5 w-full rounded-xl py-3.5 text-sm font-semibold disabled:opacity-50 ${
            compact ? "bg-[#1a4a3a] text-white" : "bg-white text-[#1a4a3a]"
          }`}
        >
          {sendingCode ? "Enviando..." : "Enviar código"}
        </button>
      </div>
    );
  }

  if (screen === "code") {
    const complete = code.every(Boolean);
    const maxResends = resendCount >= 3;
    return (
      <div>
        <button
          type="button"
          onClick={resetPhone}
          className={`mb-5 inline-flex items-center gap-1.5 text-sm font-semibold ${
            compact ? "text-[#1a4a3a]" : "text-white/80"
          }`}
        >
          <IconBack className="h-4 w-4" />
          Usar outro número
        </button>
        <h2 className={titleClass}>Código enviado!</h2>
        <p className={subtitleClass}>Digite o código de 6 dígitos enviado para {phone}</p>

        <div className="mt-6 flex justify-between gap-2" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputsRef.current[index] = node;
              }}
              value={digit}
              inputMode="numeric"
              maxLength={1}
              onChange={(event) => updateCode(index, event.target.value)}
              onKeyDown={(event) => handleCodeKeyDown(index, event)}
              className={`h-12 w-11 rounded-xl border bg-white text-center text-lg font-bold text-[#1a2e28] outline-none ${
                codeError
                  ? "border-red-400"
                  : digit
                    ? "border-[#1a4a3a]"
                    : "border-white/40"
              }`}
            />
          ))}
        </div>

        {codeError && <p className="mt-3 text-sm text-red-400">{codeError}</p>}

        {complete && (
          <button
            type="button"
            disabled={verifying}
            onClick={verifyCode}
            className={`mt-5 w-full rounded-xl py-3.5 text-sm font-semibold disabled:opacity-60 ${
              compact ? "bg-[#1a4a3a] text-white" : "bg-white text-[#1a4a3a]"
            }`}
          >
            {verifying ? "Verificando..." : "Verificar código"}
          </button>
        )}

        <button
          type="button"
          disabled={resendSeconds > 0 || maxResends || sendingCode}
          onClick={() => sendCode(true)}
          className={`mt-5 w-full text-sm font-semibold disabled:opacity-50 ${
            compact ? "text-[#1a4a3a]" : "text-[#b8e6d4]"
          }`}
        >
          {maxResends
            ? "Muitas tentativas. Aguarde alguns minutos."
            : resendSeconds > 0
              ? `Reenviar código em ${resendSeconds}s`
              : "Reenviar código"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className={titleClass}>{compact ? "Faça login para continuar" : "Acesse sua conta"}</h2>
      <p className={subtitleClass}>
        {compact ? "Escolha uma forma de entrada para continuar" : "Escolha como deseja continuar"}
      </p>

      <div className="mt-7 flex flex-col gap-3">
        <button
          type="button"
          disabled={oauthLoading}
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white py-3.5 text-sm font-semibold text-[#1a2e28] disabled:opacity-70"
        >
          <IconGoogle />
          {oauthLoading ? "Redirecionando..." : "Entrar com Google"}
        </button>

        <div className="flex items-center gap-3">
          <div className={compact ? "h-px flex-1 bg-zinc-200" : "h-px flex-1 bg-white/30"} />
          <span className={compact ? "text-xs text-[#9aa8a3]" : "text-xs text-white/60"}>ou</span>
          <div className={compact ? "h-px flex-1 bg-zinc-200" : "h-px flex-1 bg-white/30"} />
        </div>

        <button
          type="button"
          onClick={() => setScreen("phone")}
          className={`flex w-full items-center justify-center gap-3 rounded-xl border py-3.5 text-sm font-semibold ${
            compact
              ? "border-[#d8dfdc] bg-[#f0f4f3] text-[#1a4a3a]"
              : "border-white/30 bg-white/10 text-white"
          }`}
        >
          <IconMessage />
          Entrar com SMS
        </button>
      </div>

      <p className={compact ? "mt-6 text-center text-xs text-[#9aa8a3]" : "mt-7 text-center text-xs text-white/50"}>
        🔒 Sua privacidade é nossa prioridade
      </p>
    </div>
  );
}
