import React from 'react'

import Language from '../../language/language.jsx'

import './doc_list_title.less'

export default class DocListTitle extends React.Component {
    render() {
        return <h4 className="doc-list-title">{Language.textMap("We’ve found ")}{this.props.docTotal}{Language.textMap(" documents")}</h4>
    }
}
