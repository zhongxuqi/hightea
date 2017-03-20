import React from 'react'
import ReactTooltip from 'react-tooltip'

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
                                <a key={document.id} className="list-group-item" href={"#/doc_reader/"+document.id}
                                    data-tip={Language.textMap("Account") + ": "+ document.account}>
                                    <ReactTooltip place="left"/>
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
