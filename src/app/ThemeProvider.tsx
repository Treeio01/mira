import { useEffect, type ReactNode } from 'react';
import { useTelegramContext } from './TelegramContext';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, themeParams } = useTelegramContext();

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', colorScheme);

    const vars: Record<string, string | undefined> = {
      '--tg-bg': themeParams.bg_color,
      '--tg-text': themeParams.text_color,
      '--tg-hint': themeParams.hint_color,
      '--tg-link': themeParams.link_color,
      '--tg-button': themeParams.button_color,
      '--tg-button-text': themeParams.button_text_color,
      '--tg-secondary-bg': themeParams.secondary_bg_color,
      '--tg-header-bg': themeParams.header_bg_color,
      '--tg-bottom-bar-bg': themeParams.bottom_bar_bg_color,
      '--tg-accent-text': themeParams.accent_text_color,
      '--tg-section-bg': themeParams.section_bg_color,
      '--tg-section-header-text': themeParams.section_header_text_color,
      '--tg-section-separator': themeParams.section_separator_color,
      '--tg-subtitle-text': themeParams.subtitle_text_color,
      '--tg-destructive-text': themeParams.destructive_text_color,
    };

    for (const [prop, value] of Object.entries(vars)) {
      if (value) {
        root.style.setProperty(prop, value);
      }
    }
  }, [colorScheme, themeParams]);

  return <>{children}</>;
}
