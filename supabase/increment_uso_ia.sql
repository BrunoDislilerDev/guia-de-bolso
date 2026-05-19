-- Funções atômicas para contadores de IA (evita race condition e problemas de RLS).
-- Rode no SQL Editor do Supabase após premium_usuario.sql

CREATE OR REPLACE FUNCTION increment_busca_ia(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_month text;
  v_perfil perfis%ROWTYPE;
  v_used int;
  v_roteiros int;
  v_limit int := 3;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM p_user_id THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'code', 'LOGIN_REQUIRED',
      'message', 'Faça login para usar a busca com IA.'
    );
  END IF;

  v_month := to_char(timezone('America/Sao_Paulo', now()), 'YYYY-MM');

  SELECT * INTO v_perfil FROM perfis WHERE id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO perfis (id, nome, uso_ia_mes, buscas_ia, roteiros_ia)
    VALUES (
      p_user_id,
      COALESCE(auth.jwt() ->> 'email', 'Usuário'),
      v_month,
      1,
      0
    );
    RETURN jsonb_build_object(
      'allowed', true,
      'code', 'OK',
      'usage', jsonb_build_object(
        'premium', false,
        'month', v_month,
        'buscas', jsonb_build_object('used', 1, 'limit', v_limit, 'remaining', v_limit - 1),
        'roteiros', jsonb_build_object('used', 0, 'limit', 2, 'remaining', 2)
      )
    );
  END IF;

  IF v_perfil.premium_ativo IS TRUE
     AND (v_perfil.premium_ate IS NULL OR v_perfil.premium_ate > now()) THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'code', 'OK',
      'usage', jsonb_build_object(
        'premium', true,
        'month', v_month,
        'buscas', jsonb_build_object('used', COALESCE(v_perfil.buscas_ia, 0), 'limit', v_limit, 'remaining', null),
        'roteiros', jsonb_build_object('used', COALESCE(v_perfil.roteiros_ia, 0), 'limit', 2, 'remaining', null)
      )
    );
  END IF;

  v_used := CASE
    WHEN v_perfil.uso_ia_mes = v_month THEN COALESCE(v_perfil.buscas_ia, 0)
    ELSE 0
  END;

  v_roteiros := CASE
    WHEN v_perfil.uso_ia_mes = v_month THEN COALESCE(v_perfil.roteiros_ia, 0)
    ELSE 0
  END;

  IF v_used >= v_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'code', 'LIMIT_REACHED',
      'message', 'Você usou suas 3 buscas com IA deste mês. Assine o Premium por R$9,90/mês para uso ilimitado.',
      'usage', jsonb_build_object(
        'premium', false,
        'month', v_month,
        'buscas', jsonb_build_object('used', v_used, 'limit', v_limit, 'remaining', 0),
        'roteiros', jsonb_build_object('used', v_roteiros, 'limit', 2, 'remaining', greatest(0, 2 - v_roteiros))
      )
    );
  END IF;

  UPDATE perfis
  SET uso_ia_mes = v_month,
      buscas_ia = v_used + 1,
      roteiros_ia = v_roteiros
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'allowed', true,
    'code', 'OK',
    'usage', jsonb_build_object(
      'premium', false,
      'month', v_month,
      'buscas', jsonb_build_object('used', v_used + 1, 'limit', v_limit, 'remaining', greatest(0, v_limit - v_used - 1)),
      'roteiros', jsonb_build_object('used', v_roteiros, 'limit', 2, 'remaining', greatest(0, 2 - v_roteiros))
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION increment_roteiro_ia(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_month text;
  v_perfil perfis%ROWTYPE;
  v_used int;
  v_buscas int;
  v_limit int := 2;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM p_user_id THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'code', 'LOGIN_REQUIRED',
      'message', 'Faça login para criar roteiros com IA.'
    );
  END IF;

  v_month := to_char(timezone('America/Sao_Paulo', now()), 'YYYY-MM');

  SELECT * INTO v_perfil FROM perfis WHERE id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO perfis (id, nome, uso_ia_mes, buscas_ia, roteiros_ia)
    VALUES (
      p_user_id,
      COALESCE(auth.jwt() ->> 'email', 'Usuário'),
      v_month,
      0,
      1
    );
    RETURN jsonb_build_object(
      'allowed', true,
      'code', 'OK',
      'usage', jsonb_build_object(
        'premium', false,
        'month', v_month,
        'buscas', jsonb_build_object('used', 0, 'limit', 3, 'remaining', 3),
        'roteiros', jsonb_build_object('used', 1, 'limit', v_limit, 'remaining', v_limit - 1)
      )
    );
  END IF;

  IF v_perfil.premium_ativo IS TRUE
     AND (v_perfil.premium_ate IS NULL OR v_perfil.premium_ate > now()) THEN
    RETURN jsonb_build_object('allowed', true, 'code', 'OK', 'usage', jsonb_build_object(
      'premium', true,
      'month', v_month,
      'buscas', jsonb_build_object('used', COALESCE(v_perfil.buscas_ia, 0), 'limit', 3, 'remaining', null),
      'roteiros', jsonb_build_object('used', COALESCE(v_perfil.roteiros_ia, 0), 'limit', v_limit, 'remaining', null)
    ));
  END IF;

  v_used := CASE
    WHEN v_perfil.uso_ia_mes = v_month THEN COALESCE(v_perfil.roteiros_ia, 0)
    ELSE 0
  END;

  v_buscas := CASE
    WHEN v_perfil.uso_ia_mes = v_month THEN COALESCE(v_perfil.buscas_ia, 0)
    ELSE 0
  END;

  IF v_used >= v_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'code', 'LIMIT_REACHED',
      'message', 'Você usou seus 2 roteiros com IA deste mês. Assine o Premium por R$9,90/mês para uso ilimitado.',
      'usage', jsonb_build_object(
        'premium', false,
        'month', v_month,
        'buscas', jsonb_build_object('used', v_buscas, 'limit', 3, 'remaining', greatest(0, 3 - v_buscas)),
        'roteiros', jsonb_build_object('used', v_used, 'limit', v_limit, 'remaining', 0)
      )
    );
  END IF;

  UPDATE perfis
  SET uso_ia_mes = v_month,
      roteiros_ia = v_used + 1,
      buscas_ia = v_buscas
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'allowed', true,
    'code', 'OK',
    'usage', jsonb_build_object(
      'premium', false,
      'month', v_month,
      'buscas', jsonb_build_object('used', v_buscas, 'limit', 3, 'remaining', greatest(0, 3 - v_buscas)),
      'roteiros', jsonb_build_object('used', v_used + 1, 'limit', v_limit, 'remaining', greatest(0, v_limit - v_used - 1))
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION increment_busca_ia(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_roteiro_ia(uuid) TO authenticated;
