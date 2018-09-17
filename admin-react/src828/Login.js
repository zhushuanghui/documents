import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actions,getLoginAPI} from './store';
import {Form, Input, Button, Card} from 'element-react';
import axios from './common/axios';
import 'babel-polyfill';
import {admin} from './common/common';

@connect(state=>({...state}),actions)
class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginStatus:'',
            form: {
                passwd: '',
                username: ''
            },
            message:'',
            rules: {
                passwd: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请输入密码'));
                            }
                                callback();
                        }
                    }
                ],
                username: [
                    {required: true, message: '请填写用户名', trigger: 'blur'}]
            }
        };
    }

    handleSubmit(e) {
        e.preventDefault();

        this.refs.form.validate((valid) => {
            if (valid) {
                let {username,passwd}=this.state.form;
                // axios.get(`/user/login?loginName=${username}&passwd=${passwd}`
                // ).then(res=> {
                //     if(res.status){
                //         this.setState({loginStatus:-1,message:res.message});
                //    }else{
                //         localStorage.role=res.role;
                //         localStorage.loginName=res.loginName;
                //         res.role==="2"? this.props.history.push(`/channel`):this.props.history.push(`/deliver`);
                //    }
                //
                // })
               this.props.getLogin(username,passwd);
                this.props.role==="2"? this.props.history.push(`/channel`):this.props.history.push(`/deliver`);
            } else {
                return false;
            }
        });
    }


    handleReset(e) {
        e.preventDefault();
        this.refs.form.resetFields();
        this.setState({
            loginStatus:'',
            form: {
                passwd: '',
                username: ''
            }
        })
    }

    onChange(key, value) {
        this.setState({
            form: {...this.state.form,[key]: value}
        });
    }


    render() {
        return (
            <div className="login">
                <Card className="box-card"
                      header={
                          <div className="clearfix">
                              <span style={{ "lineHeight": "18px" }}>用户名密码登陆</span>
                          </div>
                      }>
                    <Form ref="form" model={this.state.form} rules={this.state.rules}
                          className="ruleForm">
                        <Form.Item className="Item">
                            <div className="el-form-item__error fail">{this.state.loginStatus===-1?this.state.message:''}</div>
                        </Form.Item>
                        <Form.Item  prop="username">
                            <Input type="text" placeholder="请输入用户名" value={this.state.form.username}
                                   onChange={this.onChange.bind(this, 'username')} autoComplete="off"/>
                        </Form.Item>
                        <Form.Item  prop="passwd">
                            <Input type="password" placeholder="请输入密码"  value={this.state.form.passwd}
                                   onChange={this.onChange.bind(this, 'passwd')} autoComplete="off"/>
                        </Form.Item>
                        <Form.Item className="submit-btn">
                            <Button className="btn2" type="primary" onClick={this.handleSubmit.bind(this)}>登陆</Button>

                        </Form.Item>
                        <Form.Item className="submit-btn">
                            <Button className="btn2" onClick={this.handleReset.bind(this)} type="primary">重置</Button>

                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default  Login;