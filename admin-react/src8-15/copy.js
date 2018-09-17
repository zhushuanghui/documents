{/*<Form.Item*/}
{/*label="状态"*/}
{/*prop="state">*/}
{/*<Select value={this.state.addForm.state}*/}
{/*onChange={(value) => this.onChange("state", value, "addForm")}>*/}
{/*<Select.Option label="暂停" value="0"></Select.Option>*/}
{/*<Select.Option label="启用" value="1"></Select.Option>*/}
{/*</Select>*/}
{/*</Form.Item>*/}
{/*{this.state.addForm.inputForm.map((item,index)=>(*/}
{/*<Form.Item*/}
{/*rules={inputRule(item)}*/}
{/*key={index}*/}
{/*label={item.name}*/}
{/*prop={item.prop}>*/}
{/*<Input onChange={(value) => this.inputChange(item.prop, value, "addForm")}*/}
{/*value={item[item.prop]}></Input>*/}
{/*</Form.Item>*/}
{/*))}*/}

//编辑
{/*<Form.Item*/}
{/*label="状态"*/}
{/*prop="state"*/}
{/*rules={stateRule(this.state.editForm.state)}*/}
{/*key="state">*/}
{/*<Select*/}
{/*value={this.state.editForm.state===undefined?'':this.state.editForm.state+''}*/}
{/*onChange={(value) => this.onChange("state", value, "addForm")}>*/}
{/*<Select.Option label="暂停" value="0"></Select.Option>*/}
{/*<Select.Option label="启用" value="1"></Select.Option>*/}
{/*</Select>*/}
{/*</Form.Item>*/}
{/*{this.state.editForm.inputForm.map((item,index)=>(*/}
{/*<Form.Item*/}
{/*rules={inputRule(item)}*/}
{/*key={index}*/}
{/*label={item.name}*/}
{/*prop={item.prop}>*/}
{/*<Input onChange={*/}
{/*(value) => this.inputChange(item.prop, value, "editForm")}*/}
{/*value={item[item.prop]}>*/}
{/*</Input>*/}
{/*</Form.Item>*/}
{/*))}*/}


//封装
let onAdd = (form,subForm,onSubmit) => {
    form.validate((valid) => {
        if (valid) {
            let obj=formatData(subForm.inputForm);
            obj={...obj,state:subForm.state};
            this.postData(obj);
            onSubmit();
            console.log('submit!');
        } else {
            console.log('error submit!');
            return false;
        }
    });
};






//添加
// onAdd = (e) => {
//     e.preventDefault();
//     this.refs.addForm.validate((valid) => {
//         if (valid) {
//             let obj=formatData(this.state.addForm.inputForm);
//             obj={...obj,state:this.state.addForm.state};
//             this.postData(obj);
//             this.setState({
//                 dialogAdd: false,
//             });
//             console.log('submit!');
//         } else {
//             console.log('error submit!');
//             return false;
//         }
//     });
// };



//编辑
// onEdit = (e) => {
//     e.preventDefault();
//     this.refs.editForm.validate((valid) => {
//         if (valid) {
//             if (valid) {
//                 let {state, id,inputForm } = this.state.editForm;
//                 let obj = formatData(inputForm);
//                 obj = {...obj, state,id};
//                 this.postData(obj);
//                 this.setState({
//                     dialogEdit: false,
//                 });
//                 console.log('submit!');
//             } else {
//                 console.log('error submit!');
//                 return false;
//             }
//         }
//     });
// };