import ChineseTextMap from './chinese.jsx'

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

let urlLang = "en"

let keyValues = window.location.search.substring(1).split(";")
for (let i=0;i<keyValues.length;i++) {
    let keyValue = keyValues[i].split("=")
    if (keyValue[0] == "lang") {
        urlLang = keyValue[1]
        break
    }
}

let currLang = languages[0]
for (let i=0;i<languages.length;i++) {
    if (languages[i].short == urlLang) {
        currLang = languages[i]
        break
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
