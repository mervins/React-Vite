import React,{useState,useEffect} from "react";
import './Select.css';
 
const Select = (props) =>{
    const [selectValue,setSelectValue] = useState("");
    const [isValidate, showIsValidate] = useState(false); 
    const [item,setItem] = useState({})
    const errorShow = !isValidate ? 'input inputError' : 'input';
    
    useEffect(()=>{
        if(selectValue !== ''){    
            props.onSelectHandler(item);
        }else{
            showIsValidate(false);
        }
    },[selectValue,item])

    const selectedValue = (e)=>{   
        const id = e.target.options[e.target.selectedIndex].value;
        const item = props.items.filter(item => item.id === id); 
        console.log(props.items)
        setItem(item[0]);
        setSelectValue(id); 
        e.preventDefault();
    } 
    return (
        <>
            <div className={errorShow} >
                <select name={selectValue} onChange={(e)=>{selectedValue(e)}} value={selectValue|| ''}>
                    <option value={''} disabled={true}>Select Option</option>
                    {
                        props.items.map((item,index)=>{
                            return <option key={index} value={item.id}>{item.name || item.driver || item.description || item.Product.description}</option>
                        })
                    } 
                </select>
                <label htmlFor="UserInput" >{props.label}</label>
            </div>
        </>
    )
}

export default Select; 