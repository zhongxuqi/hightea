import React from 'react';

import PublicDocShortcut from '../publicdoc_shortcut/publicdoc_shortcut.jsx'

import './publicdocs_list.less'

export default class DocsList extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps
    }

    render() {
        return (
            <ul className="publicdocs-list">
                {
                    this.props.documents.map((document, index) => {
                        return (
                            <PublicDocShortcut key={index} document={document} onSaveDoc={this.props.onSaveDoc} onDeleteDoc={this.props.onDeleteDoc}></PublicDocShortcut>
                        )
                    })
                }
            </ul>
        );
    }
}
