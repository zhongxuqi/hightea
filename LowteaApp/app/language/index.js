import ChineseTextMap from './chinese.js'

let languages = [
    {
        value: "English",
        short: "en",
        textMap: (text) => {
            return text
        },
    },
    {
        value: "中文",
        short: "cn",
        textMap: (text) => {
            if (text in ChineseTextMap) {
                return ChineseTextMap[text]
            }
            return text
        },
    },
]

let currLang = languages[0]

function selectLanguage(lang) {
    for (let i=0;i<languages.length;i++) {
        if (languages[i].short == lang) {
            currLang = languages[i]
            break
        }
    }
}

function textMap(rawText) {
    return currLang.textMap(rawText)
}

export default {
    languages: languages,
    currLang: currLang,
    textMap: textMap,
}
