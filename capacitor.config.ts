import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    SplashScreen: {
      launchShowDuration: 4000,
      launchAutoHide: false,
      splashFullScreen: true,
    },
  },
  appId: 'satark.app.io.ionic',
  appName: 'Satark',
  webDir: 'www',
  bundledWebRuntime: false,

};

export default config;
