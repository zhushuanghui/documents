import React, {Component} from 'react';
import {Form, Button, Input, Select, Table, Pagination, Dialog, Message} from 'element-react';
import {formatDate, formatData, stateRule, inputRule, lableWidth} from "./comments/common";
import axios from "./comments/axios";
import DialogForm from "./comments/DialogForm";
import ChannelID from "./comments/ChannelID";

class Admin extends Component {

    constructor() {
        super();
        this.state = {
            total: 0,
            loginStatus: 0,
            data: [],
            dialogEdit: false,
            dialogAdd: false,
            nameStatus: 0,
            currentPage:0,
            pageNumber: 0,
            pageSize: 10,
            addForm: {
                state: '0',
                role: '1',
                inputForm: [
                    {
                        prop: 'loginName',
                        name: '登录名',
                        loginName: '',
                    },
                    {
                        prop: 'passwd',
                        name: '密码',
                        passwd: '',
                    },
                    {
                        prop: 'people',
                        name: '联系人',
                        people: '',
                    },
                    {
                        prop: 'phone',
                        name: '电话',
                        phone: '',
                    },
                    {
                        prop: 'email',
                        name: '邮箱',
                        email: '',
                    },
                ]
            },
            editForm: {
                state: '',
                role: '',
                id: '',
                inputForm: [
                    {
                        prop: 'people',
                        name: '联系人',
                        people: '',
                    },
                    {
                        prop: 'phone',
                        name: '电话',
                        phone: '',
                    },
                    {
                        prop: 'email',
                        name: '邮箱',
                        email: '',
                    },
                ]
            },
            queryForm: {loginName: ''},
            addRules: {
                state: [
                    {required: true, message: '请选择状态码', trigger: 'blur'}
                ],
                role: [
                    {required: true, message: '请选择角色', trigger: 'blur'}
                ],
                channelId: [
                    {required: true, message: '请选择渠道', trigger: 'blur'}
                ]
            },
            editRules: {
                role: [
                    {required: true, message: '请选择角色', trigger: 'blur'}
                ]
            },
            columns: [
                {
                    type: 'index',
                    width: lableWidth.indexWidth,
                },
                {
                    label: "登录名",
                    prop: "loginName",
                    width: 100
                },
                {
                    label: "联系人",
                    prop: "people",

                },
                {
                    label: "电话",
                    prop: "phone",
                },
                {
                    label: "角色",
                    prop: "role",
                },
                {
                    label: "邮箱",
                    prop: "email",
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    width: 170
                },
                {
                    label: "操作",
                    prop: "handle",
                    render: (row) => {
                        return (
                            <span>
                                    <Button plain={true}
                                            type="info"
                                            size="small"
                                            onClick={() => {
                                                let {people, phone, email, role, state, id} = row;
                                                role === '系统' ? role = "2" : role = "1";
                                                this.setState({
                                                    dialogEdit: true,
                                                    editForm: {
                                                        id: id,
                                                        passwd: '',
                                                        state: state,
                                                        role: role,
                                                        inputForm: [
                                                            {
                                                                prop: 'people',
                                                                name: '联系人',
                                                                people: people,
                                                            },
                                                            {
                                                                prop: 'phone',
                                                                name: '电话',
                                                                phone: phone,
                                                            },
                                                            {
                                                                prop: 'email',
                                                                name: '邮箱',
                                                                email: email,
                                                            },
                                                        ]
                                                    },
                                                })
                                            }}>编辑</Button>
                                </span>
                        )
                    }
                }
            ]
        };
    }


    //获取数据
    getData = (currentPage) => {
        currentPage = currentPage || 0;
        axios.get(`/user/list?pageSize=${this.state.pageSize}&pageNumber=${currentPage}`).then(res => {
            let rows = formatDate(res.rows);
            this.setState({total: res.total, loginStatus: 0, data: rows})
        }).catch(error => {
            console.info(error);
        })
    };
    //获得渠道选项
    getChannel = () => {
        axios.get('/channel/findAll').then(res => {
            if (res) {
                this.setState({options: res, loginStatus: 0});
            }
        }).catch(err => {
            console.log(err);
        })
    };

    //发送数据
    postData = (obj) => {
        axios.post('/user/save', obj).then(res => {
            this.getData(this.state.currentPage);
        }).catch(error => {
            console.log(error);
        })
    };

