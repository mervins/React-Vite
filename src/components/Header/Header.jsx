import {Fragment,useContext, useState} from 'react';
import classes from './Header.module.css';
import HeaderList from './HeaderList';
import Card from '../Card/Card';
import GlobalContext from '../../store/GlobalContext';
import HeaderAccountPopup from '../../Pages/User/HeaderAccountPopup';

const Header  = (props)=>{

    const {isLoggedIn,onLogout} = useContext(GlobalContext);
    const [showAccount,setShowAccount] = useState(false);

    const onlogoutHandler = ()=>{
        onLogout();
        setShowAccount(false)
    }

    return (
        <Fragment>
            <header className={classes.header}>
                <h2> IDLLE'S </h2>
                {isLoggedIn && <Card><HeaderList onTab={props.onTab}></HeaderList></Card>}
                {isLoggedIn && <div style={{cursor:"pointer"}} onClick={()=>{
                    setShowAccount(true)
                }}>Account</div>}
                {
                    showAccount && <HeaderAccountPopup onlogoutHandler={onlogoutHandler} hideClick={()=>{setShowAccount(false)}}/>
                }
            </header>
        </Fragment>
    )
}

export default Header;