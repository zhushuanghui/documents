import React, {Component} from 'react';
import {Form, Button, Input,  Table, Pagination, Dialog} from 'element-react';
import axios from "./common/axios";
import DialogForm from './common/DialogForm';
import {formatData, formatDate, lableWidth} from './common/common';

class Product extends Component {

    constructor() {
        super();
        this.state = {
            total: 0,
            loginStatus:0,
            data: [],
            dialogEdit: false,
            dialogAdd: false,
            currentPage:0,
            pageNumber: 0,
            pageSize: 10,
            addForm: {
                state: '0',
                inputForm: [
                    {
                        prop: 'productId',
                        name: '产品ID',
                        productId: '',
                    },
                    {
                        prop: 'bundleId',
                        name: '产品bundleId',
                        bundleId:'',
                    },
                    {
                        prop: 'productName',
                        name: '产品名称',
                        productName: '',
                    },
                    {
                        prop: 'priceUp',
                        name: '上游结算',
                        priceUp: '',
                    },
                    {
                        prop: 'priceDown',
                        name: '下游结算',
                        priceDown: '',
                    }
                ]
            },
            editForm: {
                state: '',
                inputForm: [
                    {
                        prop: 'productName',
                        name: '产品名称',
                        productName: '',
                    },
                    {
                        prop: 'bundleId',
                        name: '产品bundleId',
                        bundleId:  '',
                    },
                    {
                        prop: 'priceUp',
                        name: '上游结算',
                        priceUp: '',
                    },
                    {
                        prop: 'priceDown',
                        name: '下游结算',
                        priceDown: '',
                    }
                ]
            },
            queryForm: {productId:'', productName: ''},
            addRules: {
                state: [
                    {required: true, message: '请选择状态码', trigger: 'blur'}
                ]
            },
            columns: [
                {
                    type: 'index',
                    width:70
                },
                {
                    label: "产品名称",
                    prop: "productName",
                },
                {
                    label: "产品ID",
                    prop: "productId",
                },
                {
                    label: '产品bundleId',
                    prop: 'bundleId'

                },
                {
                    label: "上游结算/元",
                    prop: "priceUp",
                },
                {
                    label: "下游结算/元",
                    prop: "priceDown",
                },
                {
                    label: "状态",
                    prop: "state",
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
                                     let {productName, bundleId,priceUp, priceDown,state,productId,id} = row;
                                         state=state==='启用'?"1":"0";
                                      this.setState({
                                          dialogEdit:true,
                                          editForm: {
                                              state:state,
                                              id:id,
                                              productId:productId,
                                              inputForm: [
                                                  {
                                                      prop: 'productName',
                                                      name: '产品名称',
                                                      productName:productName ,
                                                  },
                                                  {
                                                      prop: 'bundleId',
                                                      name: '产品bundleId',
                                                      bundleId:  bundleId,
                                                  },
                                                  {
                                                      prop: 'priceUp',
                                                      name: '上游结算',
                                                      priceUp: priceUp,
                                                  },

                                                  {
                                                      prop: 'priceDown',
                                                      name: '下游结算',
                                                      priceDown: priceDown,
                                                  }
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
        axios.get(`/product/list?pageSize=${this.state.pageSize}&pageNumber=${currentPage}`).then(res => {
            this.setState({total: res.total,loginStatus: 0,data:formatDate(res.rows)})
        })
    };

    //发送数据
    postData = (obj) => {
        axios.post('/product/save', obj).then(res => {
                this.getData(this.state.currentPage);
        })
    };

    componentWillMount() {
        this.getData()
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

    //添加
    onAdd = (e) => {
        e.preventDefault();
        this.refs.addForm.validate((valid) => {
            if (valid) {
               let obj=formatData(this.state.addForm.inputForm);
               obj={...obj,state:this.state.addForm.state};
                this.postData(obj);
                this.setState({
                    dialogAdd: false,
                });
            } else {
                return false;
            }
        });
    };

    onCancel=(form,dialog)=>{
        form.resetFields();
        this.setState({[dialog]:false});
    };
    //编辑
    onEdit = (e) => {
        e.preventDefault();

        this.refs.editForm.validate((valid) => {
            let obj=formatData(this.state.editForm.inputForm);
            let {state,productId,id}=this.state.editForm;
            state=state===undefined?'':state+'';
            obj={...obj,state,productId,id};
            if(valid){
                this.postData(obj);
                this.setState({
                    dialogEdit: false,
                });
            }else {
                return false;
            }
        }) ;
    };


    onQuery = (pageNumber) => {
        let {productId, productName} = this.state.queryForm;
        if (productId ||productName) {
            axios.get(`/product/list?productId=${productId}&productName=${productName}&pageSize=${this.state.pageSize}
            &pageNumber=${pageNumber}`).then(res => {
                this.setState({total: res.total, data: formatDate(res.rows)})
            })
        } else {
            this.getData(pageNumber);
        }

    };

    render() {
       // let style=admin.role==="2"?null:{display:"none"};
        return (
                <div className="container">
                    <Form inline={true} model={this.state.queryForm} className="demo-form-inline">
                        <Form.Item>
                            <Input placeholder="产品ID" prop="productId"
                                   onChange={(value) =>
                                    this.onChange("productId", value, "queryForm")}>
                            </Input>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="产品名称" prop='productName'
                                   onChange={(value) => this.onChange("productName", value, "queryForm")}>
                            </Input>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary"
                                    onClick={() => this.onQuery(this.state.pageNumber)}>查询</Button>
                        </Form.Item>
                    </Form>

                    <div className="button">
                        <Button type="primary"
                                className="button"
                                size="small"
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
                            <Button onClick={() => {
                                this.onCancel(this.refs.editForm,'dialogEdit')
                            }
                            }>取 消</Button>
                            <Button type="primary"
                                    onClick={(e) => {
                                this.onEdit(e);
                            }}>确 定</Button>
                        </Dialog.Footer>
                    </Dialog>
                </div>
        )
    }

}

export default Product;