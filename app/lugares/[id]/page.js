"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import AvaliacaoForm from "@/components/AvaliacaoForm";
import IconBack from "@/components/IconBack";
import UserErrorAlert from "@/components/UserErrorAlert";
import LoginModal from "@/components/LoginModal";
import LugarAvaliacoesSection from "@/components/lugar/LugarAvaliacoesSection";
import { AVALIACAO_STATUS_APROVADOS } from "@/lib/avaliacoes";
import LugarCtaFixo from "@/components/lugar/LugarCtaFixo";
import LugarHero from "@/components/lugar/LugarHero";
import LugarClimaWidget from "@/components/lugar/LugarClimaWidget";
import LugarHorariosCompact from "@/components/lugar/LugarHorariosCompact";
import LugarLocalizacaoCard from "@/components/lugar/LugarLocalizacaoCard";
import LugarQuickActions from "@/components/lugar/LugarQuickActions";
import LugarTags from "@/components/lugar/LugarTags";
import { getCapaFromLugar, getFotosFromLugar } from "@/lib/fotos";
import { saveLugarVisitado } from "@/lib/lugaresVisitados";
import { buildReportContext } from "@/lib/reportContext";
import { fetchLugarEhParceiroVigente, getBadgeParceiroLabel } from "@/lib/destaques";
import {
  getFotosParaExibicao,
  getTextoSobre,
  getVisibilidadePerfil,
} from "@/lib/lugarVisibilidade";
import {
  getAcoesRapidasEstabelecimento,
  getAcoesRapidasLocais,
  getCtaIrAgoraText,
  getFraseConvencimento,
  getHorarioResumo,
  getResumoAvaliacoes,
  getStaticMapUrl,
  isLugarEstabelecimento,
} from "@/lib/lugarDetalhe";
import { lugarExibeClima } from "@/lib/clima";
import { getDistanciaLugar } from "@/lib/localizacao";
import { createClient } from "@/lib/supabase";
import { registrarLog } from "@/lib/logs";
import {
  formatHorario,
  getDiaAtualKey,
  getDiasHorario,
  getStatusFuncionamento,
} from "@/lib/horarios";

const categoriaStyles = {
  Natureza: "bg-[#b8e6d4] text-[#1a4a3a]",
  Gastronomia: "bg-[#f0e4d4] text-[#6b5344]",
  Noite: "bg-[#e4d4f0] text-[#5c4a6e]",
  Serviços: "bg-[#c5dff5] text-[#2a5a7a]",
  Hospedagem: "bg-[#f5e6b8] text-[#7a6520]",
};

/**
 * Builds a maps search/navigation query from coordinates or address.
 * @param {object} lugar - Place record.
 * @param {object} [localizacao] - Related `localizacoes` row.
 * @returns {string} Query string for map apps.
 */
function getRouteQuery(lugar, localizacao) {
  const latitude = Number(localizacao?.latitude);
  const longitude = Number(localizacao?.longitude);

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return `${latitude},${longitude}`;
  }

  return localizacao?.endereco_completo || lugar.endereco || `${lugar.nome} Imbituba Santa Catarina`;
}

/**
 * Google Maps deep link for the place.
 * @param {object} lugar - Place record.
 * @param {object} [localizacao] - Related location row.
 * @returns {string} Google Maps URL.
 */
function googleMapsUrl(lugar, localizacao) {
  const query = encodeURIComponent(getRouteQuery(lugar, localizacao));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * Apple Maps deep link for the place.
 * @param {object} lugar - Place record.
 * @param {object} [localizacao] - Related location row.
 * @returns {string} Apple Maps URL.
 */
function appleMapsUrl(lugar, localizacao) {
  return `https://maps.apple.com/?q=${encodeURIComponent(getRouteQuery(lugar, localizacao))}`;
}

/**
 * Waze navigation deep link for the place.
 * @param {object} lugar - Place record.
 * @param {object} [localizacao] - Related location row.
 * @returns {string} Waze URL.
 */
function wazeUrl(lugar, localizacao) {
  const latitude = Number(localizacao?.latitude);
  const longitude = Number(localizacao?.longitude);

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  }

  return `https://waze.com/ul?q=${encodeURIComponent(getRouteQuery(lugar, localizacao))}&navigate=yes`;
}

/**
 * Normalizes an Instagram handle or URL to a full profile link.
 * @param {string} [value] - Handle or URL.
 * @returns {string|null} Instagram URL or null.
 */
