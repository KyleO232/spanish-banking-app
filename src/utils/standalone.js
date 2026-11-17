// True when the app is running as an installed app (added to the home screen, or a native
// app) rather than as a page in a browser tab. There, email links open in the browser, which
// is a separate place with its own storage, so they cannot sign the app in.
export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    window.navigator.standalone === true || // iPhone home-screen apps
    Boolean(window.Capacitor?.isNativePlatform?.())
  );
}
