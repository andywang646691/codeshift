// com cn tw es fr jp com.br de it se nl fi dk pl hu cz
// apowersoft-no.com apowersoft-tr.com

// https://www.apowersoft.com/remove-background-online
// https://www.apowersoft.cn/remove-background-online
// https://www.apowersoft.tw/remove-background-online
// https://www.apowersoft.es/remove-background-online
// https://www.apowersoft.fr/remove-background-online
// https://www.apowersoft.jp/remove-background-online
// https://www.apowersoft.com.br/remove-background-online

// https://www.apowersoft.it/remove-background-online
// https://www.apowersoft.se/remove-background-online
// https://www.apowersoft.nl/remove-background-online
// https://www.apowersoft.fi/remove-background-online
// https://www.apowersoft.dk/remove-background-online
// https://www.apowersoft.pl/remove-background-online
// https://www.apowersoft.hu/remove-background-online
// https://www.apowersoft.cz/remove-background-online
// https://www.apowersoft-no.com/remove-background-online  ***
// https://www.apowersoft-tr.com/remove-background-online  ***

class CodePlugin {
    constructor() {
        this.projects = ['tw', 'es', 'com.br', 'de', 'it', 'se', 'nl', 'fi', 'dk', 'pl', 'hu', 'cz'].map(postfix => 'apowersoft.' + postfix)
        this.filePath = 'wp-content/themes/apowersoft/smart-image.php'
        this.commitMessage = 'smart-image 移动端优化'
        this.clearCacheCmd = 'wx clear [project] remove-background-online -s cn-us'
    }
    // 移动端优化
    apply(code) {
        code = code.replace("?php $image_base_url = COMMON_CDN . '/products/smart-image/assets' ?", `?php
        $image_base_url = COMMON_CDN . '/products/smart-image/assets';
        $download_url = 'https://download.apowersoft.com/down.php?softid=backgrounderaser'
    ?`)
        const doc = this.$.load(code, { decodeEntities: false })
        doc('.w-button--download').addClass('inline-block')
        doc('.w-banner__upload').addClass('hidden md:flex')
        doc('.w-button--download').eq(0).addClass('hidden md:inline-block').removeClass('inline-block')
        if (doc('.w-banner__review').children().length == 2) {
            doc('.w-banner__review').append(`
            <a href="<?= $download_url?>" class="w-button w-button--download md:hidden inline-block" role="button" style="margin: 10px 0 20px;">
                <img src="<?= $image_base_url?>/arrow-download.png" alt=""> Go
            </a>
        `)
        }
        code = doc.html('#cheerio')
        return code
    }
    // 替换图标
}

module.exports = CodePlugin