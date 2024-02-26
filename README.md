# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

```
npm install pnpm -g
pnpm i
pnpm run dev

pnpm run dev:子项目
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

# 项目相关说明
项目模版 默认打包subTemplate目录项目，更换支持ts的语法高亮插件 Volar 以取代 Vetur

1.图片使用:
```
放到src/assets
const backIconWhite = new URL('../../assets/images/icons/backWhite.png', import.meta.url).href;
const backIcon = new URL('../../assets/images/icons/back.png', import.meta.url).href;

OR

放到public/lib/images
放到public静态资源目录 拼接 pubLibUrl+图片路径
const backIconWhite = `${serverUrl.pubLibUrl}images/icons/backWhite.png`;
const backIcon = `${serverUrl.pubLibUrl}images/icons/back.png`;

// vite.config配置了assetsInlineLimit，小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
assetsInlineLimit: 4096,
需要改变app状态栏的图片若小于此配置 4k 会内联为base64 传给客户端无法识别 因此状态栏图片建议统一放到public
```

# 问题记录
1. vue文件命名不可使用需使用驼峰 index home login单个单词会提示  .eslintrc.js配置不校验未生效  ---好像又生效了✅ （奇怪，应该是插件问题）
```
[vue/multi-word-component-names]
Component name "home" should always be multi-word.eslint-plugin-vue
```

2. router计数有误，页面切换会乱 ✅ 页面切换动画也会有问题
```
-  最新路由跳转相关 --- 20240223
-   返回首页 backHome
-   返回上一页 backward
-   返回指定步数 historyGo

```
export function routerCountAndDirection(router: Router) {
  // 页面过渡动画
  const storage = window.sessionStorage;
  storage.clear();

  let historyCount = storage.getItem('count') || 0; // 历史页面数量
  storage.setItem('/', '0');

  routerEventRegister(router); // 劫持路由事件

  router.beforeEach((to, from, next) => {
    console.log(to, from);
    const toIndex = storage.getItem(to.fullPath);
    const fromIndex = storage.getItem(from.fullPath);
    const historyCountAll = Number(storage.getItem('countAll')) || 0;
    const useCommonStore = commonStore();

    to.meta && to.meta.keepAlive && useCommonStore.keepAlive(to.name); // keepAlive

    if (toIndex) {
      // 上一页
      if (fromIndex === null || !fromIndex) {
        useCommonStore.updateDirection(''); // 入口页不过渡
      } else if (Number(toIndex) < Number(fromIndex)) {
        // 考虑replace跳转的情况
        useCommonStore.updateDirection('out');
        historyCountAll > 1 && storage.setItem('countAll', String(historyCountAll - 1));
      } else {
        useCommonStore.updateDirection('in');
        if (myHistoty.action !== routerEventConfig.replaceName) {
          storage.setItem('countAll', String(historyCountAll + 1)); // 不是replace的 countAll数量+1
        }
      }
    } else {
      // 下一页
      historyCount = Number(historyCount) + 1; // 总数+1
      storage.setItem('count', String(historyCount));
      to.fullPath !== '/' && storage.setItem(to.fullPath, String(historyCount));

      if (myHistoty.action !== routerEventConfig.replaceName) {
        storage.setItem('countAll', String(historyCountAll + 1));
      }
      useCommonStore.updateDirection(!from.name ? '' : 'in'); // 入口页不过渡 否则为进场动画
    }

    useCommonStore.clearToken(); // 页面切换取消请求
    next();
  });

  router.afterEach((to) => {
    setTimeout(() => {
      to.meta && to.meta.title && (document.title = to.meta.title as string);
      // ios native title 设置不生效的 hack
      if (/iP(ad|hone|od)/.test(window.navigator.userAgent)) {
        const iframe = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.onload = function () {
          setTimeout(function () {
            document.body.removeChild(iframe);
          }, 0);
        };
        document.body.appendChild(iframe);
      }
    }, 0);
  });
}
```

```
/**
 * backward 回退上一级，如果没有上一级就退出页面
 */
export function backward(): void {
  const historyCountAll = Number(sessionStorage.getItem('countAll')) || 0;
  if (historyCountAll - 1 > 0) {
    history.go(-1);
  } else {
    bridgeInvoke.closeWebView(); // 没有历史记录，关闭webview
  }
}

/**
 * backHome 返回到入口页(项目首页)
 */
export function backHome(): void {
  const historyCountAll = Number(sessionStorage.getItem('countAll')) || 0;

  if (historyCountAll >= 2) {
    const backStep = historyCountAll - 1;
    history.go(-backStep);
    // 返回多步时 router.beforeEach守卫只走一次 此时守卫中减去1步会有问题
    sessionStorage.setItem('countAll', '1');  // 计数有误修正
  } else {
    bridgeInvoke.closeWebView(); // 已经在首页了 直接关闭webview
  }
}

/**
 * historyGo 返回指定步数
 */
export function historyGo(step: number): void {
  if (step <= 1) return history.go(-step);
  const historyCountAll = Number(sessionStorage.getItem('countAll')) || 0; // step > 2时 返回多步 router.beforeEach守卫只走一次 
  sessionStorage.setItem('countAll', String(historyCountAll - step + 1)); // 计数有误修正
  history.go(-step);
}
```
```
3. unplugin-vue-components  ❌
```
Components({
	dirs: ['src/common/components'],// 自定义组件自动引入未生效 打包时生效但路径不对
}),

