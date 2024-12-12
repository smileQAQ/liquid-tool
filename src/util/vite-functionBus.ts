import { Plugin } from "vite";
import bodyParser, { text } from "body-parser";
import {
  viteGenerateLiquid,
  createLiquidProject,
  getProjectData,
} from "./vite-buildLiquid";
import path from "path";
import fs from "fs";
import * as babelParser from "@babel/parser";
import { traverse } from "@babel/core";
import CodeGenerator from "@babel/generator";
import { Config } from "./settings";

export default function viteFunctionBus(): Plugin {
  return {
    name: "vite-function-bus",
    buildStart() {
      console.log("vite-function-bus: start");
    },
    configureServer(server) {
      server.middlewares.use(bodyParser.json());
      server.middlewares.use(async (req, res, next) => {
        const root_url = process.cwd();
        const params = req.body;
        switch (req.url) {
          case "/getProjectData":
            {
              const data = await getProjectData({ dir: params.folder });
              res.end(JSON.stringify({ code: 200, data: data }));
            }
            break;
          case "/create-project":
            createLiquidProject({ folder: params.newName });
            res.end(
              JSON.stringify({
                code: 200,
                message: `create project ${params.folder} success`,
              })
            );
            break;
          case "/build-liquid":
            viteGenerateLiquid({
              dom: params.dom,
              dir: path.join(root_url, `/src/pages/${params.folder}`),
              output: path.join(root_url, `/src/pages/${params.folder}/dist`),
            });
            res.end(
              JSON.stringify({
                code: 200,
                message: `build liquid ${params.folder} success`,
              })
            );
            break;
          case "/add-settings":
            res.end(
              JSON.stringify({
                code: 200,
                message: `create liquid ${params.folder} success`,
              })
            );
            break;
          case "/updateJson":
            {
              const filePath = path.join(root_url, "/src/pages/", params.path);
              fs.writeFileSync(filePath, JSON.stringify(params.json, null, 2));
              res.end(
                JSON.stringify({
                  code: 200,
                  message: `update json ${params.path} success`,
                })
              );
            }
            break;
          case "/relevance":
            {
              try {
                const configData = JSON.parse(
                  fs.readFileSync(
                    path.join(
                      root_url,
                      `/src/pages/${params.path}/config.json`
                    ),
                    "utf-8"
                  )
                ) as Config;
                const files = fs.readFileSync(
                  path.join(root_url, `/src/pages/${params.path}/index.tsx`),
                  "utf-8"
                );
                const ast = babelParser.parse(files, {
                  sourceType: "module",
                  plugins: ["typescript", "jsx"],
                });
                traverse(ast, {
                  JSXElement(path) {
                    const attributes = path.node.openingElement.attributes;
                    const hasDataSid = attributes.some(
                      (attr, index) =>
                        attr.type === "JSXAttribute" &&
                        attr.name.name === "data-sid" &&
                        index === params.selectIndex
                    );
                    if (hasDataSid) {
                      path.traverse({
                        JSXText(textPath) {
                          console.log(textPath);
                          textPath.node.value = `{config.settings[${params.index}].value}`;
                        },
                        NumberLiteral(path) {
                          path.node.value = params.index;
                        },
                      });

                      if (
                        path.node.openingElement.name.type === "JSXIdentifier"
                      ) {
                        path.node.openingElement.attributes = attributes.map(
                          (attr) => {
                            if (
                              attr.type === "JSXAttribute" &&
                              attr.name.name === "data-sid"
                            ) {
                              return {
                                ...attr,
                                value: {
                                  type: "JSXExpressionContainer",
                                  expression: babelParser.parseExpression(
                                    `'${configData.settings[params.index].id}'`
                                  ),
                                },
                              };
                            }
                            return attr;
                          }
                        );
                      }
                    }
                  },
                });
                const code = CodeGenerator.default(ast).code;
                fs.writeFileSync(
                  path.join(root_url, `/src/pages/${params.path}/index.tsx`),
                  code
                );
                res.end(
                  JSON.stringify({
                    code: 200,
                    message: `Read file ${params.path} success`,
                    data: files,
                  })
                );
              } catch (error) {
                console.error(error);
                res.end(
                  JSON.stringify({
                    code: 500,
                    message: `Failed to read file ${params.path}`,
                    error:
                      error instanceof Error ? error.message : String(error),
                  })
                );
              }
            }
            break;
          default:
            next();
            break;
        }
      });
    },
  };
}
