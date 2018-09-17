import React, {Component} from 'react';
import {Form, Button, Select, Table, Pagination, DateRangePicker, Input} from 'element-react';
import axios from './comments/axios';
import ChannelID from './comments/ChannelID';
import {formatDate, lableWidth} from "./comments/common";


class Deliver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginStatus: 0,
            total: 0,
            pageNumber: 0,
            pageSize: 10,
            queryForm: {
                selectDate: '',
                selectCID: '',
                selectSID: '',
            },
            data: [],
            columns: [
                {
                    type: 'index',
                    width: lableWidth.indexWidth,
                },
                {
                    label: "渠道号",
                    prop: "channelId",
                    sortable: true
                },
                {
                    label: "产品Id",
                    prop: "subChannelId",
                },
                {
                    label: "设备号",
                    prop: "appType",
                },

                {
                    label: "itunesID",
                    prop: "itunesId",
                },
                {
                    label: "bundleID",
                    prop: "bundleId",
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    width: 170,
                    sortable: true,
                    format: true
                }
            ]

        };
    }


//获取分页数据
    getData = (currentPage) => {
        axios.get(`/info/list?pageSize=${this.state.pageSize}&pageNumber=${currentPage}`).then(res => {
            let data = formatDate(res.rows);
            this.setState({total: res.total, data: [...data], loginStatus: 0})
        }).catch(error =>
            console.info(error)
        )
    };


    componentWillMount() {
        this.getData(this.state.pageNumber);
    }

    format = (date) => {
        let month = (date.getMonth() + 1) > 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
        let day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate();
        date = date.getFullYear() + '-' + month + '-' + day;
        return date
    };
    //查询数据
    queryData = (selectDate, selectCID, selectSID, pageNumber) => {
        let startDate = '',
            endDate = '';
        if (selectDate) {
            startDate = this.format(selectDate[0]);
            endDate = this.format(selectDate[1]);
        }
        axios.get(`/info/list?startDate=${startDate}&endDate=${endDate}&channelId=${selectCID}&subChannelId=${selectSID}&pageSize=${this.state.pageSize}&pageNumber=${pageNumber}`)
            .then(res => {
                this.setState({total: res.total, data: formatDate(res.rows), loginStatus: 0});
            })
    };

    //查询数据
    onQuery = () => {
        let {selectDate, selectCID, selectSID} = this.state.queryForm;
        if (selectDate || selectCID || selectSID) {
            this.queryData(selectDate, selectCID, selectSID, 0)
        } else {
            this.getData(this.state.pageNumber)
        }
    };

    onChange = (key, value, name) => {
        this.setState({
            [name]: {...this.state[name], [key]: value}
        });
    };


    render() {
        let pageNumber = 0;
        return (
            <div className="container">
                <Form
                    inline={true}
                    model={this.state.form}
                    className="demo-form-inline">
                    <Form.Item>
                        <ChannelID deliverChange={this.onChange}/>
                    </Form.Item>
                    <Form.Item>
                        <Input
                            value={this.state.queryForm.selectSID}
                            placeholder="产品id"
                            onChange={(value) =>
                                this.onChange('selectSID', value, 'queryForm')}
                        />
                    </Form.Item>
                    <Form.Item>
                        <div className="source">
                            <div className="block">
                                <DateRangePicker
                                    value={this.state.queryForm.selectDate}
                                    placeholder="选择日期范围"
                                    onChange={(value) => {
                                        this.onChange('selectDate', value, 'queryForm')
                                    }}
                                />
                            </div>
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"
                                onClick={() => this.onQuery()}
                        >查询</Button>
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
                        <Pagination
                            layout="prev, pager, next, jumper"
                            total={Number(this.state.total)}
                            pageSize={parseInt(this.state.pageSize)}
                            currentPage={0}
                            onCurrentChange={(currentPage) => {
                                pageNumber = currentPage - 1;

                                let {selectTime, selectCID, selectPID} = this.state.queryForm;
                                this.queryData(selectTime, selectCID, selectPID, pageNumber)
                            }}
                        />
                    </div>

                </div>
            </div>

        )
    }

}

export default Deliver;