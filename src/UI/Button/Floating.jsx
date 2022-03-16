import React from "react";
import classes from "./Floating.module.css";
import { ACTION } from "../../Pages/Customer/Cutomer";
const Floating = (props) =>{
    const showForm = ()=>{
        props.onClickFloat(ACTION.ACTION_ADD,null)
    }
    return (
        <div className={classes.float} onClick={showForm}>
            <div className={classes.my_float}>{props.children}</div>
        </div>
    )
}

export default Floating;