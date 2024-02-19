import glob from 'glob';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoPreFixer from 'autoprefixer';
import PostCssPxToViewport from 'postcss-px-to-viewport-8-plugin';
import legacy from '@vitejs/plugin-legacy';
import { viteVConsole } from 'vite-plugin-vconsole';
import VitePluginVueMyConsole from './src/common/utils/myConsole.plugin';

const postCssOptions = {
  unitToConvert: 'px', // 需要转换的单位，默认为 px
  unitPrecision: 4, // 单位转换后保留的精度（很多时候无法整除）
  propList: ['*'], // 能转化为vw的属性列表,!font-size表示font-size后面的单位不会被转换
  viewportUnit: 'vw', // 指定需要转换成的视口单位，建议使用 vw
  fontViewportUnit: 'vw', // 字体使用的视口单位
  selectorBlackList: ['ignore', 'keep-px'],
  minPixelValue: 1, // 设置最小的转换数值，这里小于或等于 1px 不转换为视口单位
  mediaQuery: false, // 媒体查询里的单位是否需要转换单位
  // viewportWidth: 750, // 设计稿的视口宽度
  // viewportHeight: 1334, //
};

const inputs = Object.fromEntries(
  glob
    .sync('src/projects/**/index.html')
    .map((file: string) => [file.slice('src/projects/'.length, file.length - '/index.html'.length), resolve(__dirname, file)]),
);

const PROJECT = process.env.PROJECT || 'subTemplate';

export default defineConfig(({ command, mode, ssrBuild }) => {
  const childrenRootPath = `src/projects/${PROJECT}/`;
  const env = loadEnv(mode, `${process.cwd()}/${childrenRootPath}/env/`);
  console.log('defineConfig:' + PROJECT, command, mode, ssrBuild, env);
  return {
    root: mode === 'development' ? `src/projects/${PROJECT}/` : '',
    publicDir: mode === 'development' ? '../../../public' : 'public', // 静态资源服务的文件夹
    base: './',
    envDir: `${process.cwd()}/${childrenRootPath}/env/`,
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1000, //chunk 大小警告的限制
      cssCodeSplit: true, //启用/禁用 CSS 代码拆分
      sourcemap: false, //构建后是否生成 source map 文件
      //当设置为 true，构建后将会生成 manifest.json 文件
      manifest: false,
      // boolean | 'terser' | 'esbuild'
      minify: 'terser', // terser 构建后文件体积更小
      //传递给 Terser 的更多 minify 选项。
      //设置为 false 来禁用将构建后的文件写入磁盘
      write: true,
      //默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
      emptyOutDir: true,
      //启用/禁用 brotli 压缩大小报告
      // brotliSize: true,
      // reportCompressedSize: false,
      rollupOptions: {
        input: inputs[PROJECT],
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vconsole: ['vconsole'],
          },
        },
      },
      terserOptions: {
        // 传递给 Terser 的更多 minify 选项。
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      postcss: {
        plugins: [
          AutoPreFixer(),
          PostCssPxToViewport(
            Object.assign(postCssOptions, { viewportWidth: 375, viewportHeight: 667, exclude: [/^(?!.*node_modules\/vant)/] }),
          ),
          PostCssPxToViewport(Object.assign(postCssOptions, { viewportWidth: 750, viewportHeight: 1334, exclude: [/node_modules\/vant/] })),
        ],
      },
    },
    plugins: [
      vue(),
      VueSetupExtend(),
      Components({
        // dirs: ['src/common/components'],
        extensions: ['vue'],
        dts: resolve(__dirname, 'types/components.d.ts'),
        resolvers: [VantResolver(), VueUseComponentsResolver()],
      }),
      AutoImport({
        dts: resolve(__dirname, 'types/auto-imports.d.ts'),
        imports: ['vue', 'pinia', 'vue-router', { '@vueuse/core': [] }],
        eslintrc: { enabled: true },
      }),
      legacy({
        targets: ['Chrome 62'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        modernPolyfills: true,
      }),
      viteVConsole({
        entry: resolve(`src/projects/${PROJECT}/main.ts`),
        localEnabled: mode !== 'production', // dev environment
        enabled: mode !== 'production', // build production
        config: {
          maxLogNumber: 1000,
          theme: 'light',
        },
      }),
      VitePluginVueMyConsole({ apply: ['test', 'uat'].includes(mode) ? 'build' : 'serve' }),
    ],
    server: {
      host: '0.0.0.0',
      port: 5300, // 启动端口
      // hmr: {
      //   host: '127.0.0.1',
      //   port: 5300,
      //   overlay: false,
      // },
      hmr: true,
      open: false, // 服务启动时自动在浏览器中打开应用
      https: false, // 是否启用 http 2
      cors: true, // 为开发服务器配置 CORS , 默认启用并允许任何源
      strictPort: false, // 设为true时端口被占用则直接退出，不会尝试下一个可用端口
      force: false, // 是否强制依赖预构建
      proxy: {
        '/api': {
          target: 'your https address',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
