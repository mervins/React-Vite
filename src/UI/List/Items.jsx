import React from "react";
import classes from "./Items.module.css";

const Items = (props) =>{
    return (
        <li className={classes.item}>
           {props.children}
        </li>
    )
}

export default Items;