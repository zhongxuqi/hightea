import ChineseTextMap from './chinese.jsx'

let language

let keyValues = window.location.search.substring(1).split(";")
for (let i=0;i<keyValues.length;i++) {
    let keyValue = keyValues[i].split("=")
    if (keyValue[0] == "lang") {
        language = keyValue[1]
    }
}

function textMap(rawText) {
    if (language == "cn" && rawText in ChineseTextMap) {
        return ChineseTextMap[rawText]
    }
    return rawText
}

export default {
    textMap: textMap,
}