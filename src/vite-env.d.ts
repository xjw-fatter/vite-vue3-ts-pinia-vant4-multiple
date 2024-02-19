/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface Window {
  xiangJsBridge: any;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PUBLIC_URL: string;
  readonly VITE_IMG_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'xgplayer';

declare function VitePluginVueMyConsole(): Plugin;
