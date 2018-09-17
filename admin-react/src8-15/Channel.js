import React, {Component} from 'react';
import {Form, Button, Input, Select, Table, Pagination, Dialog, Message} from 'element-react';
 import axios from "./comments/axios";
 //import InputForm from './common/InputForm';
import {formatData,stateRule,lableWidth,onAdd,formatDate} from "./comments/common";
 import DialogForm from "./comments/DialogForm";


class Channel extends Component {
    constructor() {
        super();
        this.state = {
            total: 0,
            loginStatus: 0,
            data: [],
            dialogEdit: false,
            dialogAdd: false,
            currentPage:0,
            pageNumber: 0,
            pageSize: 10,
            addForm: {
                state: '0',
                inputForm:[
                    {
                        prop:'channelName',
                        name:'渠道名称',
                        channelName:''
                    },
                    {
                        prop:'countN',
                        name:'被调次数',
                        countN:''
                    },
                    {
                        prop:'countM',
                        name:'主调次数',
                        countM:''
                    },
                   ]

            },
            editForm: {
                state: '',
                channelId: '',
                inputForm:[
                    {
                        prop:'countN',
                        name:'被调次数',
                        countN:''
                    },
                    {
                        prop:'countM',
                        name:'主调次数',
                        countM:''
                    },
                    {
                        prop:'channelName',
                        name:'渠道名称',
                        channelName:''
                    }]
            },
            queryForm: {channelId: '', channelName: ''},
            addRules: {
                state: [
                    {required: true, message: '请选择状态码', trigger: 'blur'}
                ]
            },
            columns: [
                {
                    type: 'index',
                    width:lableWidth.indexWidth
                },

                {
                    label: "渠道ID",
                    prop: "channelId",
                },
                {
                    label: "渠道名称",
                    prop: "channelName",

                },
                {
                    label: "主调次数",
                    prop: "countM",
                    sortable: true
                },
                {
                    label: "被调次数",
                    prop: "countN",
                    sortable: true
                },
                {
                    label: "状态",
                    prop: "state",
                    width: 100
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
                                                let {countM, countN, channelName, state, id} = row;
                                                state=state==='启用'?"1":"0";
                                                this.setState({
                                                    dialogEdit: true,
                                                    editForm:{
                                                        state:state,
                                                        id: id,
                                                        inputForm:[
                                                            {
                                                                prop:'channelName',
                                                                name:'渠道名称',
                                                                channelName:channelName
                                                            },
                                                            {
                                                                prop:'countN',
                                                                name:'被调次数',
                                                                countN:countN
                                                            },
                                                            {
                                                                prop:'countM',
                                                                name:'主调次数',
                                                                countM:countM
                                                            }
                                                        ]
                                                    }

                                                })
                                            }}>编辑</Button>
                                </span>
                        )
                    }
                }
            ]
        };
    }

    getData = (currentPage) => {
        currentPage = currentPage || 0;
        axios.get(`/channel/list?pageSize=${this.state.pageSize}&pageNumber=${currentPage}`).then(res => {
            this.setState({total: res.total, data: formatDate(res.rows)});
        }).catch(error => {
            console.log(error);
        })
    };

    //发送数据
    postData = (obj) => {
        axios.post('/channel/save', obj).then(res => {
                this.getData(this.state.currentPage);
        }).catch(error => {
            console.log(error);
        })
    };

    componentWillMount() {
        this.getData();
    }

    //边个变更
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


    onCancel=(form,dialog)=>{
        form.resetFields();
        this.setState({[dialog]:false});
    };

    onSubmit=(form,subForm,dialog) => {
        form.validate((valid) => {
            if (valid) {
                let {state, id,inputForm } = subForm;
                let obj=formatData(inputForm);
                if(dialog==='addDialog'){
                    obj={...obj,state};
                }else{
                    obj={...obj,state,id};
                }
                this.postData(obj);
               this.setState({[dialog]:false});
                console.log('submit! ');
            } else {
                console.log('error submit!');
                return false;
            }
        });
    };


    onQuery = (pageNumber) => {
        let {channelId, channelName} = this.state.queryForm;
        if (channelId || channelName) {
            axios.get(`/channel/list?channelId=${channelId}&channelName=${channelName}&pageSize=${this.state.pageSize}&pageNumber=${pageNumber}`)
                .then(res => {
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
                        <Input placeholder="渠道ID" prop="channelId"
                               onChange={(value) => this.onChange("channelId", value, "queryForm")}></Input>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="渠道名称" prop='channelName'
                               onChange={(value) => this.onChange("channelName", value, "queryForm")}></Input>
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
                                        // this.setState({pageNumber: currentPage});
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
                    onCancel={() => this.onCancel(this.refs.addForm,'dialogAdd')}>
                    <Dialog.Body>
                        <Form ref="addForm"
                              model={this.state.addForm}
                              rules={stateRule(this.state.addForm.state)}
                              labelWidth="120"
                        >
                            <DialogForm
                                model={this.state.addForm}
                                name="addForm"
                                onChange={this.onChange}
                                inputChange={this.inputChange}
                            />
                        </Form>

                    </Dialog.Body>

                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() =>this.onCancel(this.refs.addForm,'dialogAdd')}>
                            取 消</Button>
                        <Button type="primary"
                                onClick={() =>
                            this.onSubmit(this.refs.addForm,this.state.addForm,'dialogAdd')
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
                              model={this.state.editForm}
                              labelWidth="120"
                              inputWidth="300">

                            <DialogForm
                                model={this.state.editForm}
                                onChange={this.onChange}
                                name="editForm"
                                inputChange={this.inputChange}
                            />
                        </Form>
                    </Dialog.Body>

                    <Dialog.Footer className="dialog-footer">
                        <Button
                            onClick={() => {
                                this.onCancel(this.refs.editForm,'dialogEdit');
                        }
                        }>取 消</Button>
                        <Button
                            type="primary"
                            onClick={() => {
                           this.onSubmit(this.refs.editForm,this.state.editForm,'dialogEdit')
                        }}>确 定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>

        )
    }

}

export default Channel;