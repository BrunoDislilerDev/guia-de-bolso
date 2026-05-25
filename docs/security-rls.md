# Segurança RLS — checklist produção

Compare cada política no **Supabase Dashboard → Authentication → Policies** com os arquivos em `supabase/`.

**Ordem completa de migrations:** [migrations.md → Manifest](./migrations.md#manifest). Arquitetura e roadmap: [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md).

## Ordem sugerida de aplicação (P0)

1. `rotas_policies.sql` — define `is_admin_user()`
2. `perfis_rls_fix.sql` — define `is_admin_or_dev()`
3. `perfis_premium_policies.sql`
4. `perfis_privileged_guard.sql` — trigger anti-escalação
5. `lugares_public_read.sql` + `lugares_admin_write.sql`
6. `logs_policies.sql`
7. `storage_admin_fotos.sql` (após buckets)
8. `db_indexes.sql` + `db_indexes_phase2.sql` + `lugares_populares_rpc.sql` + `lugares_populares_rpc_fix.sql`

## Testes manuais pós-deploy

- Usuário comum: `UPDATE perfis SET role='admin'` no próprio id → deve falhar ou reverter via trigger.
- Usuário comum: `SELECT * FROM logs` → sem linhas (403/empty).
- Usuário comum: upload em `lugares-fotos` → negado.
- Admin: CRUD em `lugares`, leitura `logs`, upload fotos → permitido.

## Drift

Se produção divergir do repo, exporte policies do dashboard e alinhe com os SQL versionados antes de escalar tráfego.
