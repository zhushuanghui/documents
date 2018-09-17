import React, {
    Component
} from 'react';
import {
    Form,
    Button,
    Input,
    Table,
    Pagination,
    Dialog
} from 'element-react';
import {
    formatDate,
    formatData,
    lableWidth
} from "./common/common";
import axios from "./common/axios";
import DialogForm from "./common/DialogForm";


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
            currentPage: 0,
            pageNumber: 0,
            pageSize: 10,
            addForm: {
                state: '0',
                role: '1',
                inputForm: [{
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
                inputForm: [{
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
            queryForm: {
                loginName: ''
            },
            addRules: {
                state: [{
                    required: true,
                    message: '请选择状态码',
                    trigger: 'blur'
                }],
                role: [{
                    required: true,
                    message: '请选择角色',
                    trigger: 'blur'
                }],
                channelId: [{
                    required: true,
                    message: '请选择渠道',
                    trigger: 'blur'
                }]
            },
            editRules: {
                role: [{
                    required: true,
                    message: '请选择角色',
                    trigger: 'blur'
                }]
            },
            columns: [{
                    type: 'index',
                    width: 70
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
                    label: "状态",
                    prop: "state",
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
                        return ( <
                            span >
                            <
                            Button plain = {
                                true
                            }
                            type = "info"
                            size = "small"
                            onClick = {
                                () => {
                                    let {
                                        people,
                                        phone,
                                        email,
                                        role,
                                        state,
                                        id
                                    } = row;
                                    role === '系统' ? role = "2" : role = "1";
                                    state = state === '开启' ? "1" : "0";
                                    this.setState({
                                        dialogEdit: true,
                                        editForm: {
                                            id: id,
                                            passwd: '',
                                            state: state,
                                            role: role,
                                            inputForm: [{
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
                                }
                            } > 编辑 < /Button>  < /
                            span >
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
            this.setState({
                total: res.total,
                loginStatus: 0,
                data: rows
            })
        })
    };
    //获得渠道选项
    getChannel = () => {
        axios.get('/channel/findAll').then(res => {
            if (res) {
                this.setState({
                    options: res,
                    loginStatus: 0
                });
            }
        })
    };

    //发送数据
    postData = (obj) => {
        axios.post('/user/save', obj).then(res => {
            this.getData(this.state.currentPage);
        })
    };

    componentWillMount() {
        this.getData();
        this.getChannel();
    }

    //form 更改
    onChange = (key, value, name) => {
        this.setState({
            [name]: { ...this.state[name],
                [key]: value
            }
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
            [name]: { ...this.state[name],
                inputForm
            }
        });
    };

    //添加
    onAdd = (e) => {
        e.preventDefault();
        this.refs.addForm.validate((valid) => {
            if (valid) {
                let obj = formatData(this.state.addForm.inputForm);
                if (this.state.addForm.channelId) {
                    let {
                        role,
                        state,
                        channelId
                    } = this.state.addForm;
                    obj = { ...obj,
                        role,
                        state,
                        channelId
                    }
                } else {
                    let {
                        role,
                        state
                    } = this.state.addForm;
                    obj = { ...obj,
                        role,
                        state
                    }
                }
                this.postData(obj);
                this.setState({
                    dialogAdd: false,
                    addForm: {
                        state: '0',
                        role: '1',
                        inputForm: [{
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
            } else {
                return false;
            }
        });
    };

    onCancel = (form, dialog) => {
        form.resetFields();
        this.setState({
            [dialog]: false
        });
    };

    //编辑
    onEdit = (e) => {
        e.preventDefault();
        this.refs.editForm.validate((valid) => {
            if (valid) {
                let obj = formatData(this.state.editForm.inputForm);
                let {
                    role,
                    state,
                    id,
                    passwd
                } = this.state.editForm;
                obj = { ...obj,
                    role,
                    state,
                    id,
                    passwd
                };
                this.postData(obj);
                this.setState({
                    dialogEdit: false
                });
            } else {
                return false;
            }
        });
    };


    onQuery = (pageNumber) => {
        let {
            loginName
        } = this.state.queryForm;
        if (loginName) {
            axios.get(`/user/list?loginName=${loginName}&pageSize=${this.state.pageSize}&pageNumber=${pageNumber}`).then(res => {
                this.setState({
                    total: res.total,
                    data: formatDate(res.rows)
                })

            })
        } else {
            this.getData(pageNumber);
        }

    };

    render() {

        return ( <
            div className = "container" >
            <
            Form inline = {
                true
            }
            model = {
                this.state.queryForm
            }
            className = "demo-form-inline" >
            <
            Form.Item >
            <
            Input placeholder = "登录名"
            prop = "loginName"
            onChange = {
                (value) => this.onChange("loginName", value, "queryForm")
            } > < /Input> < /
            Form.Item > <
            Form.Item >
            <
            Button type = "primary"
            onClick = {
                () => this.onQuery(this.state.pageNumber)
            } > 查询 < /Button> < /
            Form.Item > <
            /Form>

            <
            div className = "button" >
            <
            Button type = "primary"
            className = "button"
            size = "small"
            onClick = {
                () => {
                    this.setState({
                        dialogAdd: true
                    })
                }
            } > 新增 <
            /Button> < /
            div >

            { /*表格*/ } <
            Table style = {
                {
                    width: '100%'
                }
            }
            columns = {
                this.state.columns
            }
            data = {
                this.state.data
            }
            highlightCurrentRow = {
                true
            }
            /> { / * 分页 * / } <
            div className = "last" >
            <
            div className = "block" >
            <
            Pagination layout = "prev, pager, next, jumper"
            total = {
                parseInt(this.state.total)
            }
            pageSize = {
                parseInt(this.state.pageSize)
            }
            currentPage = {
                0
            }
            onCurrentChange = {
                (currentPage) => {
                    currentPage = currentPage - 1;
                    this.setState({
                        currentPage
                    });
                    this.onQuery(currentPage);
                }
            }
            /> < /
            div > <
            /div>

            { /*新增*/ } <
            Dialog title = "新增"
            size = "tiny"
            visible = {
                this.state.dialogAdd
            }
            onCancel = {
                () => this.setState({
                    dialogAdd: false
                })
            } >
            <
            Dialog.Body >
            <
            Form ref = "addForm"
            model = {
                this.state.addForm
            }
            rules = {
                this.state.addRules
            }
            labelWidth = "80" >

            <
            DialogForm model = {
                this.state.addForm
            }
            name = "addForm"
            onChange = {
                this.onChange
            }
            inputChange = {
                this.inputChange
            }
            /> < /
            Form >

            <
            /Dialog.Body>

            <
            Dialog.Footer className = "dialog-footer" >
            <
            Button onClick = {
                () => this.onCancel(this.refs.addForm, 'dialogAdd')
            } > 取 消 < /Button> <
            Button type = "primary"
            onClick = {
                (e) =>
                //this.onSubmit(this.refs.addForm,this.state.addForm,'dialogAdd')
                this.onAdd(e)
            } > 确定 < /Button> < /
            Dialog.Footer > <
            /Dialog>

            { /*编辑*/ } <
            Dialog title = "编辑"
            size = 'tiny'
            visible = {
                this.state.dialogEdit
            }
            onCancel = {
                () => this.onCancel(this.refs.editForm, 'dialogEdit')
            } >
            <
            Dialog.Body >
            <
            Form ref = "editForm"
            rules = {
                this.state.editRules
            }
            model = {
                this.state.editForm
            }
            labelWidth = "80"
            inputWidth = "300" >
            <
            DialogForm model = {
                this.state.editForm
            }
            onChange = {
                this.onChange
            }
            name = "editForm"
            inputChange = {
                this.inputChange
            }
            /> <
            Form.Item label = '修改密码'
            prop = 'passwd' >
            <
            Input value = {
                this.state.editForm.passwd
            }
            placeholder = "如需修改密码请填写"
            onChange = {
                (value) => this.onChange("passwd", value, "editForm")
            }
            /> < /
            Form.Item > <
            /Form> < /
            Dialog.Body >

            <
            Dialog.Footer className = "dialog-footer" >
            <
            Button onClick = {
                () => {
                    this.onCancel(this.refs.editForm, 'dialogEdit');
                }
            } > 取 消 < /Button> <
            Button type = "primary"
            onClick = {
                (e) => {
                    this.onEdit(e);
                }
            } > 确 定 < /Button> < /
            Dialog.Footer > <
            /Dialog> < /
            div >

        )
    }

}

export default Admin;