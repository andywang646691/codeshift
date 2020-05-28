#!/usr/bin/env node
const CodeShift = require('../src/index.js')
const yargs = require('yargs')
const argv = yargs.command('run [plugin]', '代码转换', yargs => {
    yargs.positional('plugin', {
        describe: '输入要使用的插件, 默认为smart-image',
        default: 'smart-image'
    })
}, argv => {
    new CodeShift('smart-image', argv)
}).option('prod', {
    alias: 'p',
    type: 'boolean',
    description: '是否进入生产模式, 生产模式会将代码推送至git并发布至生产环境'
}).help().argv
