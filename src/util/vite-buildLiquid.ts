import fs from 'fs';
import path from 'path';
import React from 'react';
import * as sass from 'sass';
import ReactDOMServer from 'react-dom/server';
import { pathToFileURL } from 'url';

export async function vitePluginSassMerge(options: { dir: string; output: string }){
  const { dir, output } = options;
  const sassFiles = fs.readdirSync(dir).filter(file => file.endsWith('.scss') || file.endsWith('.sass'));
  
  if (sassFiles.length === 0) {
    console.log('没有找到 Sass 文件');
    return;
  }

  let mergedSassContent = '';
  sassFiles.forEach(file => {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    mergedSassContent += fileContent + '\n';
  });

  const tempSassPath = path.join(dir, 'merged.scss');
  fs.writeFileSync(tempSassPath, mergedSassContent);

  try {
    const result = await sass.compileAsync(tempSassPath);

    fs.writeFileSync(output, result.css.toString());
    console.log(`CSS 已生成并保存到: ${output}`);
  } catch (error) {
    console.error('Sass 编译失败:', error);
  }

  fs.unlinkSync(tempSassPath);
}

export async function viteGenerateDOM(options: { dir: string; output: string }) { 
  const { dir, output } = options;

  const indexFilePath = path.join(dir, 'index.tsx');
  
  try {
    const fileUrl = pathToFileURL(indexFilePath).href;
    const { default: component } = await import(fileUrl);
    
    if (!component) {
      console.error(`未找到 React 组件: ${indexFilePath}`);
      return;
    }
    const htmlContent = ReactDOMServer.renderToString(React.createElement(component));
    console.log(htmlContent);
    
    fs.writeFileSync(output, htmlContent);
    console.log(`HTML 已生成并保存到: ${output}`);

  } catch (error) {
    console.error(`加载组件失败: ${error}`);
  }
}