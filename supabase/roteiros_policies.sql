-- RLS for user-saved AI itineraries (`roteiros`).
-- Required for DELETE (and consistent INSERT/SELECT) from the app.
-- Run in Supabase SQL Editor if delete appears to work in UI but rows return after reload.

ALTER TABLE roteiros ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own roteiros" ON roteiros;
CREATE POLICY "Users select own roteiros"
ON roteiros FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own roteiros" ON roteiros;
CREATE POLICY "Users insert own roteiros"
ON roteiros FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own roteiros" ON roteiros;
CREATE POLICY "Users update own roteiros"
ON roteiros FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own roteiros" ON roteiros;
CREATE POLICY "Users delete own roteiros"
ON roteiros FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
