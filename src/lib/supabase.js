import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uijvzkpyrhpcwnhgbdge.supabase.co"

const supabaseKey = "sb_publishable_35QQgRvWZpGybUL7Jo9dPw_aQQYW-uB"

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)