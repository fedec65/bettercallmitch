-- Add missing columns from 001_second_phase.sql that weren't applied
alter table public.user_profiles
  add column if not exists privacy_mode text not null default 'balanced'
  check (privacy_mode in ('standard', 'balanced', 'strict'));

alter table public.user_profiles
  add column if not exists ollama_host text default 'http://localhost:11434';

alter table public.user_profiles
  add column if not exists preferred_language text not null default 'de'
  check (preferred_language in ('de', 'fr', 'it', 'en'));

alter table public.chats
  add column if not exists canton text
  check (canton is null or canton in (
    'ZH','BE','GE','VD','TI','BS','AG','LU','SG','ZG','SZ','BL','SO','TG','SH',
    'NW','OW','UR','GL','AR','AI','FR','NE','JU','GR','VS'
  ));
