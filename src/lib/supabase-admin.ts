import { createClient } from '@supabase/supabase-js'

// Cliente com service_role — bypassa RLS. Usar APENAS em Server Components/API Routes.
// NUNCA expor com NEXT_PUBLIC_.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
