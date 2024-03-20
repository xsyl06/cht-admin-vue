<h1>cht-admin-vue</h1>

[![license](https://img.shields.io/github/license/pure-admin/vue-pure-admin.svg)](LICENSE)

**中文**

## 介绍
配套后端项目地址[cht](https://github.com/xsyl06/cht)

前端是基于pure-admin-thin二次开发的后端管理系统，该项目仅包含后台管理的用户、角色、菜单权限以及登录鉴权等最基础功能，适合作为后台管理的脚手架进行使用。

具体前端相关问题可查看[vue-pure-admin保姆级文档](https://yiming_chang.gitee.io/pure-admin-doc/)

## 特性
- 前端采用[vue-pure-admin](https://yiming_chang.gitee.io/pure-admin-doc/)的精简版pure-admin-thin进行二次开发
- 与后端项目[cht](https://github.com/xsyl06/cht)配合使用可降低上手难度
  - 支持动态菜单与路由
  - 支持登录验证与token刷新
  - 支持权限验证与按钮级别权限控制
  - 前后端使用sm2方式进行加密通信，保证通信安全

## 说明
cht-admin-vue前后端使用SM2国密加密，因此需要修改项目中的`/src/utils/http/index.js`文件中的`privateKey`为生成的前端私钥和`publicKey`为生成的后端公钥。

## 许可证
完全免费，具体参考[vue-pure-admin](https://yiming_chang.gitee.io/pure-admin-doc/)

[MIT © 2024-present, cht-admin-vue](./LICENSE)
