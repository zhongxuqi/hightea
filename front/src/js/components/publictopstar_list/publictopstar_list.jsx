import React from 'react';

import Language from '../../language/language.jsx'

import './publictopstar_list.less'

export default class PublicTopStarList extends React.Component {
    render() {
        return (
            <div className="publictopstar-list">
                <h5>{Language.textMap("Star documents top list")}:</h5>
                <div className="list-group">
                    {
                        this.props.documents.map((document)=>{
                            return (
                                <a key={document.id} href={"#/publicdoc_reader/"+document.id} className="list-group-item">
                                    {document.title}
                                    <span className="badge">{document.starPercent}%</span>
                                </a>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
