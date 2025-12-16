vue/compiler-sfc 是将 sfc 编译成 js sfc 依赖于下面这两个
vue/compiler-dom->vue/compiler-core 是将 template 编辑成 render render 里面的一些函数就是运行时的内容了
![alt text](vue3.png)
在 defineComponent 里面 return\*()=>{}
和直接写 render()是一样的

init
配置 ts 先安装 typescript 然后通过 npx tsc --init 之后安装 jest @types/jest 在 tsconfig.json 里面 types 加入 jest

ts 会默认将文件识别为 cjs 模块，可以通过关闭或者 package.json 中"type": "module"来解决
tsconfig.json 里面 "verbatimModuleSyntax": true,
jest 默认是 commonjs 所以会执行失败
所以通过 babel 来转换模块 除此之外还需要 ts 支持
package.json type module 什么意思？？
唯一作用是定义当前项目 / 目录下 .js 文件的模块系统类型，决定 Node.js 如何解析 .js 文件的模块语法（ES 模块 vs CommonJS），同时也会影响 TypeScript、打包工具（Vite/Webpack）等对模块的识别逻辑。
ts 中不能够以 ts 为结尾
