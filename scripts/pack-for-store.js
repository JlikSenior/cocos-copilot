/**
 * 打包扩展为 zip，用于上架 Cocos 插件商城。
 * 在扩展根目录执行: node scripts/pack-for-store.js
 * 会在上级目录生成 <扩展目录名>-<version>.zip（zip 内顶层为扩展目录，如 cocos-copilot）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version || '1.0.0';
const parentDir = path.dirname(root);
const extensionName = path.basename(root);
const outZip = path.join(parentDir, `${extensionName}-${version}.zip`);

console.log('Extension root:', root);
console.log('Output zip:', outZip);

if (process.platform === 'win32') {
    execSync(
        `powershell -NoProfile -Command "Compress-Archive -Path '${root}' -DestinationPath '${outZip}' -Force"`,
        { stdio: 'inherit', cwd: parentDir }
    );
} else {
    execSync(`cd "${parentDir}" && zip -r "${path.basename(outZip)}" "${extensionName}"`, { stdio: 'inherit' });
}

console.log('Done:', outZip);
