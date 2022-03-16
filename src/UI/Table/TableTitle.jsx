import React from "react";
import classes from "./TableTitle.module.css"
const TableTitle = (props)=>{
    return (
        <div className={classes.title}>
            {props.children}
        </div>
    )
}

export default TableTitle;