import { useEffect, useRef } from 'react';
import { getWebApp } from '../lib/telegram';

interface MainButtonOptions {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  visible?: boolean;
  color?: string;
  textColor?: string;
  showProgress?: boolean;
}

export function useMainButton(options: MainButtonOptions) {
  const { text, onClick, disabled = false, visible = true, color, textColor, showProgress = false } = options;
  const callbackRef = useRef(onClick);
  useEffect(() => { callbackRef.current = onClick; });

  useEffect(() => {
    const webApp = getWebApp();
    if (!webApp) return;

    const btn = webApp.MainButton;
    const handler = () => callbackRef.current();

    btn.setParams({
      text,
      ...(color && { color }),
      ...(textColor && { text_color: textColor }),
      is_active: !disabled,
      is_visible: visible,
    });

    if (showProgress) {
      btn.showProgress();
    } else {
      btn.hideProgress();
    }

    btn.onClick(handler);

    return () => {
      btn.offClick(handler);
      btn.hide();
    };
  }, [text, disabled, visible, color, textColor, showProgress]);
}
