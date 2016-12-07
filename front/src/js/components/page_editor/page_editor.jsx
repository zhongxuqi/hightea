import React from 'react';

import PageSideShortcut from '../page_side_shortcut/page_side_shortcut.jsx'
import MarkdownEditor from '../markdown_editor/markdown_editor.jsx'

import './page_editor.less';

export default class PageEditor extends React.Component {
    // componentDidMount() {
    //     $(".page-content-editer").height($(window).height() - $(".page-title").height() - 120)

    //     let simplemde = new SimpleMDE({
    //         element: $("#editor")[0],
    //         spellChecker: false,
    //     })
    // }

    render() {
        return (
            <div className="clearfix" style={{height:"100%"}}>
                <div className="col-md-3 col-xs-3 lowtea-pages-sidebar">
                    <div className="side-searchbar">
                        <input className="form-control" placeholder="请输入关键词"/>
                        <button className="btn btn-default"><span className="glyphicon glyphicon-search"></span></button>
                    </div>
                    <ul className="pages-list">
                        <li className="pages-list-item btn-new-page">
                            <a><span className="glyphicon glyphicon-plus"></span>添加新文章</a>
                        </li>
                        <li className="pages-list-item">
                            <PageSideShortcut title="文章标题" likeNum="1"></PageSideShortcut>
                        </li>
                    </ul>
                </div>

                <div className="col-md-9 col-xs-9 lowtea-page-editor">
                    <div className="page-title clearfix">
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

                    <MarkdownEditor></MarkdownEditor>
                </div>
            </div>
        )
    }
}