import React from 'react'

import HttpUtils from '../../utils/http.jsx'
import Language from '../../language/language.jsx'

import './system_manager.less'

export default class SystemManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dumpfiles: [],
        }

        this.getDumpFiles()
    }

    getDumpFiles() {
        HttpUtils.get("/api/root/dumpfiles", {}, ((resp) => {
            this.setState({dumpfiles: resp.files})
        }).bind(this), (data) => {
            HttpUtils.alert("["+data.status+"]: "+data.responseText)
        })
    }

    dumpSystem() {
        HttpUtils.post("/api/root/dump_system", {}, ((resp) => {
            HttpUtils.notice(Language.textMap("Success to Dump"))
        }).bind(this), (data) => {
            HttpUtils.alert("["+data.status+"]: "+data.responseText)
        })
    }

    deleteDumpFile(filename) {
        this.props.onConfirm(Language.textMap("Warning"), 
                Language.textMap("Whether to delete the dumpfile")+" ?", (()=>{
            HttpUtils.delete("/api/root/dumpfile/"+filename, {}, ((resp) => {
                this.getDumpFiles()
            }).bind(this), (data) => {
                HttpUtils.alert("["+data.status+"]: "+data.responseText)
            })
        }).bind(this))
    }

    render() {
        return (
            <div className="system_manager clearfix">
                <div className="lowtea-dumpfile-table">
                    <div className="panel panel-default">
                        <div className="panel-heading lowtea-table" style={{width:"100%"}}>
                            <div className="lowtea-table-cell" style={{width:"99%"}}>
                                {Language.textMap("Dump File")}
                            </div>
                            <div className="lowtea-table-cell">
                                <button type="button" className="btn btn-primary" style={{marginRight:'10px'}} onClick={this.dumpSystem}>{Language.textMap("Dump")}</button>
                            </div>
                            <div className="lowtea-table-cell">
                                <button type="button" className="btn btn-primary" onClick={this.getDumpFiles.bind(this)}>{Language.textMap("Refresh")}</button>
                            </div>
                        </div>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>{Language.textMap("File Name")}</th>
                                    <th>{Language.textMap("Action")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    this.state.dumpfiles.map((file, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{file}</td>
                                                <td>
                                                    <a type="button" className="btn btn-info btn-xs" href={"/api/root/dumpfile/" + file} style={{marginRight: "10px"}} target="_blank">
                                                        {Language.textMap("DownLoad")}
                                                    </a>
                                                    <button type="button" className="btn btn-warning btn-xs" style={{marginRight: "10px"}} onClick={this.deleteDumpFile.bind(this,file)}>{Language.textMap("Delete")}</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}