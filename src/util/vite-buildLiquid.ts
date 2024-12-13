import fs from "fs";
import path from "path";
import * as sass from "sass";
import * as cheerio from 'cheerio';


interface CreateLiquidProjectOptions {
  folder: string;
}

async function copyTemplateFiles(
  templateDir: string,
  targetDir: string,
  replacements: Record<string, string>
) {
  const files = await fs.promises.readdir(templateDir, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(templateDir, file.name);
    const targetPath = path.join(targetDir, file.name);

    if (file.isDirectory()) {
      await fs.promises.mkdir(targetPath, { recursive: true });
      await copyTemplateFiles(sourcePath, targetPath, replacements);
    } else if (file.isFile()) {
      let content = await fs.promises.readFile(sourcePath, "utf-8");

      for (const [key, value] of Object.entries(replacements)) {
        const placeholder = `{{${key}}}`;
        content = content.replaceAll(placeholder, value);
      }

      await fs.promises.writeFile(targetPath, content, "utf-8");
    }
  }
}

export async function createLiquidProject(options: CreateLiquidProjectOptions) {
  const { folder } = options;
  const rootUrl = process.cwd();
  const folderPath = path.join(rootUrl, "src/pages", folder);
  const templateDir = path.join(rootUrl, "src/templates");

  const replacements = {
    name: folder,
  };

  try {
    await fs.promises.mkdir(folderPath, { recursive: true });

    await copyTemplateFiles(templateDir, folderPath, replacements);

    console.log(`项目已创建在: ${folderPath}`);
  } catch (error: unknown) {
    console.error(`Failed to create project: ${(error as Error).message}`);
  }
}

export async function viteGenerateLiquid(options: {
  dir: string;
  output: string;
  dom: string;
}) {
  const { dir, output, dom } = options;
  const sassFiles = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".scss") || file.endsWith(".sass"));
  const outputCss = path.join(output || dir, "index.css");
  const outputLiquid = path.join(output || dir, "index.liquid");

  await fs.promises.mkdir(output, { recursive: true });
  if (sassFiles.length === 0) {
    console.log("没有找到 Sass 文件");
    return;
  }

  let mergedSassContent = "";
  sassFiles.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    mergedSassContent += fileContent + "\n";
  });

  const tempSassPath = path.join(dir, "merged.scss");
  fs.writeFileSync(tempSassPath, mergedSassContent);

  let resultCss;
  try {
    resultCss = await sass.compileAsync(tempSassPath);
    fs.writeFileSync(outputCss, resultCss.css.toString());
    console.log(`CSS 已生成并保存到: ${outputCss}`);
  } catch (error) {
    console.error("Sass 编译失败:", error);
  }
  fs.unlinkSync(tempSassPath);

  const config = await fs.promises.readFile(
    path.join(dir, "config.json"),
    "utf-8"
  );

  const $ = cheerio.load(dom);
  $.root().find('[data-sid]').each((index, element) => {
    const dataSid = $(element).attr('data-sid');
    if (dataSid){
      if(dataSid!='true' && dataSid!='false') {
        if (element.tagName === 'img') {
          $(element).attr('src', `{{ ${dataSid} | image_url }}`);
        } else {
          $(element).text(`{{ sections.settings.${dataSid} }}`);
        }
      }
      $(element).removeAttr('data-sid');
    }
  });
  
  const htmlContent = `<style>
  ${resultCss?.css.toString()}
</style>

${$('body').html()}

<script>
</script>

{% schema %}
  ${config.toString()}
{% endschema %}`;
  fs.writeFileSync(outputLiquid, htmlContent);
  console.log(`liquid 已生成并保存到: ${outputLiquid}`);
}

export async function getProjectData(options: { dir: string }) {
  const { dir } = options;
  const config = await fs.promises.readFile(
    path.join(process.cwd(), `/src/pages/${dir}`, "config.json"),
    "utf-8"
  );
  return config;
}
