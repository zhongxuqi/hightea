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
                            <DocShortcut 
                                key={index}
                                id={document.id}
                                title={document.title} 
                                abstract={document.content.substring(0,50)} 
                                likeNum={document.likeNum} 
                                modifyTime={document.modifyTime}></DocShortcut>
                        )
                    })
                }
            </ul>
        );
    }
}
