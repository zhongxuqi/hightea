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

function getGenders() {
    return [{
        label: currLang.textMap('male'),
        value: 'male',
    }, {
        label: currLang.textMap('female'),
        value: 'female',
    }, {
        label: currLang.textMap('secret'),
        value: '',
    }]
}

function Short2Language(short) {
    for (let i=0;i<languages.length;i++) {
        if (languages[i].short == short) {
            return languages[i].value
        }
    }
}

function Language2Short(lang) {
    for (let i=0;i<languages.length;i++) {
        if (languages[i].value == lang) {
            return languages[i].short
        }
    }
}

export default {
    SelectLanguage: selectLanguage,
    languages: languages,
    currLang: currLang,
    textMap: textMap,
    GetGenders: getGenders,
    Short2Language: Short2Language,
    Language2Short: Language2Short,
}
