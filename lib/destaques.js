/**
 * @deprecated Tabela `destaques` / `planos` para highlights comerciais — legado no Supabase.
 * O app usa `lugares.eh_parceiro` e `lugares.conteudo_curadoria` (ver `lib/lugarBadges.js`).
 * Rotas com `rotas.destaque` são outro domínio (rota curada).
 */

export {
  BADGE_PARCEIRO_LABEL,
  getBadgeParceiroLabel,
  getBadgeCuradoriaLabel,
  isParceiro,
  isConteudoCuradoria,
  enrichLugarFlags,
  enrichLugaresFlags,
} from "@/lib/lugarBadges";
