const path = require('path')
const fs = require('fs')
const apowerRoot = '/Users/zhengzheming/workplace/projects/business'
const log = console.log
const chalk = require('chalk')
const cheerio = require('cheerio')
const execa = require('execa')

class CodeShift {
    constructor(plugin, argvs = {}) {
        this.leftArrow = '%left-arrow%'
        this.rightArrow = '%right-arrow%'
        const isProd = argvs.prod
        // load plugin
        const CodePlugin = require(`./${plugin}`)
        const code = new CodePlugin()
        this.addUtils(code)
        if (!code.projects) {
            log(chalk.red(`插件${plugin}没有设置项目`))
            return
        }
        if (!code.filePath) {
            log(chalk.red(`插件${plugin}没有设置待修改的文件路径`))
            return
        }
        if (isProd && !code.commitMessage) {
            log(chalk.red(`插件${plugin}为提供commit message`))
            return
        }
        // load code file
        code.projects.forEach(project => {
            this.projectDir = path.join(apowerRoot, project)
            const codeFilePath = path.join(apowerRoot, project, code.filePath)
            const codeString = fs.readFileSync(codeFilePath, 'utf-8')
            // execute code transformation
            const transformedCode = this.afterTransform(code.apply(this.beforeTransform(codeString)))
            if (fs.existsSync(codeFilePath)) {
                log(`\n==========#pull git仓库代码#==========\n`)
                this.command(`git pull`)
                fs.writeFileSync(codeFilePath, transformedCode)
                log(chalk.green(`${project} 文件写入成功`))
                if (isProd) {
                    log(`\n==========#提交至git仓库#==========\n`)
                    // this.command(`git add ${code.filePath}`)
                    // this.command(`git commit -m ${code.commitMessage.replace(/\s/g, '\\ ')}`)
                    // this.command('git push')
                    log(`\n==========#开始发布#==========\n`)
                    this.command(`wx publish ${code.filePath} -e=prod`)
                    if (code.clearCacheCmd) {
                        log(`\n==========#清理缓存#==========\n`)
                        this.command(code.clearCacheCmd.replace('[project]', project))
                    }
                }
            } else {
                log(chalk.red(`写入失败， 找不到相应路径: ${codeFilePath}`))
            }
        })
        log(`任务结束!`)
    }
    command(cmd) {
        execa.commandSync(cmd, {
            cwd: this.projectDir,
            stdio: 'inherit'
        })
    }
    wrapCode(code) {
        return `<div id="cheerio">${code}</div>`
    }
    clearWrapCode(code) {
        code = code.replace('<div id="cheerio">', '')
        return code.slice(0, code.length - 6)
    }
    stringifyPhp(code) {
        return code.replace(/<\?/g, `${this.leftArrow}?`).replace(/\?\s*?>/g, `\?${this.rightArrow}`)
    }
    parsePhp(code) {
        return code.replace(new RegExp(this.leftArrow+'\\?', 'g'), '<?').replace(new RegExp('\\?' + this.rightArrow, 'g'), '?>')
    }
    beforeTransform(code) {
        code = this.stringifyPhp(code)
        code = this.wrapCode(code)
        return code
    }
    afterTransform(code) {
        code = this.parsePhp(code)
        return this.clearWrapCode(code)
    }
    addUtils(plugin) {
        plugin.$ = cheerio
        plugin.stringifyPhp = this.stringifyPhp.bind(this)
        plugin.parsePhp = this.parsePhp.bind(this)
    }
}


module.exports = CodeShift

// auto smart-image