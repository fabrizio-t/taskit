import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.taskit',
  appName: 'taskit',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
