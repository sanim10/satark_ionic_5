import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      splashFullScreen: false,
      spinnerColor: '#0066a6',
      showSpinner: true,
      androidSpinnerStyle: 'smallInverse',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  appId: 'satark.app.io.ionic',
  appName: 'SATARK',
  webDir: 'www',
  bundledWebRuntime: false,
};

export default config;
