import React, {Component} from 'react';
import axios from "./axios";
import {Select} from 'element-react';

class ChannelID extends Component {
    constructor() {
        super();
        this.state = {
            loginStatus: 0,
            options: [],
            value: '',
        }
    }

    componentWillMount() {
        this.getData();
    }

    getData = () => {
        axios.get('/channel/findAll')
            .then(res => {
                if (res) {
                    this.setState({options: res, loginStatus: 0});
                }
            })
            .catch(err => {
                console.log(err);
            })
    };

    onChange = (value) => {
        this.setState({value});
        this.props.handleChange && this.props.handleChange(value);
        this.props.addChange && this.props.addChange('channelId', value, 'addForm');
        this.props.deliverChange && this.props.deliverChange('selectCID', value, 'queryForm');
    };


    render() {
        const options = this.state.options;
        return (
                <Select value={this.state.value}
                        placeholder="请选择渠道名称"
                        clearable={true}

                        onChange={(value) => {
                            this.onChange(value)
                        }}>
                    {options.length > 0 ? options.map((el, index) => {
                            return <Select.Option
                                key={index}
                                label={el.channelName}
                                value={el.channelId}/>
                        })
                        : <Select.Option
                            value="暂无数据"
                            disabled={true}/>}

                </Select>
        )
    }
}

export default ChannelID;