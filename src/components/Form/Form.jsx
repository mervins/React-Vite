import React,{Fragment,useState} from "react";
import Input from "../../UI/Inputs/Input";
import Modal from "../../UI/Modal/Modal";
import classes from "./Form.module.css"
import Button from "../../UI/Button/Button";
import FormName, {CATEGORY_NAME,CATEGORY_TYPE} from "../../variable/Variables.jsx";
import FormVariable from "../../variable/Form/FormVariable"; 
import { IoCloseCircleSharp } from "react-icons/io5";
 

const Form = (props)=>{  
    
    const [inputs,setInputs] = useState(FormName(CATEGORY_TYPE[props.cat],props.status,props.editItem));   
    const submitHandler= (event)=>{
        event.preventDefault();   
        if(filterEmpty(inputs).length > 0){
            alert('Empty') 
        }else{   
            props.addCustomer(FormVariable(CATEGORY_TYPE[props.cat],inputs))
            props.onClose('close');
            setInputs(setFilterNull(inputs));
        }
    }  
    const onChageInput = (id,value) =>{ 
        const existinItem = inputs.findIndex((item) => item.id === id);
        let updatedItems = inputs; 
        updatedItems[existinItem].value = value;  
        setInputs(updatedItems); 
    }
    const filterEmpty = (items)=>{
        return items.filter((item)=>{ return item.value.trim() === ''})
    }
    const setFilterNull = (items)=>{
        return items.map((item)=>{ return item.value = ''})
    }
    
    return (
        <Fragment>
            <Modal>
                <div className={classes.closeIcon} onClick={()=>{props.onClose(); setInputs(setFilterNull(inputs));}}><IoCloseCircleSharp/></div>
                <h2 className={classes.h2}>{props.status} {CATEGORY_NAME[props.cat]}</h2> 
                <div className={classes.line}></div>
                <form onSubmit={submitHandler} className={classes.form}>
                {
                    inputs.map(item=>{
                       return <Input key={item.id} label={item.label} id={item.id} type={item.type} value={item.value} onChangeHandler = {onChageInput}/>
                    })
                } 
                <hr></hr>
                <div>
                    <Button>Submit</Button>
                </div>
                </form>
            </Modal>
        </Fragment>
    )
}

export default Form;