原因是多项目打包 开发时指定了root目录所在位置 root: mode === 'development' ? `src/projects/${PROJECT}/` : '', 插件会以此目录作为根目录查找components
```

4. 页面import引入顺序
```
// components
import xxx from './components/xxx.vue';
// utils
import { xxx } from '@/common/utils/index';
// type & services && constants
import { xxx } from '../../types/xxx.type';
import xxxx from './services/index';
import { xxx } from '@/common/constants';
// store
import xxx from '@/common/store/xxx.store';
import xxx from '../../store/xxx.store';
```

5. 报错：Uncaught (in promise) TypeError: api.now is not a function  
跳转路由的时候直接报错，显示Uncaught (in promise) TypeError: api.now is not a function。
解决办法：禁用vue dev tool插件或卸载后重新安装新版本，问题解决。 ✅

6. 依赖
```
strict-peer-dependencies=false 
是一个配置选项，用于在 TypeScript 项目中禁用严格的对等依赖检查。
在 TypeScript 3.0 之后的版本中，引入了对等依赖的严格检查机制。这意味着如果你在项目中使用了对等依赖（peerDependencies），但没有将其列入 package.json 的 dependencies 或 devDependencies 中，TypeScript 会发出警告或错误。
通过设置 strict-peer-dependencies=false，你可以禁用这种严格的对等依赖检查。这样，TypeScript 将不再对对等依赖进行强制检查，而是允许你在项目中使用未显式声明的对等依赖。
请注意，禁用严格对等依赖检查可能会导致一些潜在的问题，例如版本冲突或运行时错误。因此，在禁用严格检查之前，建议先仔细考虑你的项目依赖关系，并确保你了解可能的风险。
.
├─┬ xgplayer
│ └─┬ xgplayer-subtitles
│   └── ✕ missing peer core-js@>=3.12.1
├─┬ stylelint-config-prettier
│ └── ✕ unmet peer stylelint@">= 11.x < 15": found 15.9.0
└─┬ stylelint-config-recommended-less
  └─┬ stylelint-less
    └── ✕ unmet peer stylelint@^15.9.0: found 14.16.1 in stylelint-config-recommended-less
Peer dependencies that should be installed:
  core-js@>=3.12.1

"stylelint": "^15.9.0",
"stylelint-config-prettier": "^9.0.5",
"stylelint-config-recommended-less": "^1.0.4",
"stylelint-config-standard": "^33.0.0",
"stylelint-config-standard-vue": "^1.0.0",
"stylelint-less": "^1.0.6",
"stylelint-order": "^6.0.3",
stylelintlint 相关依赖之间版本对应关系冲突 禁用严格的对等依赖检查。

auto-install-peers=true 
是一个配置选项，用于在安装 npm 包时自动安装对等依赖（peerDependencies）。
在 npm 包的 package.json 文件中，可以声明对等依赖，这些依赖是你的包所需要的，但不能直接在你的包中安装。传统上，对等依赖需要由使用者手动安装，以满足包的运行时需求。
通过设置 auto-install-peers=true，当你安装一个 npm 包时，如果该包有对等依赖声明，npm 会自动安装这些对等依赖，以确保你的包可以正常运行。
这个配置选项通常在使用工具如 npm、Yarn 或 pnpm 安装包时使用。具体的配置方式可能因工具而异，请查阅相应工具的文档以了解如何启用自动安装对等依赖的功能。
需要注意的是，自动安装对等依赖可能会导致依赖版本冲突或其他问题。在启用自动安装对等依赖之前，建议仔细考虑你的项目依赖关系，并确保你了解可能的风险。
```

# fix.build.html.js
打包后处理dist目录

说明：
1:打包后将index.html从对应子项目目录移动到dist根目录并调整index.html中资源引用路径
2:deleteExtraLib 删除public/lib中非当前子项目的资源文件，避免dist中存在其它子项目资源文件
  2.1:需注意原lib文件目录中已有的文件资源暂时不用变更，后续有对应项目单独处理修改后修改文件路径地址
	2.2:后续在lib下新增assets目录 对应子项目资源统一放到assets/子项目名/...  例如有新的子项目AAA 则AAA需要放到public的资源文件 路径如下 lib/assets/AAA/
	2.3:fix.build.html.js中 deleteExtraLib中 const mls = ['dist/lib/assets']; 将会在打包完成后 递归删除dist/lib/assets下非当前子项目的文件和目录
	2.4:资源目录名需要与当前子项目名一致 
