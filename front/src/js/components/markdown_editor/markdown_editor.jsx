import React from 'react'
import CodeMirror from 'codemirror'

import './markdown_editor.less'

export default class MarkdownEditor extends React.Component {
    componentDidMount() {
        console.log("init markdown-editor")
        let myCodeMirror = CodeMirror.fromTextArea(document.getElementById("markdown-editor"), {
            lineNumbers: false,
            mode: "htmlmixed"
        });
    }

    render() {
        return (
            <div className="lowtea-markdown-editor">
                <textarea id="markdown-editor"></textarea>
            </div>
        )
    }
}