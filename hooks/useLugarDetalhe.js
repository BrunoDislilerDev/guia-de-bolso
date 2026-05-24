"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AVALIACAO_STATUS_APROVADOS } from "@/lib/avaliacoes";
import { fetchLugarEhParceiroVigente } from "@/lib/destaques";
import { getCapaFromLugar, getFotosFromLugar } from "@/lib/fotos";
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
import {
  appleMapsUrl,
  CATEGORIA_STYLES,
  googleMapsUrl,
  instagramUrl,
  wazeUrl,
} from "@/lib/lugarDetalheMaps";
import {
  getFotosParaExibicao,
  getTextoSobre,
  getVisibilidadePerfil,
} from "@/lib/lugarVisibilidade";
import { saveLugarVisitado } from "@/lib/lugaresVisitados";
import { getDistanciaLugar } from "@/lib/localizacao";
import { registrarLog } from "@/lib/logs";
import { MAP_PREFERENCE_STORAGE_KEY } from "@/lib/perfil";
import { createClient } from "@/lib/supabase";
import { getDiaAtualKey, getStatusFuncionamento } from "@/lib/horarios";

/**
 * Estado e ações compartilhados entre layout legado e redesign Airbnb.
 * @returns {object}
 */
export function useLugarDetalhe() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lugar, setLugar] = useState(null);
  const [fotos, setFotos] = useState([]);
  const viewLoggedRef = useRef(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHorarios, setShowHorarios] = useState(false);
  const [showRotas, setShowRotas] = useState(false);
  const [mapPreference, setMapPreference] = useState("google");
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
  const [showQrBanner, setShowQrBanner] = useState(false);

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
    viewLoggedRef.current = false;
  }, [id]);

  useEffect(() => {
    if (!lugar?.id || viewLoggedRef.current) return;

    viewLoggedRef.current = true;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      registrarLog(supabase, currentUser, "visualizou_lugar", {
        lugar_id: lugar.id,
        lugar_nome: lugar.nome,
        pagina: `/lugares/${lugar.id}`,
      });
    });
  }, [lugar]);

  useEffect(() => {
    if (searchParams.get("ref") !== "qr" || !lugar?.id || !lugar?.nome) return;

    const key = `qr_banner_${lugar.id}`;
    if (sessionStorage.getItem(key)) {
      setShowQrBanner(false);
      return;
    }

    sessionStorage.setItem(key, "1");
    setShowQrBanner(true);
  }, [searchParams, lugar?.id, lugar?.nome]);

  useEffect(() => {
    if (!lugar?.categoria || !lugar?.subcategoria) {
      const timer = setTimeout(() => setSubcategoria(null), 0);
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
      .then(({ data }) => setIsFavorito(Boolean(data)));

    supabase
      .from("avaliacoes")
      .select("id")
      .eq("user_id", user.id)
      .eq("lugar_id", lugar.id)
      .maybeSingle()
      .then(({ data }) => setJaAvaliou(Boolean(data)));
  }, [user, lugar]);

  useEffect(() => {
    const stored = localStorage.getItem(MAP_PREFERENCE_STORAGE_KEY);
    if (stored) setMapPreference(stored);
  }, []);

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

  function handleAvaliacaoEnviada() {
    setJaAvaliou(true);
    setToast(
      "Obrigado! Sua avaliação será analisada pela nossa equipe e publicada em breve."
    );
    setTimeout(() => setToast(""), 4000);
  }

  function launchNavigationApp(appKey, remember = true) {
    if (!lugar) return;

    if (remember) {
      localStorage.setItem(MAP_PREFERENCE_STORAGE_KEY, appKey);
      setMapPreference(appKey);
    }

    setShowRotas(false);
    registrarLog(createClient(), user, "ir_agora", {
      lugar_id: lugar.id,
      lugar_nome: lugar.nome,
      app: appKey,
    });

    const urls = {
      google: googleMapsUrl(lugar, localizacao),
      apple: appleMapsUrl(lugar, localizacao),
      waze: wazeUrl(lugar, localizacao),
    };

    window.open(urls[appKey], "_blank", "noopener,noreferrer");
  }

  function openRoute(preference) {
    const selected =
      preference || localStorage.getItem(MAP_PREFERENCE_STORAGE_KEY);

    if (!selected) {
      setShowRotas(true);
      return;
    }

    launchNavigationApp(selected, true);
  }

  async function handleShare() {
    if (!lugar) return;

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
      // Cancelamento do share nativo.
    }
  }

  const visibilidade = lugar ? getVisibilidadePerfil(ehParceiro) : null;
  const capaUrl = lugar ? getCapaFromLugar(lugar) : null;
  const fotosCompletas = lugar
    ? fotos.length > 0
      ? fotos
      : getFotosFromLugar(lugar)
    : [];
  const imagens =
    lugar && visibilidade
      ? getFotosParaExibicao(
          fotosCompletas,
          capaUrl,
          visibilidade.showGaleriaCompleta
        )
      : [];
  const status = lugar ? getStatusFuncionamento(lugar.horarios) : null;
  const diaAtual = getDiaAtualKey();
  const enderecoExibicao = lugar
    ? localizacao?.endereco_completo?.trim() || lugar.endereco?.trim() || ""
    : "";
  const descricaoLonga =
    lugar && visibilidade
      ? getTextoSobre(lugar, visibilidade.showDescricaoLonga)
      : null;
  const totalAvaliacoes = avaliacoes.length;
  const mediaAvaliacoes =
    totalAvaliacoes > 0
      ? avaliacoes.reduce((sum, a) => sum + Number(a.nota || 0), 0) /
        totalAvaliacoes
      : 0;
  const distancia = lugar
    ? getDistanciaLugar({ ...lugar, localizacoes: localizacao }, userPosition)
    : null;
  const tagsExibidas =
    lugar && visibilidade && visibilidade.showTags ? tags : [];
  const fraseConvencimento = lugar
    ? getFraseConvencimento({ ...lugar, ehParceiro }, tagsExibidas)
    : "";
  const resumoAvaliacoes = lugar
    ? getResumoAvaliacoes(avaliacoes, lugar.categoria)
    : null;
  const horarioResumo = status ? getHorarioResumo(status) : "";
  const ehEstabelecimento = lugar ? isLugarEstabelecimento(lugar) : true;
  const ctaLabel = status ? getCtaIrAgoraText(status, ehEstabelecimento) : "";
  const staticMapSrc = getStaticMapUrl(localizacao);
  const mapsLink = lugar ? googleMapsUrl(lugar, localizacao) : "";
  const acoesRapidasBase =
    lugar && visibilidade
      ? ehEstabelecimento
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
        : getAcoesRapidasLocais(lugar, tags, distancia)
      : [];
  const acoesRapidas = ehEstabelecimento
    ? acoesRapidasBase.filter((acao) => acao.href)
    : acoesRapidasBase;
  const modoAcoes = ehEstabelecimento ? "estabelecimento" : "publico";
  const badgeStyle = lugar
    ? CATEGORIA_STYLES[lugar.categoria] ?? "bg-white text-[#1a4a3a]"
    : "";

  return {
    id,
    router,
    lugar,
    loading,
    fetchError,
    user,
    isFavorito,
    toast,
    showQrBanner,
    setShowQrBanner,
    showHorarios,
    setShowHorarios,
    showRotas,
    setShowRotas,
    mapPreference,
    sobreExpandido,
    setSobreExpandido,
    avaliacoes,
    jaAvaliou,
    showAvaliacaoForm,
    setShowAvaliacaoForm,
    isModalOpen,
    setIsModalOpen,
    motivoModal,
    localizacao,
    subcategoria,
    tags,
    ehParceiro,
    visibilidade,
    imagens,
    status,
    diaAtual,
    enderecoExibicao,
    descricaoLonga,
    totalAvaliacoes,
    mediaAvaliacoes,
    distancia,
    tagsExibidas,
    fraseConvencimento,
    resumoAvaliacoes,
    horarioResumo,
    ehEstabelecimento,
    ctaLabel,
    staticMapSrc,
    mapsLink,
    acoesRapidas,
    modoAcoes,
    badgeStyle,
    handleFavoritar,
    handleShare,
    handleOpenAvaliacao,
    handleAvaliacaoEnviada,
    launchNavigationApp,
    openRoute,
  };
}
