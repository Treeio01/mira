import { useEffect, useState } from 'react';
import { getWebApp } from '../lib/telegram';

interface Viewport {
  height: number;
  stableHeight: number;
  isExpanded: boolean;
}

export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(() => {
    const webApp = getWebApp();
    return {
      height: webApp?.viewportHeight ?? window.innerHeight,
      stableHeight: webApp?.viewportStableHeight ?? window.innerHeight,
      isExpanded: webApp?.isExpanded ?? true,
    };
  });

  useEffect(() => {
    const webApp = getWebApp();
    if (!webApp) return;

    const handler = () => {
      setViewport({
        height: webApp.viewportHeight,
        stableHeight: webApp.viewportStableHeight,
        isExpanded: webApp.isExpanded,
      });
    };

    webApp.onEvent('viewportChanged', handler);
    return () => webApp.offEvent('viewportChanged', handler);
  }, []);

  return viewport;
}
