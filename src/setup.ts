import { exec } from "child_process"
import { promisify } from "util"

const do_it = async () => {
    const execAwaitable = promisify(exec)
    console.log("Building...")
    await execAwaitable(`esbuild src/index.ts --bundle --external:aws-sdk --platform=node --target=es2020 --outfile=dist/index.js`)
}

do_it()