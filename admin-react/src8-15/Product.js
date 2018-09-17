import React, {Component} from 'react';
import {Form, Button, Input, Select, Table, Pagination, Dialog,Message} from 'element-react';
import axios from "axios/index";
import {formatData, formatDate, stateRule, inputRule, lableWidth} from './comments/common';
axios.defaults.headers={'X-Requested-With': 'XMLHttpRequest'};

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
                    width:lableWidth.indexWidth
                },
                {
                    label: "产品名称",
                    prop: "productName",
                    width:100,
                },
                {
                    label: "产品ID",
                    prop: "productId",
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
                    width:100
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    width:170,
                    sortable: true
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
                                     let {productName, priceUp, priceDown,state,productId,id} = row;
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
        }).catch(error => {
            console.info(error);
        })
    };

    //发送数据
    postData = (obj) => {
        axios.post('/product/save', obj).then(res => {
                this.getData(this.state.currentPage);
        }).catch(error => {
            console.log(error);
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
            let obj=formatData(this.state.editForm.inputForm);
            let {state,productId,id}=this.state.editForm;
            state=state===undefined?'':state+'';
            obj={...obj,state,productId,id};
            if(valid){
                this.postData(obj);
                this.setState({
                    dialogEdit: false,
                });
                console.log('submit!');
            }else {
                console.log('error submit! why?');
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
                            <Input placeholder="产品ID" prop="productId"
                                   onChange={(value) =>
                                       this.onChange("productId", value, "queryForm")}></Input>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="产品名称" prop='productName'
                                   onChange={(value) => this.onChange("productName", value, "queryForm")}></Input>
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
                                  labelWidth="120"
                            >
                                <Form.Item
                                    label="状态"
                                    prop="state">
                                    <Select value={this.state.addForm.state}
                                            onChange={(value) => this.onChange("state", value, "addForm")}>
                                        <Select.Option label="暂停" value="0"></Select.Option>
                                        <Select.Option label="启用" value="1"></Select.Option>
                                    </Select>
                                </Form.Item>

                                {this.state.addForm.inputForm.map
                                ((item,index)=>(
                                    <Form.Item
                                        rules={inputRule(item)}
                                        key={index}
                                        label={item.name}
                                        prop={item.prop}>
                                        <Input
                                            onChange={(value) => this.inputChange(item.prop, value, "addForm")}
                                               value={item[item.prop]}
                                            placeholder={(item.prop==='priceUp'||item.prop==='priceDown')?'单位/元':''}></Input>
                                    </Form.Item>

                                ))}
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

                                <Form.Item
                                    label="状态"
                                    prop="state"
                                    key="state"
                                    rules={stateRule( this.state.editForm.state)}
                                >
                                    <Select
                                        value={this.state.editForm.state===undefined?'':this.state.editForm.state+''}
                                            onChange={(value) => this.onChange("state", value, "editForm")}>
                                        <Select.Option label="暂停" value="0"></Select.Option>
                                        <Select.Option label="启用" value="1"></Select.Option>
                                    </Select>
                                </Form.Item>
                                {this.state.editForm.inputForm.map
                                ((item,index)=>(
                                    <Form.Item
                                        key={index}
                                        rules={inputRule(item)}
                                        label={item.name}
                                        prop={item.prop}>
                                        <Input onChange={(value) => this.inputChange(item.prop, value, "editForm")}
                                               value={item[item.prop]}></Input>
                                    </Form.Item>

                                ))}


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

export default Product;