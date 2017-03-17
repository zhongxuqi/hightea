function Parse2BeforeLineAfter(str, cursor) {
    let before = '', line = '', after = ''
    let strCursorBefore = str.substring(0, cursor),
        strCursorAfter = str.substring(cursor)
    let lineBegin = strCursorBefore.lastIndexOf("\n"),
        lineEnd = strCursorAfter.indexOf("\n")
    if (lineBegin >= 0) {
        before = strCursorBefore.substring(0, lineBegin + 1)
    }
    if (lineEnd >= 0) {
        after = strCursorAfter.substring(lineEnd)
    } else {
        line = strCursorBefore.substring(lineBegin + 1) + strCursorAfter
    }
    return {before,line,after}
}

export default {
    Parse2BeforeLineAfter,
}
