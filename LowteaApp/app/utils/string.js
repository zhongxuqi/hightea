function Parse2BeforeLeftRightAfter(str, cursor) {
    let before = '', left = '', right = '', after = ''
    let strCursorBefore = str.substring(0, cursor),
        strCursorAfter = str.substring(cursor)
    let lineBegin = strCursorBefore.lastIndexOf("\n"),
        lineEnd = strCursorAfter.indexOf("\n")
    if (lineBegin >= 0) {
        before = strCursorBefore.substring(0, lineBegin + 1)
    }
    if (lineEnd >= 0) {
        left = strCursorBefore.substring(lineBegin + 1)
        right = strCursorAfter.substring(0, lineEnd)
        after = strCursorAfter.substring(lineEnd)
    } else {
        left = strCursorBefore.substring(lineBegin + 1)
        right = strCursorAfter
    }
    return {before,left,right,after}
}

function Parse2BeforeLineAfter(str, cursor) {
    let {before,left,right,after} = Parse2BeforeLeftRightAfter(str, cursor)
    return {
        before: before,
        line: left + right,
        after: after,
    }
}

export default {
    Parse2BeforeLineAfter,
}