function instagramUrl(value) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const handle = value.replace("@", "");
  return `https://instagram.com/${handle}`;
}

/**
 * Bottom sheet for hours, navigation choice, and review form on place detail.
 * @param {{ isOpen: boolean, onClose: () => void, title: string, children: import("react").ReactNode }} props
 * @returns {import("react").ReactElement|null}
 */
function BottomSheet({ isOpen, onClose, title, children }) {
  const titleId = useId();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[24px] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{ animation: "sheetIn 220ms ease-out" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <style>{`
          @keyframes sheetIn {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#d8dfdc]" />
        <h2 id={titleId} className="mb-4 text-lg font-bold text-[#1a2e28]">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

/**
 * Place detail page: photos, hours, reviews, favorites, and navigation.
 * @returns {import("react").ReactElement}
 */
export default function LugarPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lugar, setLugar] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [fotoAtual, setFotoAtual] = useState(0);
  const carouselRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHorarios, setShowHorarios] = useState(false);
  const [showRotas, setShowRotas] = useState(false);
  const [sobreExpandido, setSobreExpandido] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [jaAvaliou, setJaAvaliou] = useState(false);
  const [showAvaliacaoForm, setShowAvaliacaoForm] = useState(false);
  const [toast, setToast] = useState("");
  const [motivoModal, setMotivoModal] = useState("favoritar");
  const [localizacao, setLocalizacao] = useState(null);
  const [subcategoria, setSubcategoria] = useState(null);
  const [tags, setTags] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [ehParceiro, setEhParceiro] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => undefined,
      { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsFavorito(false);
        setJaAvaliou(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsFavorito(false);
        setJaAvaliou(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!id) return;

    const supabase = createClient();

    supabase
      .from("lugares")
      .select("*")
      .eq("id", id)
      .eq("status", "ativo")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setFetchError(true);
          setLugar(null);
          setLoading(false);
          return;
        }

        setFetchError(false);
        setLugar(data);
        if (data) {
          saveLugarVisitado(data, getCapaFromLugar(data));
        }
        const fotosJson = getFotosFromLugar(data);
        if (fotosJson.length > 0) {
          setFotos(fotosJson);
        }
        setLoading(false);
      });

    supabase
      .from("fotos_lugar")
      .select("*")
      .eq("lugar_id", id)
      .then(({ data }) => {
        setFotos((current) => {
          if (current.length > 0) return current;
          return (data ?? [])
            .map((foto) => foto.url || foto.imagem_url || foto.foto_url)
            .filter(Boolean);
        });
      });

    supabase
      .from("localizacoes")
      .select("*")
      .eq("lugar_id", id)
      .maybeSingle()
      .then(({ data }) => setLocalizacao(data));

    supabase
      .from("lugares_tags")
      .select("tags(*)")
      .eq("lugar_id", id)
      .then(({ data }) => {
        setTags((data ?? []).map((item) => item.tags).filter(Boolean));
      });

    fetchLugarEhParceiroVigente(supabase, id).then(setEhParceiro);
  }, [id]);

  useEffect(() => {
    if (!lugar?.categoria || !lugar?.subcategoria) {
      const timer = setTimeout(() => {
        setSubcategoria(null);
      }, 0);

      return () => clearTimeout(timer);
    }

    const supabase = createClient();
    supabase
      .from("subcategorias")
      .select("*")
      .eq("categoria", lugar.categoria)
      .eq("nome", lugar.subcategoria)
      .maybeSingle()
      .then(({ data }) => setSubcategoria(data));
  }, [lugar]);

  useEffect(() => {
    if (!user || !lugar) return;

    const supabase = createClient();

    supabase
      .from("favoritos")
      .select("lugar_id")
      .eq("user_id", user.id)
      .eq("lugar_id", lugar.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsFavorito(Boolean(data));
      });

    supabase
      .from("avaliacoes")
      .select("id")
      .eq("user_id", user.id)
      .eq("lugar_id", lugar.id)
      .maybeSingle()
      .then(({ data }) => {
        setJaAvaliou(Boolean(data));
      });
  }, [user, lugar]);

  useEffect(() => {
    if (!id) return;

    const supabase = createClient();

    supabase
      .from("avaliacoes")
      .select("*, perfis:user_id(nome, foto_url, created_at)")
      .eq("lugar_id", id)
      .in("status", AVALIACAO_STATUS_APROVADOS)
      .order("created_at", { ascending: false })
      .then(async ({ data, error }) => {
        if (!error) {
          setAvaliacoes(data ?? []);
          return;
        }

        const { data: fallbackData } = await supabase
          .from("avaliacoes")
          .select("*")
          .eq("lugar_id", id)
          .in("status", AVALIACAO_STATUS_APROVADOS)
          .order("created_at", { ascending: false });

        setAvaliacoes(fallbackData ?? []);
      });
  }, [id]);

  /**
   * Toggles favorite for the current place with optimistic UI.
   * @returns {Promise<void>}
   */
  async function handleFavoritar() {
    if (!user) {
      setMotivoModal("favoritar");
      setIsModalOpen(true);
      return;
    }

    const supabase = createClient();
    const proximoEstado = !isFavorito;
    setIsFavorito(proximoEstado);

    if (isFavorito) {
      const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("lugar_id", lugar.id);

      if (error) {
        setIsFavorito(true);
      } else {
        await registrarLog(supabase, user, "desfavoritou", {
          lugar_id: lugar.id,
          lugar_nome: lugar.nome,
        });
      }
      return;
    }

    const { error } = await supabase
      .from("favoritos")
      .insert({ user_id: user.id, lugar_id: lugar.id });

    if (error) {
      setIsFavorito(false);
    } else {
      await registrarLog(supabase, user, "favoritou", {
        lugar_id: lugar.id,
        lugar_nome: lugar.nome,
      });
    }
  }

  /**
   * Opens the review sheet or login modal; blocks if user already reviewed.
   * @returns {Promise<void>}
   */
  async function handleOpenAvaliacao() {
    if (!user) {
      setMotivoModal("avaliar");
      setIsModalOpen(true);
      return;
    }

    const supabase = createClient();
    const { data } = await supabase
      .from("avaliacoes")
      .select("id")
      .eq("user_id", user.id)
      .eq("lugar_id", lugar.id)
      .maybeSingle();

    if (data) {
      setJaAvaliou(true);
      return;
    }

    setShowAvaliacaoForm(true);
  }

  /**
   * Após envio do formulário de avaliação.
   * @returns {void}
   */
  function handleAvaliacaoEnviada() {
    setJaAvaliou(true);
    setToast(
      "Obrigado! Sua avaliação será analisada pela nossa equipe e publicada em breve."
    );
    setTimeout(() => setToast(""), 4000);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#f0f4f3] px-4 py-6 text-[#1a2e28]">
        <div className="mx-auto max-w-md">
          <UserErrorAlert
            message="Erro ao carregar o lugar. Tente novamente."
            reportContext={buildReportContext({
              code: "NOT_FOUND",
              route: `/lugares/${id}`,
            })}
            action={
              <button
                type="button"
                onClick={() => router.refresh()}
                className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-800"
              >
                Tentar novamente
              </button>
            }
          />
        </div>
      </div>
    );
  }

  if (!lugar) {
    return (
      <div className="min-h-screen bg-[#f0f4f3] px-4 py-6 text-[#1a2e28]">
        <div className="mx-auto max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1a4a3a] transition-opacity hover:opacity-80"
          >
            <IconBack className="h-4 w-4" />
            Voltar
          </Link>
          <p className="mt-8 text-sm text-[#5a6b66]">Lugar não encontrado.</p>
        </div>
      </div>
    );
  }

  const badgeStyle =
    categoriaStyles[lugar.categoria] ?? "bg-white text-[#1a4a3a]";
  const visibilidade = getVisibilidadePerfil(ehParceiro);
  const capaUrl = getCapaFromLugar(lugar);
  const fotosCompletas = fotos.length > 0 ? fotos : getFotosFromLugar(lugar);
  const imagens = getFotosParaExibicao(
    fotosCompletas,
    capaUrl,
    visibilidade.showGaleriaCompleta
  );
  const status = getStatusFuncionamento(lugar.horarios);
  const diaAtual = getDiaAtualKey();
  const enderecoExibicao = (
    localizacao?.endereco_completo?.trim() ||
    lugar.endereco?.trim() ||
    ""
  );
  const descricaoLonga = getTextoSobre(lugar, visibilidade.showDescricaoLonga);
  const totalAvaliacoes = avaliacoes.length;
  const mediaAvaliacoes =
    totalAvaliacoes > 0
      ? avaliacoes.reduce((sum, avaliacao) => sum + Number(avaliacao.nota || 0), 0) /
        totalAvaliacoes
      : 0;

  const lugarParaDistancia = { ...lugar, localizacoes: localizacao };
  const distancia = getDistanciaLugar(lugarParaDistancia, userPosition);
  const tagsExibidas = visibilidade.showTags ? tags : [];
  const fraseConvencimento = getFraseConvencimento(
    { ...lugar, ehParceiro },
    tagsExibidas
  );
  const resumoAvaliacoes = getResumoAvaliacoes(avaliacoes, lugar.categoria);
  const horarioResumo = getHorarioResumo(status);
  const ehEstabelecimento = isLugarEstabelecimento(lugar);
  const ctaLabel = getCtaIrAgoraText(status, ehEstabelecimento);
  const staticMapSrc = getStaticMapUrl(localizacao);
  const mapsLink = googleMapsUrl(lugar, localizacao);
  const acoesRapidasBase = ehEstabelecimento
    ? visibilidade.showAcoesRapidasEstabelecimento
      ? getAcoesRapidasEstabelecimento({
          telefone: lugar.telefone?.trim() || undefined,
          instagramHref: lugar.instagram?.trim()
            ? instagramUrl(lugar.instagram)
            : null,
          cardapioUrl: lugar.cardapio_url?.trim() || undefined,
          siteUrl: lugar.site_url?.trim() || undefined,
        })
      : []
    : getAcoesRapidasLocais(lugar, tags, distancia);
  const acoesRapidas = ehEstabelecimento
    ? acoesRapidasBase.filter((acao) => acao.href)
    : acoesRapidasBase;
  const modoAcoes = ehEstabelecimento ? "estabelecimento" : "publico";

  /** Updates the photo carousel index from horizontal scroll position. */
  function handleCarouselScroll() {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const nextIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
    setFotoAtual(nextIndex);
  }

  /**
   * Opens the user's preferred maps app and logs the IR AGORA action.
   * @param {string} [preference] - Override: `google`, `apple`, or `waze`.
   */
  function openRoute(preference) {
    const selected = preference || localStorage.getItem("map_app_preferido");

    if (!selected) {
      setShowRotas(true);
      return;
    }

    localStorage.setItem("map_app_preferido", selected);
    setShowRotas(false);
    registrarLog(createClient(), user, "ir_agora", {
      lugar_id: lugar.id,
      lugar_nome: lugar.nome,
      app: selected,
    });

    const urls = {
      google: googleMapsUrl(lugar, localizacao),
      apple: appleMapsUrl(lugar, localizacao),
      waze: wazeUrl(lugar, localizacao),
    };

    window.open(urls[selected], "_blank", "noopener,noreferrer");
  }

  /**
   * Shares the place via Web Share API or copies the link to clipboard.
   * @returns {Promise<void>}
   */
  async function handleShare() {
    const shareData = {
      title: lugar.nome,
      text: lugar.descricao,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setToast("Link copiado!");
      setTimeout(() => setToast(""), 2500);
    } catch {
      // O usuario pode cancelar o share nativo; nesse caso nao exibimos erro.
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f4f3] pb-28 text-[#1a2e28]">
      {toast && (
        <div className="fixed left-4 right-4 top-4 z-[60] mx-auto max-w-md rounded-2xl bg-[#1a4a3a] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
      <div className="mx-auto max-w-md">
        <LugarHero
          nome={lugar.nome}
          imagens={imagens}
          fotoAtual={fotoAtual}
          carouselRef={carouselRef}
          onCarouselScroll={handleCarouselScroll}
          categoria={lugar.categoria}
          categoriaStyle={badgeStyle}
          subcategoria={lugar.subcategoria}
          subcategoriaIcone={subcategoria?.icone}
          distancia={distancia}
          mediaAvaliacoes={mediaAvaliacoes}
          totalAvaliacoes={totalAvaliacoes}
          status={status}
          mostrarStatusAbertura={ehEstabelecimento}
          isFavorito={isFavorito}
          onFavoritar={handleFavoritar}
          onShare={handleShare}
        />

        <div className="px-4 pb-8 pt-5">
          {visibilidade.showBadgeParceiro && (
            <span className="mb-3 inline-flex rounded-full bg-[#f5e6b8] px-3 py-1 text-xs font-bold text-[#7a6520]">
              {getBadgeParceiroLabel()}
            </span>
          )}
          <p className="text-base font-semibold leading-snug text-[#1a4a3a]">
            {fraseConvencimento}
          </p>

          {acoesRapidas.length > 0 && (
            <LugarQuickActions modo={modoAcoes} acoes={acoesRapidas} />
          )}

          {tagsExibidas.length > 0 && <LugarTags tags={tagsExibidas} />}

          {lugar.mostrar_horarios && (
            <LugarHorariosCompact
              resumo={horarioResumo}
              aberto={status.aberto}
              onVerCompletos={() => setShowHorarios(true)}
            />
          )}

          {lugarExibeClima(lugar, localizacao) && (
            <LugarClimaWidget
              nomeLugar={lugar.nome}
              latitude={Number(localizacao.latitude)}
              longitude={Number(localizacao.longitude)}
              user={user}
              onLoginRequired={() => {
                setMotivoModal("clima");
                setIsModalOpen(true);
              }}
            />
          )}

          {lugar.mostrar_endereco && enderecoExibicao && (
            <LugarLocalizacaoCard
              nome={lugar.nome}
              endereco={enderecoExibicao}
              mapUrl={mapsLink}
              staticMapSrc={staticMapSrc}
              latitude={localizacao?.latitude}
              longitude={localizacao?.longitude}
              onAbrirMapa={() => openRoute()}
            />
          )}

          {descricaoLonga && (
            <section className="mt-6">
              <h2 className="mb-3 text-sm font-bold text-[#1a2e28]">Sobre</h2>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e8eeee]">
                <p
                  className={`text-sm leading-relaxed text-[#5a6b66] ${
                    sobreExpandido ? "" : "line-clamp-4"
                  }`}
                >
                  {descricaoLonga}
                </p>
                {!sobreExpandido && descricaoLonga.length > 180 && (
                  <button
                    type="button"
                    onClick={() => setSobreExpandido(true)}
                    className="mt-2 text-sm font-semibold text-[#1a4a3a]"
                  >
                    Leia mais →
                  </button>
                )}
              </div>
            </section>
          )}

          <LugarAvaliacoesSection
            avaliacoes={avaliacoes}
            jaAvaliou={jaAvaliou}
            onAvaliar={handleOpenAvaliacao}
            toast={toast}
          />
        </div>
      </div>

      <LugarCtaFixo label={ctaLabel} onClick={() => openRoute()} />

      <BottomSheet
        isOpen={showHorarios}
        onClose={() => setShowHorarios(false)}
        title="Horários completos"
      >
        <div className="space-y-2">
          {getDiasHorario().map(({ key, label }) => {
            const value = lugar.horarios?.[key] ?? "fechado";
            const isToday = key === diaAtual;
            return (
              <div
                key={key}
                className={`flex items-center justify-between rounded-2xl px-3 py-2 text-sm ${
                  isToday ? "bg-[#d4ede8] font-bold text-[#1a4a3a]" : "text-[#5a6b66]"
                }`}
              >
                <span className="capitalize">{label}</span>
                {value === "fechado" ? (
                  <span className="rounded-full bg-zinc-200 px-2 py-1 text-xs font-semibold text-zinc-600">
                    Fechado
                  </span>
                ) : (
                  <span>{formatHorario(value)}</span>
                )}
              </div>
            );
          })}
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={showRotas}
        onClose={() => setShowRotas(false)}
        title="Abrir rota com"
      >
        <div className="grid gap-3">
          {[
            ["google", "Google Maps"],
            ["apple", "Apple Maps"],
            ["waze", "Waze"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => openRoute(key)}
              className="rounded-xl bg-[#1a4a3a] py-3.5 text-sm font-semibold text-white"
            >
              {label}
            </button>
          ))}
        </div>
      </BottomSheet>

      <AvaliacaoForm
        isOpen={showAvaliacaoForm}
        onClose={() => setShowAvaliacaoForm(false)}
        lugar={{
          id: lugar.id,
          nome: lugar.nome,
          categoria: lugar.categoria,
          subcategoria: lugar.subcategoria,
        }}
        onSuccess={handleAvaliacaoEnviada}
      />

      <LoginModal
        isOpen={isModalOpen}
        motivo={motivoModal}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
