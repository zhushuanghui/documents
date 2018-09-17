import React, {Component} from 'react';
import {Form, Button, Input,  Table, Pagination, Dialog} from 'element-react';
import axios from "./common/axios";
import {formatDate, lableWidth} from './common/common';

class ProductDown extends Component {

    constructor() {
        super();
        this.state = {
            total: 0,
            loginStatus:0,
            data: [],
            currentPage:0,
            pageNumber: 0,
            pageSize: 10,
            queryForm: {productId:'', productName: ''},
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
                    label: "下游结算/元",
                    prop: "priceDown",
                },
                {
                    label: "状态",
                    prop: "state",
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
            </div>
        )
    }

}

export default ProductDown;