import React,{Fragment} from "react";
import Card from "../../components/Card/Card";
import classes from "./List.module.css";
const List = (props)=>{
    return(
        <Fragment>
            <section className={classes.list}>
                <Card>
                   {props.children}
                </Card>
            </section>
        </Fragment>
    )
}

export default List;