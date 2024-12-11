import { Plugin } from "vite";
import bodyParser from 'body-parser';
import { viteGenerateLiquid, createLiquidProject, getProjectData } from "./vite-buildLiquid";
import path from "path";
import fs from "fs";

export default function viteFunctionBus(): Plugin {
    return {
        name: 'vite-function-bus',
        buildStart(){
            console.log("vite-function-bus: start")
        },
        configureServer(server) {
            server.middlewares.use(bodyParser.json());
            server.middlewares.use(async (req, res, next) => {
                const root_url = process.cwd();
                const params = req.body;
                switch(req.url){
                    case '/getProjectData': {
                        const data = await getProjectData({dir: params.folder});
                        res.end(JSON.stringify({code: 200, data:data}));
                    }
                    break;
                    case '/create-project':
                        createLiquidProject({ folder: params.newName});
                        res.end(JSON.stringify({code: 200, message: `create project ${params.folder} success`}))
                    break;
                    case '/build-liquid':
                        viteGenerateLiquid({dom: params.dom, dir:path.join(root_url,`/src/pages/${params.folder}`), output: path.join(root_url,`/src/pages/${params.folder}/dist`)});
                        res.end(JSON.stringify({code: 200, message: `build liquid ${params.folder} success`}))
                    break;
                    case '/add-settings':
                        res.end(JSON.stringify({code: 200, message: `create liquid ${params.folder} success`}))
                    break;
                    case '/updateJson':{
                        const filePath = path.join(root_url, "/src/pages/", params.path);
                        fs.writeFileSync(filePath, JSON.stringify(params.json, null, 2));
                        res.end(JSON.stringify({code: 200, message: `update json ${params.path} success`}));
                    }
                    break;
                    case '/relevance':{
                        res.end(JSON.stringify({code: 200, message: `update json ${params.path} success`}));
                    }
                    break;
                    default:
                        next();
                    break;
                }

            })
        }
    }
}