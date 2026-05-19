"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";

function getUserName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    ""
  );
}

function getInitial(user) {
  return (getUserName(user) || "?").charAt(0).toUpperCase();
}

export default function EditarPerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nome, setNome] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user: currentUser } }) => {
      if (!currentUser) {
        router.replace("/perfil");
        return;
      }

      setUser(currentUser);
      setNome(getUserName(currentUser));
      setFotoUrl(
        currentUser.user_metadata?.avatar_url ||
          currentUser.user_metadata?.picture ||
          ""
      );
      setPreviewUrl(
        currentUser.user_metadata?.avatar_url ||
          currentUser.user_metadata?.picture ||
          ""
      );

      const { data: perfil } = await supabase
        .from("perfis")
        .select("nome,foto_url")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (perfil) {
        setNome(perfil.nome || getUserName(currentUser));
        setFotoUrl(perfil.foto_url || "");
        setPreviewUrl(perfil.foto_url || "");
      }

      setLoading(false);
    });
  }, [router]);

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploading(true);
    setMessage("");

    const supabase = createClient();
    const bucketName = "Guia de Bolso - Imagens";
    const filePath = `avatars/${user.id}/avatar.jpg`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || "image/jpeg",
      });

    if (uploadError) {
      setMessage("Não foi possível enviar a foto. Tente novamente.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    const publicUrl = data.publicUrl;
    const previewPublicUrl = `${publicUrl}?v=${Date.now()}`;

    const { error: perfilError } = await supabase.from("perfis").upsert(
      {
        id: user.id,
        nome: nome.trim() || getUserName(user),
        foto_url: publicUrl,
      },
      { onConflict: "id" }
    );

    if (perfilError) {
      setMessage("Foto enviada, mas não foi possível salvar no perfil.");
      setUploading(false);
      return;
    }

    await supabase.auth.updateUser({
      data: {
        avatar_url: publicUrl,
        picture: publicUrl,
      },
    });

    setFotoUrl(publicUrl);
    setPreviewUrl(previewPublicUrl);
    setMessage("Foto atualizada!");
    setUploading(false);
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.from("perfis").upsert(
      {
        id: user.id,
        nome: nome.trim(),
        foto_url: fotoUrl,
      },
      { onConflict: "id" }
    );

    if (error) {
      setMessage("Não foi possível salvar agora. Verifique a tabela perfis.");
      setSaving(false);
      return;
    }

    await supabase.auth.updateUser({
      data: {
        full_name: nome.trim(),
        name: nome.trim(),
        avatar_url: fotoUrl,
        picture: fotoUrl,
      },
    });

    setSaving(false);
    setMessage("Perfil atualizado!");
    setTimeout(() => {
      router.push("/perfil");
    }, 650);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando...
      </div>
    );
  }

  const avatarUrl = previewUrl || fotoUrl;

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-[#1a2e28]">
      <div className="mx-auto max-w-md px-4 pb-10 pt-6">
        <header className="mb-6 flex items-center gap-3">
          <Link
            href="/perfil"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-semibold text-[#1a4a3a] shadow-sm"
            aria-label="Voltar"
          >
            ←
          </Link>
          <h1 className="text-2xl font-bold text-[#1a2e28]">Editar perfil</h1>
        </header>

        <form onSubmit={handleSave} className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-[#d4ede8]"
              aria-label="Alterar foto"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#1a4a3a] text-3xl font-bold text-white">
                  {getInitial(user)}
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-xs font-semibold text-white transition-colors group-hover:bg-black/55">
                {uploading ? (
                  <span className="h-7 w-7 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <>
                    <svg className="mb-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20 5h-3.17l-1.84-2H9.01L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 13a5 5 0 110-10 5 5 0 010 10z" />
                    </svg>
                    Alterar
                  </>
                )}
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              hidden
              onChange={handlePhotoChange}
            />
          </div>

          <label className="mt-6 block text-sm font-semibold text-[#1a2e28]">
            Nome completo
            <input
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              className="mt-2 w-full rounded-xl bg-[#f0f4f3] px-4 py-3 text-sm font-normal text-[#1a2e28] focus:outline-none focus:ring-2 focus:ring-[#1a4a3a]/30"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#1a2e28]">
            Email
            <input
              type="email"
              value={user.email ?? ""}
              readOnly
              className="mt-2 w-full rounded-xl bg-zinc-100 px-4 py-3 text-sm font-normal text-zinc-500"
            />
          </label>

          {message && (
            <p className="mt-4 text-center text-sm text-[#5a6b66]">{message}</p>
          )}

          <button
            type="submit"
            disabled={saving || uploading}
            className="mt-6 w-full rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#153d30] active:bg-[#123528] disabled:opacity-70"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}
