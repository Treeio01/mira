import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWebApp } from '../lib/telegram';

export function useBackButton(onBack?: () => void) {
  const navigate = useNavigate();
  const callbackRef = useRef(onBack);
  callbackRef.current = onBack;

  useEffect(() => {
    const webApp = getWebApp();
    if (!webApp) return;

    const btn = webApp.BackButton;
    const handler = () => {
      if (callbackRef.current) {
        callbackRef.current();
      } else {
        navigate(-1);
      }
    };

    btn.show();
    btn.onClick(handler);

    return () => {
      btn.offClick(handler);
      btn.hide();
    };
  }, [navigate]);
}
