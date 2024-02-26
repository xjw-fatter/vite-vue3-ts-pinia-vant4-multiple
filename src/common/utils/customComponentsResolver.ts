// custom-components-resolver.ts

import { ComponentResolveResult, ComponentResolverFunction } from 'unplugin-vue-components/types';

const fs = require('fs');
const PROJECT = process.env.PROJECT || 'subTemplate';

const componentsBasePath = 'src/common/components'; // 组件的基础路径
const componentsSubPath = `src/projects/${PROJECT}/components`; // 子项目组件的基础路径
const customComponentsResolver: ComponentResolverFunction = (componentName) => {
  // 构建递归查找组件的函数
  const findComponent = (dir: string): string | null => {
    const filePath = `${dir}/${componentName}.vue`;
    console.log(filePath);
    try {
      // 尝试解析文件路径，如果成功则返回
      return require.resolve(filePath);
    } catch (_) {
      // 如果文件不存在，尝试查找子目录
      const dirContents = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of dirContents) {
        const fullPath = `${dir}/${file.name}`;
        if (file.isDirectory()) {
          // 如果是目录，递归查找
          const result = findComponent(fullPath);
          if (result) {
            return result;
          }
        }
      }
      // 如果在当前目录及其子目录中找不到组件，返回 null
      return null;
    }
  };

  // 从基础路径开始查找组件
  const importPath = findComponent(componentsBasePath);
  if (importPath) {
    // 返回导入路径和可选的来源路径
    return {
      import: importPath,
      from: componentsBasePath,
    } as ComponentResolveResult;
  }

  const importSubPath = findComponent(componentsSubPath);
  if (importSubPath) {
    // 返回导入路径和可选的来源路径
    return {
      import: importSubPath,
      from: componentsSubPath,
    } as ComponentResolveResult;
  }
  // 如果找不到组件，返回 null
  return null;
};

export default customComponentsResolver;
