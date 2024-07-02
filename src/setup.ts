import AdmZip from "adm-zip"
import { exec } from "child_process"
import { promisify } from "util"

const do_it = async () => {
    const execAwaitable = promisify(exec)

    console.log("[🔧] Compilando Lambda do Cluster...")
    await execAwaitable(`esbuild src/index.ts --bundle --external:aws-sdk --platform=node --target=es2020 --outfile=dist/index.js`)

    //console.log("[🔧] Zipando Lambda do Cluster...")
    //const zip = new AdmZip();
    //zip.addLocalFile("./infra/lambda/dist/create-service.js", undefined, "index.js");



}

do_it()