import React, { Fragment,useReducer,useRef } from "react";
import classes from './FormProduct.module.css';
import Input from "../../UI/Inputs/Input";
import FormName,{CATEGORY_TYPE} from "../../variable/Variables";
import Button from "../../UI/Button/Button";
import FormVariable from "../../variable/Form/FormVariable";  
import { IoCloseCircleSharp } from "react-icons/io5";
export const ACTION = {
    ACTION_ADD:'Add',
    ACTION_EDIT:'Edit',
    ACTION_REMOVE:'Remove'
}

const stateInput = (state,action)=>{ 
        switch (action.type){
            case ACTION.ACTION_ADD: 
                let items = action.data.map((item)=>{ return item.value=''});  
                return items;
            case "onChange":
                const existinItem = state.findIndex((item) => item.id === action.data.id);
                let updatedItems = state; 
                updatedItems[existinItem].value = action.data.value; 
                return updatedItems; 
            default:
                return state;
        }
}
 
const FormProduct = (props) =>{ 
    const [inputs,dispatchInput] = useReducer(stateInput,FormName(CATEGORY_TYPE[3],props.status,props.editProd));  
    const formRef = useRef() ;  
    const onChageInput = (id,value) =>{   
        dispatchInput({type:"onChange",data:{id:id,value:value}})//value of data is object
    }
    const submitHandler= (event)=>{
        event.preventDefault();   
        if(filterEmpty(inputs).length > 0){
            alert('Empty') 
        }else{   
            if(props.status === 'Add'){
                props.addProducts(FormVariable(CATEGORY_TYPE[3],inputs));  
                dispatchInput({type:ACTION.ACTION_ADD,data:[...inputs]})//value of data is array 
            }else{
                props.updateProducts(FormVariable(CATEGORY_TYPE[3],inputs));
                dispatchInput({type:ACTION.ACTION_ADD,data:[...inputs]})//value of data is array 
            }   
            
                
        }
    } 
    const filterEmpty = (items)=>{
        return items.filter((item)=>{ return item.value.trim() === ''})
    } 
    const setFilterNull = ()=>{ 
        [...formRef.current.querySelectorAll('input')].forEach((input)=>{
            input.value = '';
        })  
    }
   
    let inputItem =
            inputs.map((item,index)=>{
               return <Input key={index} label={item.label} id={item.id} type={item.type} value={item.value} onChangeHandler = {onChageInput}/>
           }) 
    return(
        <Fragment>  
            <div className={classes.closeIcon} onClick={()=>{ dispatchInput({type:ACTION.ACTION_ADD,data:[...inputs]}); props.closeFormInput()}}><IoCloseCircleSharp/></div>
            {/* <Card> */}
                <h2 className={classes.h2}>{props.status === 'Add' ? 'Add' : 'Edit'} Products</h2> 
                <div className={classes.line}></div> 
                <form className={classes.form} onSubmit={submitHandler} ref={formRef}> 
                    {inputItem}
                <div className={classes.btn}>
                    <Button>{props.status === 'Add' ? 'Add' : 'Update'} Product</Button>
                </div>
                </form> 
            {/* </Card> */}
        </Fragment>
    )
}

export default FormProduct;