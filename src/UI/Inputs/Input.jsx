import React,{useState} from "react";
import './Input.css'; 
const Input = (props)=>{
    const [isValidate, showIsValidate] = useState(true); 
    const [inputValue,setInputValue] = useState(props.value); 
    const inputStyle = {
        maxWidth: props.width, 
      }; 
    const onChangeInput = (event) =>{ 
        setInputValue(event.target.value) 
    }
    const onBlurInput = ()=>{ 
        if(inputValue.trim() !== ''){ 
            props.onChangeHandler(props.id, inputValue);
        }else{
            showIsValidate(false);
        }
    } 

    const errorShow = !isValidate ? 'input inputError' : 'input';
    return (
        <>
        <div className={errorShow} >   
            <input type={props.type} placeholder=" " onBlur={onBlurInput} onChange={onChangeInput} value={inputValue} style={inputStyle} disabled={props.disabled}></input> 
            <label htmlFor="UserInput" >{props.label}</label>    
        </div>
        </>
    )
} 
export default Input; 