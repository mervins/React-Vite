import React from "react";
import classes from './HeaderAccountPopup.module.css'; 
import { BiLogOut } from "react-icons/bi";
import Card from "../../components/Card/Card";
import { FiUser } from "react-icons/fi";
const HeaderAccountPopup = (props)=>{ 
    const {hideClick, onlogoutHandler} = props;
    const {name,type} = JSON.parse(localStorage.getItem('user')); 
     
    return (
        <>
            <div className={classes.container}>
                <div className={classes.headerpopupBg} onClick={()=>hideClick()}></div>
                    
                    <div className={classes.headerpopupcard} >
                    <div className={classes.headernameholder}>
                        <div className={classes.hnhinitletter}>
                        { name ? name[0] : "" }
                        </div>
                        <div class={classes.hnhfullname}>{name}</div>
                        <div className="position">{type}</div>
                        <div>Role</div>
                    </div>
                        <div className={classes.hpopupBtns}> 
                            <div>
                                <Card > 
                                    <div className={classes.btn}>
                                        <div className={classes.icon}><FiUser></FiUser></div>
                                        <div>Profile</div>
                                    </div>
                                </Card>
                            </div>
                            <br></br>
                            <div onClick={()=>{onlogoutHandler()}}>
                                <Card > 
                                    <div className={classes.btn}>
                                        <div className={classes.icon}><BiLogOut></BiLogOut></div>
                                        <div>Logout</div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    ) 
}

export default HeaderAccountPopup;