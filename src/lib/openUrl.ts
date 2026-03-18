import { getWebApp } from './telegram';

export function openUrl(url: string) {
  const webApp = getWebApp();
  if (webApp) {
    webApp.openLink(url);
  } else {
    window.open(url, '_blank');
  }
}
