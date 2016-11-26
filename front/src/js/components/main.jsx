import React from 'react'

import Menu from './menu.jsx'
import PagesOverView from './pages_overview.jsx'

export default class Main extends React.Component {
    render() {
        return (
            <div>
                <Menu class={"col-xs-2"}></Menu>
                <PagesOverView class={"col-xs-10"}></PagesOverView>
            </div>
        )
    }
}