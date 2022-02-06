import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      splashFullScreen: false,
    },
  },
  appId: 'satark.app.io.ionicc',
  appName: 'Satark',
  webDir: 'www',
  bundledWebRuntime: false,
};

export default config;
