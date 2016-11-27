import React from 'react';

import PageShortcut from '../page_shortcut/page_shortcut.jsx'

import './pages_list.less'

export default class PagesList extends React.Component {
    render() {
        return (
            <ul className="pages-list">
                <li className="pages-list-item">
                    <PageShortcut title="文章标题" abstract="文章摘要" likeNum="100" updateTime="1天前" updateUser="admin"></PageShortcut>
                </li>

                <li className="pages-list-item">
                    <PageShortcut title="文章标题" abstract="文章摘要" likeNum="100" updateTime="1天前" updateUser="admin"></PageShortcut>
                </li>

                <li className="pages-list-item">
                    <PageShortcut title="文章标题" abstract="文章摘要" likeNum="100" updateTime="1天前" updateUser="admin"></PageShortcut>
                </li>

                <li className="pages-list-item">
                    <PageShortcut title="文章标题" abstract="文章摘要" likeNum="100" updateTime="1天前" updateUser="admin"></PageShortcut>
                </li>

                <li className="pages-list-item">
                    <PageShortcut title="文章标题" abstract="文章摘要" likeNum="100" updateTime="1天前" updateUser="admin"></PageShortcut>
                </li>

                <li className="pages-list-item">
                    <PageShortcut title="文章标题" abstract="文章摘要" likeNum="100" updateTime="1天前" updateUser="admin"></PageShortcut>
                </li>

                <li className="pages-list-item">
                    <PageShortcut title="文章标题" abstract="文章摘要" likeNum="100" updateTime="1天前" updateUser="admin"></PageShortcut>
                </li>
            </ul>
        );
    }
}