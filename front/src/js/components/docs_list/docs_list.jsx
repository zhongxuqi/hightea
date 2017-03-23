import React from 'react';

import DocShortcut from '../doc_shortcut/doc_shortcut.jsx'

import './docs_list.less'

export default class DocsList extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps
    }

    render() {
        return (
            <ul className="docs-list">
                {
                    this.props.documents.map((document, index) => {
                        return (
                            <DocShortcut key={index} document={document} onSaveDoc={this.props.onSaveDoc}
                                onDeleteDoc={this.props.onDeleteDoc} isSelf={this.props.isSelf}></DocShortcut>
                        )
                    })
                }
            </ul>
        );
    }
}
