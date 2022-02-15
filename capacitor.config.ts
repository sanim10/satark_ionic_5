import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      splashFullScreen: false,
      spinnerColor: '#0066a6',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  appId: 'satark.app.io.ionicc',
  appName: 'Satark',
  webDir: 'www',
  bundledWebRuntime: false,
};

export default config;
