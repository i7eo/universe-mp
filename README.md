# universe-mp

## uniapp 依赖

1. `npx degit dcloudio/uni-preset-vue#vite-ts my-project` 使用官方提供的该命令，自动生成包含各平台的项目
2. vite/vue 的版本与该脚手架提供的依赖一致即可，避免出现问题

## 本地开发

1. `pnpm install`
2. `pnpm dev`

## Git 提交

1. `git add .`
2. `pnpm commit`
3. `git push`

## UI 库

目前使用 uni-ui，但是暂时不支持 ts 类型。详情见 <https://github.com/dcloudio/uni-ui/issues/542>

## 参考资源

1. <https://gitee.com/h_mo/uniapp-vue3-vite3-ts-template/blob/master/src/utils/router/routes.ts>
2. <https://github.com/ttk-cli/uni-vue3-vite-ts-pinia/tree/main/src/utils>
