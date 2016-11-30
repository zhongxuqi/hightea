import React from 'react';

import './page_editor.less';

export default class PageEditor extends React.Component {
    componentDidMount() {
        $(".page-content-editer").height($(window).height() - $(".page-title").height() - 150)

        let simplemde = new SimpleMDE({
            element: $("#editor")[0],
            spellChecker: false,
        })
    }

    render() {
        return (
            <div className="lowtea-page-editor">
                <div className="page-title clearfix">
                    <div className="table-cell" style={{width:"1%"}}>
                        <button type="button" className="btn btn-default">返回</button>
                    </div>
                    <div className="table-cell" style={{width:"99%"}}>
                        <input className="page-title-input" placeholder="标题"/>
                    </div>
                    <div className="table-cell" style={{width:"1%"}}>
                        <span className="badge">仅自己可见</span>
                    </div>
                    <div className="table-cell" style={{width:"1%"}}>
                        <div className="dropdown">
                            <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                                操作
                                <span className="caret"></span>
                            </button>

                            <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                                <li role="presentation"><a role="menuitem" href="#">撤回(回到草稿)</a></li>
                                <li role="presentation"><a role="menuitem" href="#">发布(仅自己可见)</a></li>
                                <li role="presentation"><a role="menuitem" href="#">发布(仅成员可见)</a></li>
                                <li role="presentation"><a role="menuitem" href="#">发布(对外公开)</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="table-cell" style={{width:"1%"}}>
                        <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-floppy-disk" style={{marginRight:"5px"}}></span>保存</button>
                    </div>
                </div>

                <div className="page-content-editer">
                    <textarea id="editor"></textarea>
                </div>
            </div>
        )
    }
}