import { basename, extname } from 'node:path';
import type { PluginOption } from 'vite';
// magic-string 是一个用于操作字符串和生成源映射的小而快的库其实它最主要的功能就是对一些源代码和庞大的 AST 字符串做轻量级字符串的替换
import MagicString from 'magic-string';
import { simple } from 'acorn-walk'; // JavaScript AST（抽象语法树）遍历工具
import { SourceMapConsumer } from 'source-map';
import type { RawSourceMap } from 'source-map';

const transformFileTypes = ['.js', '.ts', '.vue'];
const commonStyle = 'padding:2px; border-radius:4px; font-weight:500; ';
const consoleStyles: Record<string, string> = {
  '.js': `${commonStyle}color: #111827; background: #F7DF1E`,
  '.ts': `${commonStyle}color: #fff; background: #3178C6`,
  '.vue': `${commonStyle}color: #fff; background: #4FC08D`,
  default: `${commonStyle}color: #111827; background: #F7DF1E`,
};

function getConsoleStyle(fileType: string): string {
  return consoleStyles[fileType] || consoleStyles.default;
}

export interface VitePluginVueMyConsoleOptions {
  apply: 'build' | 'serve';
}

export default function VitePluginVueMyConsole(options: VitePluginVueMyConsoleOptions): PluginOption {
  return {
    name: 'vite-plugin-vue-my-console',
    enforce: 'post',
    apply: options.apply || 'serve',
    // https://cn.rollupjs.org/plugin-development/#transform
    // 转化模块的代码, 该钩子的参数是code和id, 根据模块id来选择对改模块的code进行转换. 如果转换的过程比较简单, 可以直接操作code这个字符串,
    // 如果需求较为复杂, 则需要把code转为ast, 然后操作ast, 操作结束后, 再生成code并返回.需要注意的是, 这个钩子会在解析每个模块的时候都执行一次.
    transform(code, id) {
      if (transformFileTypes.includes(extname(id)) && !id.includes('node_modules')) {
        const magicString = new MagicString(code);
        const ast = this.parse(code, {
          locations: true,
        });
        // 对 AST 进行简单遍历，遍历所有节点并调用相应的回调函数。
        // https://lihautan.com/babel-ast-explorer
        simple(ast, {
          CallExpression: (node: any) => {
            const { callee, arguments: args, loc } = node;
            if (
              callee.type === 'MemberExpression' &&
              callee.object?.type === 'Identifier' &&
              callee.object?.name === 'console' &&
              callee.property?.type === 'Identifier' &&
              callee.property?.name === 'log'
            ) {
              // 是console.log
              const fileName = basename(id); // 当前console所在文件名
              const fileType = extname(id); // 当前console所在文件后缀
              const { line, column } = loc.start;
              // console.log(fileName, fileType, line, column);
              const rawSourcemap = this.getCombinedSourcemap() as any;
              const asyncOp = new SourceMapConsumer(rawSourcemap as RawSourceMap);

              const { line: originalLine } = asyncOp.originalPositionFor({
                line,
                column,
              });
              // console.log(originalLine);
              const argumentStart = args[0].start;
              // console.log(argumentStart);
              const argumentEnd = args[args.length - 1].end;
              // console.log(argumentEnd);
              const argsName = magicString.slice(argumentStart, argumentEnd);
              // console.log(argsName);
              magicString.appendLeft(argumentStart, `'%c${fileName}::${originalLine} ~ ${argsName}',"${getConsoleStyle(fileType)}",`);
            }
          },
        });

        return {
          code: magicString.toString(),
          map: magicString.generateMap({ source: id, includeContent: true }),
        } as any;
      }
    },
  };
}
