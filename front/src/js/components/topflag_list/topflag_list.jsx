import React from 'react'

import Language from '../../language/language.jsx'

import './topflag_list.less';

export default class TopFlagList extends React.Component {
    render() {
        return (
            <div className="topflag-list">
                <h5>{Language.textMap("Flag documents top list")}:</h5>
                <div className="list-group">
                    {
                        this.props.documents.map((document)=>{
                            return (
                                <a key={document.id} className="list-group-item" href={"#/doc_reader/"+document.id}>
                                    {document.title}
                                    <span className="badge">{document.flagPercent}%</span>
                                </a>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
