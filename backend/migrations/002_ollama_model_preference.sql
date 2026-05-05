-- Add preferred Ollama model for dynamic model selection
alter table public.user_profiles
  add column if not exists preferred_ollama_model text;
