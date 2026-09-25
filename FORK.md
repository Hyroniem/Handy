# Handy-fork: externe Whisper-server

Deze fork van [cjpais/Handy](https://github.com/cjpais/Handy) voegt één optie toe:
**Algemeen → Transcriptieserver → Externe server gebruiken**. Handy stuurt opnames
dan naar een OpenAI-compatibele server (`{URL}/audio/transcriptions`) en laadt zelf
geen model op de GPU.

## Downloaden

Elke push naar `main` bouwt via **Actions → Fork Build**:

- `handy-fork-ubuntu-22.04-x86_64-unknown-linux-gnu`: `.deb` voor Linux
- `handy-fork-x86_64-pc-windows-msvc`: `.exe`-installer en `.msi` voor Windows

De builds zijn niet ondertekend. Windows SmartScreen waarschuwt daarom bij de eerste
start: kies _Meer informatie → Toch uitvoeren_.

## Een upstream-update binnenhalen

1. Open https://github.com/Hyroniem/Handy. Staat er "This branch is N commits behind
   cjpais/Handy:main", klik dan op **Sync fork → Update branch**.
2. Lukt dat zonder conflict, dan start **Fork Build** vanzelf. Download en installeer
   daarna het nieuwe pakket. Upstream verhoogt het versienummer, dus het pakket
   installeert gewoon over de vorige versie heen.
3. Meldt GitHub een conflict, kies dan **nooit "Discard commits"**, want daarmee
   verdwijnt de externe-serveroptie. Los het lokaal op (zie hieronder) of vraag Claude
   om het te doen.

Een update binnenhalen is nooit verplicht. De fork blijft werken zoals hij is.

## Conflicten oplossen (lokaal)

```bash
cd ~/apps/handy-fork
git fetch upstream
git merge upstream/main   # conflicten oplossen, daarna:
git push origin main
```

Wat de fork ten opzichte van upstream verandert, voor wie de conflicten oplost:

| Bestand                                                                                                     | Wijziging                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src-tauri/src/managers/transcription.rs`                                                                   | `transcribe_remote()` + `encode_wav()`; `transcribe()` en `initiate_model_load()` gaan eerst naar de server als `remote_transcription_enabled` aan staat |
| `src-tauri/src/settings.rs`                                                                                 | velden `remote_transcription_enabled` / `remote_transcription_url`; `update_checks_forced_disabled()` geeft altijd `true`                                |
| `src-tauri/src/shortcut/mod.rs`, `lib.rs`                                                                   | twee `change_remote_transcription_*`-commando's                                                                                                          |
| `src-tauri/src/actions.rs`                                                                                  | geen live streaming bij een externe server                                                                                                               |
| `src-tauri/src/commands/models.rs`                                                                          | model niet laden bij een modelwissel als de server aan staat                                                                                             |
| `src-tauri/Cargo.toml`                                                                                      | reqwest-feature `multipart`                                                                                                                              |
| `src-tauri/tauri.conf.json`                                                                                 | `createUpdaterArtifacts: false`, Windows-`signCommand` verwijderd (geen sleutels in de fork)                                                             |
| `src/components/settings/RemoteTranscription.tsx`, `GeneralSettings.tsx`, `settingsStore.ts`, `bindings.ts` | instellingen-UI                                                                                                                                          |
| `src/i18n/locales/*/translation.json`                                                                       | sleutels `settings.remoteTranscription.*`                                                                                                                |
| `.github/workflows/`                                                                                        | `fork-build.yml` toegevoegd; `main-build.yml` en `nix-check.yml` alleen handmatig                                                                        |

Controleer na een merge dat `bun run format:check` en `cargo test` slagen, of laat de
workflows _test_ en _code quality_ dat doen.
