import { spawn } from "child_process";
import { resolve } from "path";
import { MicroServiceDomain } from "../src/enums/domain";

const API_DOCS_URL = "http://192.168.10.48";
const OUTPU_DIR = "../src/apis/models";

/** swagger url 一般不会修改，如果后端升级swagger版本，这里需要修改 */
const SwaggerUrlSuffix = "/v2/api-docs";
/**
 * 数据来源：后台服务注册中心（http://192.168.10.48:8761/）
 * 这个端口一般不会变，如果生成的字段有错误，再来矫正端口
 */
const MicroServiceDomainPorts = {
  "TIANTA-SYSTEM": 8010,
  "TIANTA-FILE": 8020,
  "TIANTA-MESSAGE": 8040,
  "TIANTA-WORKFLOW": 8030,
  "STARLIGHT-INVEST-WEB": 11010,
  // "STARLIGHT-INVEST-APP": 11020,
  "STARLIGHT-POE-WEB": 12010,
  "STARLIGHT-CENTRE-WEB": 21010,
  "STARLIGHT-PORTAL-WEB": 30010,
};

/**
 * 子进程
 * child_process.spawn(command[, args][, options])
 * command <string> 要运行的命令。
 * args <string[]> 字符串参数列表。
 * options <Object>
 *  - cwd <string> | <URL> 子进程的当前工作目录
 *  - stdio <Array> | <string> 子进程的标准输入输出配置。'inherit'：通过相应的标准输入输出流传入/传出父进程
 * - shell <boolean> | <string> 如果是 true，则在 shell 内运行 command。 在 Unix 上使用 '/bin/sh'，在 Windows 上使用    process.env.ComSpec。 可以将不同的 shell 指定为字符串。 请参阅 shell 的要求和默认的 Windows shell。 默认值: false （没有 shell）x
 */
async function run(command: string, cwd: string = resolve(__dirname, "./")) {
  return new Promise<void>((resolve, reject) => {
    // 将命令分割 例如：rm -rf 分割为['rm', '-rf'],进行解构[cmd,...args]
    const [cmd, ...args] = command.split(" ");

    const app = spawn(cmd, args, {
      cwd,
      stdio: "inherit", // 直接将这个子进程输出
      shell: process.platform === "win32", // 默认情况下 linux才支持rm -rf (安装git bash可以支持)
    });

    // 定义进程退出监听函数
    const onProcessExit = () => app.kill("SIGHUP");

    // 在进程已结束并且子进程的标准输入输出流已关闭之后，则触发 'close' 事件
    app.on("close", (code) => {
      process.removeListener("exit", onProcessExit);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Failed to execute Command. \n Command: ${command} \n Code: ${code}`));
      }
    });
    process.on("exit", onProcessExit);
  });
}

async function main() {
  const fileNames = Object.values(MicroServiceDomain);
  fileNames.map(async (fileName) => {
    const input = `${API_DOCS_URL}:${MicroServiceDomainPorts[fileName]}${SwaggerUrlSuffix}`;
    const output = `${resolve(__dirname, OUTPU_DIR)}/${fileName}.ts`;
    await run(`pnpm exec openapi-typescript ${input} --output ${output}`);
  });
}

main();
