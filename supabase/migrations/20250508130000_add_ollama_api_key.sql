alter table public.user_profiles
add column if not exists ollama_api_key text;
