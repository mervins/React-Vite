import React, {Fragment} from "react";
import classes from './HeaderList.module.css';
import { NavLink } from "react-router-dom";
const HeaderList = (props)=>{

    const selectTab = (type)=>{ 
        props.onTab('form',type)
    }
    return(
        <Fragment>
            <nav className={classes.nav}>
                <ul>
                    <li>
                        <NavLink activeClassName={classes.active} to="/Inventory"> Inventory </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName={classes.active} to="/Products"> Products </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName={classes.active} to="/Pickup"> Pick-up </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName={classes.active} to="/Distribute"> Distribute </NavLink>
                    </li>
                    {/* <li>
                        <NavLink activeClassName={classes.active} to="/Transactions"> Transactions </NavLink>
                    </li> */}
                    <li>
                        <NavLink activeClassName={classes.active} to="/Supplier">Supplier</NavLink>
                    </li>
                    <li>
                        {/* <div onClick={()=>{selectTab(1)}}>Customers</div> */}
                        <NavLink activeClassName={classes.active} to="/Customer"> Customers </NavLink>
                    </li>
                    {/* <li> 
                        <NavLink activeClassName={classes.active} to="/Aging"> Aging </NavLink>
                    </li> */}
                    <li>
                        {/* <div onClick={()=>{selectTab(2)}}>Tracks</div> */}
                        <NavLink activeClassName={classes.active} to="/Track"> Track </NavLink>
                    </li>
                    <li>
                        {/* <div onClick={()=>{selectTab(2)}}>Tracks</div> */}
                        <NavLink activeClassName={classes.active} to="/Report"> Report </NavLink>
                    </li>
                </ul>
            </nav>
        </Fragment>
    )
}

export default HeaderList;
