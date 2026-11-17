// Things that only make sense inside the iOS / Android app. main.jsx loads this file only
// when the page is running inside the native wrapper, so web visitors never download it.

import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

export async function initNative() {
  // status bar text: light text on the dark theme, dark text on the light theme
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const applyStatusBar = () => StatusBar.setStyle({ style: scheme.matches ? Style.Dark : Style.Light }).catch(() => {});
  applyStatusBar();
  scheme.addEventListener('change', applyStatusBar);

  // Android's back button goes back inside the app, and leaves the app from the home screen
  App.addListener('backButton', () => {
    const atHome = window.location.hash === '' || window.location.hash === '#/';
    if (atHome) App.exitApp();
    else window.history.back();
  });

  // the app is drawn: take the launch screen away
  await SplashScreen.hide().catch(() => {});
}
