import React,{Component} from 'react';
import {NavMenu,Button} from 'element-react';
import 'element-theme-default';
import axios from "axios/index";
import {withRouter} from 'react-router-dom';
class MHeader  extends  Component{
    constructor(){
        super();
    }
    componentDidMount(){

    }
    handelClick=()=>{
            axios.get('/user/out').then(res=>{
                this.props.history.push('/login')
            });
    };

    render(){
        return(
            <div className="header">
                <Button type="text" className="button exit" onClick={this.handelClick} ref='button'>退出</Button>
            </div>
        )
    }
}

export default  withRouter(MHeader) ;