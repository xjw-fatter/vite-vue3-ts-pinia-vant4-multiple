const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, 'dist/src');
const projectPath = path.join(srcPath, 'projects');

const PROJECT = process.env.PROJECT || 'subTemplate';

console.log('开始调整dist目录,当前项目为', PROJECT);

function readDirectory(directory) {
  try {
    const files = fs.readdirSync(directory);
    return files;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`目录不存在：${directory}`);
    } else {
      console.error(`读取目录失败：${directory}`, error);
    }
  }
}

function deleteDirectory(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        // 如果是目录就递归删除
        deleteDirectory(curPath);
      } else {
        // 如果是文件就删除文件
        fs.unlinkSync(curPath);
      }
    });
    // 删除目录
    fs.rmdirSync(path);
    console.log(path + '文件目录删除成功');
  }
}

function deleteExtraLib() {
  try {
    const mls = ['dist/lib/assets', 'dist/lib/images/bars']; // 删除多余的文件夹,只保留当前项目文件 已经有几个项目在这里images/bars放了文件 需要处理一下

    for (let i = 0; i < mls.length; i++) {
      const ml = mls[i];
      const libFiles = readDirectory(ml);
      console.log(ml + '目录下的文件及目录', libFiles);
      if (!libFiles || !libFiles.length) continue;

      for (let j = 0; j < libFiles.length; j++) {
        const element = libFiles[j];
        // 不是当前项目的文件夹都删除
        if (element !== PROJECT) {
          const rmPath = path.join(ml, element);
          try {
            const stats = fs.statSync(rmPath);
            if (stats.isFile()) {
              console.log(rmPath + '这是一个文件 无需删除');
            } else if (stats.isDirectory()) {
              deleteDirectory(rmPath);
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
  } catch (error) {
    console.error('删除操作失败', error);
  }
}

function fixBuildHtml() {
  try {
    const dirs = fs.readdirSync(projectPath);
    if (dirs.length !== 1) throw new Error(`${projectPath} is empty ${dirs.length}`);

    const projectDir = path.join(projectPath, dirs[0], 'index.html');
    const rootIndex = path.resolve(__dirname, 'dist/index.html');
    const content = fs.readFileSync(projectDir, 'utf-8');
    const html = content.replace(/\.\.\/\.\.\/\./gi, '');

    fs.writeFileSync(rootIndex, html);
    fs.rmSync('dist/src', { recursive: true });
    deleteExtraLib();
    console.info('build后的目录结构以调整完毕！');
  } catch (error) {
    console.error('修复build后的目录结构失败，请修复后再打包', error);
  }
}

fixBuildHtml();