    componentWillMount() {
        this.getData();
        this.getChannel();
    }

    //form 更改
    onChange = (key, value, name) => {
        this.setState({
            [name]: {...this.state[name], [key]: value}
        });
    };

    inputChange = (key, value, name) => {
        let inputForm = this.state[name].inputForm.map(item => {
            if (item.prop === key) {
                item[key] = value;
            }
            return item
        });
        this.setState({
            [name]: {...this.state[name], inputForm}
        });
    };

    //添加
    onAdd = (e) => {
        e.preventDefault();
        this.refs.addForm.validate((valid) => {
            if (valid) {
                let obj = formatData(this.state.addForm.inputForm);
                if (this.state.addForm.channelId) {
                    let {role, state, channelId} = this.state.addForm;
                    obj = {...obj, role, state, channelId}
                } else {
                    let {role, state} = this.state.addForm;
                    obj = {...obj, role, state}
                }
                this.postData(obj);
                this.setState({
                    dialogAdd: false,
                    addForm: {
                        state: '0',
                        role: '1',
                        inputForm: [
                            {
                                prop: 'loginName',
                                name: '登录名',
                                loginName: '',
                            },
                            {
                                prop: 'passwd',
                                name: '密码',
                                passwd: '',
                            },
                            {
                                prop: 'people',
                                name: '联系人',
                                people: '',
                            },
                            {
                                prop: 'phone',
                                name: '电话',
                                phone: '',
                            },
                            {
                                prop: 'email',
                                name: '邮箱',
                                email: '',
                            },
                        ]
                    }
                });
                console.log('submit!');
            } else {
                console.log('error submit!');
                return false;
            }
        });
    };

    //编辑
    onEdit = (e) => {
        e.preventDefault();
        this.refs.editForm.validate((valid) => {
            if (valid) {
                let obj = formatData(this.state.editForm.inputForm);
                let {role, state, id, passwd} = this.state.editForm;
                obj = {...obj, role, state, id, passwd};
                this.postData(obj);
                this.setState({dialogEdit: false});
            } else {
                console.log('error submit!');
                return false;
            }
        });
    };


    onQuery = (pageNumber) => {
        let {loginName} = this.state.queryForm;
        if (loginName) {
            axios.get(`/user/list?loginName=${loginName}&pageSize=${this.state.pageSize}&pageNumber=${pageNumber}`).then(res => {
                this.setState({total: res.total, data: formatDate(res.rows)})

            }).catch(error => {
                console.info(error);
            })
        } else {
            this.getData(pageNumber);
        }

    };

