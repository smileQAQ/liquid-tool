import { Plugin } from "vite";
import bodyParser from 'body-parser';
import { vitePluginSassMerge, viteGenerateDOM } from "./vite-buildLiquid";
import path from "path";

export default function viteFunctionBus(): Plugin {
    return {
        name: 'vite-function-bus',
        buildStart(){
            console.log("vite-function-bus: start")
        },
        configureServer(server) {
            server.middlewares.use(bodyParser.json());
            server.middlewares.use((req, res, next) => {
                const root_url = process.cwd();
                const params = req.body;
                if (req.url === '/create-project') {

                    res.end(JSON.stringify({code: 200, message: `create project ${params.folder} success`}))
                }else if(req.url === '/build-liquid'){
                    vitePluginSassMerge({dir:path.join(root_url,`/src/pages/${params.folder}`), output: path.join(root_url,`/src/pages/${params.folder}/index.css`)});
                    res.end(JSON.stringify({code: 200, message: `create project ${params.folder} success`}))
                }else{
                    next();
                }
            })
        }
    }
}