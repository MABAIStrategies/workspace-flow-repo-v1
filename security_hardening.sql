-- Supabase Security Hardening Script
-- Resolves "Function Search Path Mutable" for handle_new_user
ALTER FUNCTION public.handle_new_user()
SET search_path = public;
-- Recommendation:
-- To fix "Leaked Password Protection Disabled", go to:
-- Authentication -> Settings -> Password Protection -> Enable "Leaked password protection"