    render() {

        return (
            <div className="container">
                <Form inline={true} model={this.state.queryForm} className="demo-form-inline">
                    <Form.Item>
                        <Input placeholder="登录名" prop="loginName"
                               onChange={(value) => this.onChange("loginName", value, "queryForm")}></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={() => this.onQuery(this.state.pageNumber)}>查询</Button>
                    </Form.Item>
                </Form>

                <div className="button">
                    <Button type="primary" className="button" size="small"
                            onClick={() => {
                                this.setState({dialogAdd: true})
                            }}>新增
                    </Button>
                </div>

                {/*表格*/}
                <Table
                    style={{width: '100%'}}
                    columns={this.state.columns}
                    data={this.state.data}
                    highlightCurrentRow={true}
                />
                {/*分页*/}
                <div className="last">
                    <div className="block">
                        <Pagination layout="prev, pager, next, jumper"
                                    total={parseInt(this.state.total)}
                                    pageSize={parseInt(this.state.pageSize)}
                                    currentPage={0}
                                    onCurrentChange={(currentPage) => {
                                        currentPage = currentPage - 1;
                                        this.setState({currentPage});
                                        this.onQuery(currentPage);
                                    }}
                        />
                    </div>
                </div>

                {/*新增*/}
                <Dialog
                    title="新增"
                    size="tiny"
                    visible={this.state.dialogAdd}
                    onCancel={() => this.setState({dialogAdd: false})}>
                    <Dialog.Body>
                        <Form ref="addForm"
                              model={this.state.addForm}
                              rules={this.state.addRules}
                              labelWidth="80">
                            {/*<Form.Item*/}
                            {/*label="状态"*/}
                            {/*prop="state"*/}
                            {/*key="state">*/}
                            {/*<Select*/}
                            {/*value={this.state.addForm.state === undefined ? '' : this.state.editForm.state + ''}*/}
                            {/*onChange={(value) => this.onChange("state", value, "addForm")}>*/}
                            {/*<Select.Option label="暂停" value="0"></Select.Option>*/}
                            {/*<Select.Option label="启用" value="1"></Select.Option>*/}
                            {/*</Select>*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item*/}
                            {/*label="角色"*/}
                            {/*prop="role" key="role">*/}
                            {/*<Select value={this.state.addForm.role}*/}
                            {/*onChange={(value) => this.onChange("role", value, "addForm")}>*/}
                            {/*<Select.Option label="下游" value="1"></Select.Option>*/}
                            {/*<Select.Option label="系统" value="2"></Select.Option>*/}
                            {/*</Select>*/}
                            {/*</Form.Item>*/}
                            {/*{this.state.addForm.role === "1" ? (<Form.Item*/}
                            {/*label="渠道"*/}
                            {/*prop="channelId" key="channelId">*/}
                            {/*<ChannelID addChange={this.onChange}/>*/}
                            {/*</Form.Item>) : null}*/}
                            {/*{this.state.addForm.inputForm.map((item, index) => {*/}
                            {/*return (<Form.Item*/}
                            {/*key={index}*/}
                            {/*label={item.name}*/}
                            {/*prop={item.prop}*/}
                            {/*rules={inputRule(item)}>*/}
                            {/*<Input onChange={(value) => this.inputChange(item.prop, value, "addForm")}*/}
                            {/*value={item[item.prop]}></Input>*/}
                            {/*</Form.Item>)*/}
                            {/*})}*/}
                            <DialogForm
                                model={this.state.addForm}
                                name="addForm"
                                onChange={this.onChange}
                                inputChange={this.inputChange}
                            />
                        </Form>

                    </Dialog.Body>

                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({dialogAdd: false})}>取 消</Button>
                        <Button type="primary" onClick={(e) =>
                            this.onAdd(e)
                        }>确定</Button>
                    </Dialog.Footer>
                </Dialog>

                {/*编辑*/}
                <Dialog
                    title="编辑"
                    size='tiny'
                    visible={this.state.dialogEdit}
                    onCancel={() => this.setState({dialogEdit: false})}>
                    <Dialog.Body>
                        <Form ref="editForm"
                              rules={this.state.editRules}
                              model={this.state.editForm}
                              labelWidth="80"
                              inputWidth="300">
                            <Form.Item
                                label="状态"
                                prop="state"
                                rules={stateRule(this.state.editForm.state)}
                                key="state">
                                <Select
                                    value={this.state.editForm.state === undefined ? '' : this.state.editForm.state + ''}
                                    onChange={(value) => this.onChange("state", value, "editForm")}>
                                    <Select.Option label="暂停" value="0"></Select.Option>
                                    <Select.Option label="启用" value="1"></Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="角色"
                                prop="role"
                                key="role">
                                <Select
                                    value={this.state.editForm.role}
                                    onChange={(value) => this.onChange("role", value, "editForm")}>
                                    <Select.Option label="下游用户" value="1"></Select.Option>
                                    <Select.Option label="系统" value="2"></Select.Option>
                                </Select>
                            </Form.Item>

                            {this.state.editForm.inputForm.map((item, index) => {
                                return (<Form.Item
                                    key={index}
                                    label={item.name}
                                    prop={item.prop}
                                    rules={inputRule(item)}>
                                    <Input onChange={(value) => this.inputChange(item.prop, value, "editForm")}
                                           value={item[item.prop]}></Input>
                                </Form.Item>)
                            })}
                            {/*<DialogForm*/}
                            {/*model={this.state.editForm}*/}
                            {/*onChange={this.onChange}*/}
                            {/*name="editForm"*/}
                            {/*inputChange={this.inputChange}*/}
                            {/*/>*/}
                            <Form.Item
                                label='修改密码'
                                prop='passwd'>
                                <Input
                                    value={this.state.editForm.passwd}
                                    placeholder="如需修改密码请填写"
                                    onChange={(value) => this.onChange("passwd", value, "editForm")}/>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>

                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => {
                            this.refs.editForm.resetFields();
                            this.setState({dialogEdit: false})
                        }
                        }>取 消</Button>
                        <Button type="primary" onClick={(e) => {
                            this.onEdit(e);
                        }}>确 定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>

        )
    }

}

export default Admin;