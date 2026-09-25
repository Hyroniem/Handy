import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { SettingContainer } from "../ui/SettingContainer";
import { Input } from "../ui/Input";
import { useSettings } from "../../hooks/useSettings";

interface RemoteTranscriptionProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
}

export const RemoteTranscription: React.FC<RemoteTranscriptionProps> =
  React.memo(({ descriptionMode = "tooltip", grouped = false }) => {
    const { t } = useTranslation();
    const { getSetting, updateSetting, isUpdating } = useSettings();

    const enabled = getSetting("remote_transcription_enabled") ?? false;
    const url = getSetting("remote_transcription_url") ?? "";
    const fallback = getSetting("remote_transcription_fallback") ?? true;
    const [localUrl, setLocalUrl] = useState(url);

    useEffect(() => {
      setLocalUrl(url);
    }, [url]);

    return (
      <>
        <ToggleSwitch
          checked={enabled}
          onChange={(enabled) =>
            updateSetting("remote_transcription_enabled", enabled)
          }
          isUpdating={isUpdating("remote_transcription_enabled")}
          label={t("settings.remoteTranscription.enabled.label")}
          description={t("settings.remoteTranscription.enabled.description")}
          descriptionMode={descriptionMode}
          grouped={grouped}
        />
        {enabled && (
          <SettingContainer
            title={t("settings.remoteTranscription.url.title")}
            description={t("settings.remoteTranscription.url.description")}
            descriptionMode={descriptionMode}
            grouped={grouped}
          >
            <Input
              type="text"
              value={localUrl}
              onChange={(event) => setLocalUrl(event.target.value)}
              onBlur={() => {
                if (localUrl !== url) {
                  updateSetting("remote_transcription_url", localUrl.trim());
                }
              }}
              placeholder="http://127.0.0.1:8000/v1"
              variant="compact"
              disabled={isUpdating("remote_transcription_url")}
              className="flex-1 min-w-[280px]"
            />
          </SettingContainer>
        )}
        {enabled && (
          <ToggleSwitch
            checked={fallback}
            onChange={(enabled) =>
              updateSetting("remote_transcription_fallback", enabled)
            }
            isUpdating={isUpdating("remote_transcription_fallback")}
            label={t("settings.remoteTranscription.fallback.label")}
            description={t("settings.remoteTranscription.fallback.description")}
            descriptionMode={descriptionMode}
            grouped={grouped}
          />
        )}
      </>
    );
  });

RemoteTranscription.displayName = "RemoteTranscription";
