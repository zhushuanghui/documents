import React, {Component} from 'react';
import 'element-theme-default';
import {NavMenu, Button} from 'element-react';
import {NavLink, withRouter} from 'react-router-dom';
// import MNav from "./common/MNav";
// import MHeader from "./common/MHeader";
import {admin} from './comments/common';
import axios from "axios/index";

class App extends Component {
    constructor(){
        super();
        this.state={};
    }

    handelClick = () => {
        axios.get('/user/out').then(res => {
            localStorage.clear();
            this.props.history.push('/login')
        });
    };

componentWillMount(){
    // let loginName=this.props.location.state.username;
    // this.setState({loginName})
}

    render() {
    let style={'display':'none'};
        return (
            <div className="app">
                <div className="header">
                    <div className="user">
                        用户名:{admin.username}
                        <Button type="text"
                        className="button exit"
                        onClick={this.handelClick}
                        >退出</Button>
                    </div>
                </div>

                <div className="page">
                    <div className="nav" style={{textAlign: "center"}}>
                        <NavLink to={"/channel"}>
                            <div className="row">配置列表</div>
                        </NavLink>
                        <NavLink to={"/deliver"}>
                            <div className="row">投递列表</div>
                        </NavLink>
                        <NavLink to={"/product"}>
                            <div className="row">产品列表</div>
                        </NavLink>
                        <NavLink to={"/admin"}>
                            <div className="row">用户管理</div>
                        </NavLink>
                        <NavLink to={"/daylist"}>
                            <div className="row">每日统计</div>
                        </NavLink>
                        <NavLink to={"/statistics"}>
                            <div className="row">统计列表</div>
                        </NavLink>
                    </div>
                    <div className="containerBox">
                        {this.props.children}
                    </div>
                </div>


            </div>
        );
    }
}

export default withRouter(App);
