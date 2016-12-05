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
                <div className="toolbar">
                    <a className="fa fa-bold"></a>
                    <a className="fa fa-italic"></a>
                    <a className="fa fa-header"></a>
                    <i className="separator">|</i>
                </div>
                <textarea id="markdown-editor"></textarea>
            </div>
        )
    }
}