import React from "react";
import classes from "./HeaderList.module.css";

const HeaderList = (props) =>{ 
    const header = props.header.map((item) =>{
        return (<div key={item.id}>
            <h4>{item.name}</h4>
        </div>)
    });
     
    return (
        <li className={classes.header}>
             {header}
        </li>
    )
}

export default HeaderList;