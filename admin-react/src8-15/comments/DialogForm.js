import React, {Component} from 'react';
import {Form, Input, Select,} from 'element-react';
import {formatData, inputRule,stateRule} from "./common";
import ChannelID from './ChannelID';


function DialogForm(prop) {



    let {model, onChange, inputChange,name} = prop;
    let stateValue = model.state === undefined ? '' : model.state + '';
    return (
        <div>
            <Form.Item
                label="状态"
                prop="state"
                rules={stateRule('state')}
                key="state">
                <Select value={stateValue}
                        onChange={(value) => onChange("state", value, name)}>
                    <Select.Option label="暂停" value="0"></Select.Option>
                    <Select.Option label="启用" value="1"></Select.Option>
                </Select>
            </Form.Item>
            {model.role ? <Form.Item
                label="角色"
                prop="role"
                key="role">
                <Select value={model.role}
                        onChange={(value) => onChange("role", value, name)}>
                    <Select.Option label="下游" value="1"></Select.Option>
                    <Select.Option label="系统" value="2"></Select.Option>
                </Select>
            </Form.Item> : null}
            {(model.role === "1")&&(name==="addForm") ? (<Form.Item
                label="渠道"
                prop="channelId"
                key="channelId">
                <ChannelID
                    addChange={onChange}/>
            </Form.Item>) : null}
            {model.inputForm.map((item, index) => {
                return (<Form.Item
                    key={index}
                    label={item.name}
                    prop={item.prop}
                    rules={inputRule(item)}>
                    <Input
                        onChange={(value) => inputChange(item.prop, value, name)}
                        value={item[item.prop]}>
                    </Input>
                </Form.Item>)
            })}
        </div>
    )

}

export default DialogForm;

