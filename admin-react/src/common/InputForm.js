
import React from 'react'
import {Form, Input} from 'element-react';
import {addInput} from "./common";
import {addRules, formatData,editInput,inputRules} from "./common/common";

let  InputForm=(props)=> {
    console.log(props);
    if(this.props.inputForm) return;
    let {inputForm,inputChange}=props;

   return  (
       <div>
           inputForm.map((item,index)=>(
           <Form.Item
               rules={inputRules(item)}
               key={index}
               label={item.name}
               prop={item.prop}>
               <Input onChange={(value) => inputChange(item.prop, value, "addForm")}
                      value={item[item.prop]}></Input>

           </Form.Item>
       </div>
   )
}



export default InputForm;