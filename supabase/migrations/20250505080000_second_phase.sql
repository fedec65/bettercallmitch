-- Second phase migration: Ollama privacy mode + Canton selector + i18n language preference

-- Ollama privacy mode settings
alter table public.user_profiles
  add column if not exists privacy_mode text not null default 'balanced'
  check (privacy_mode in ('standard', 'balanced', 'strict'));

alter table public.user_profiles
  add column if not exists ollama_host text default 'http://localhost:11434';

-- i18n language preference
alter table public.user_profiles
  add column if not exists preferred_language text not null default 'de'
  check (preferred_language in ('de', 'fr', 'it', 'en'));

-- Canton selector per-chat
alter table public.chats
  add column if not exists canton text
  check (canton is null or canton in (
    'ZH','BE','GE','VD','TI','BS','AG','LU','SG','ZG','SZ','BL','SO','TG','SH',
    'NW','OW','UR','GL','AR','AI','FR','NE','JU','GR','VS'
  ));
