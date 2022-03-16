import { useRef,useContext } from 'react';
import classes from './Auth.module.css';
import GlobalContext from '../../store/GlobalContext';

const AuthPage = ()=>{
  
    const refUsername = useRef();
    const refPassword = useRef();
    const ctx = useContext(GlobalContext) 
  
  
  
    const submitHandler = (e)=>{
        e.preventDefault();
        const username = refUsername.current.value;
        const password = refPassword.current.value; 
        ctx.onLogin(username,password)    
    }
  
    return (
      <section className={classes.auth}>
        <h1>Login</h1>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor='text'>Your Email</label>
            <input type='text' id='email' required  ref={refUsername}/>
          </div>
          <div className={classes.control}>
            <label htmlFor='password'>Your Password</label>
            <input type='password' id='password' required ref={refPassword}/>
          </div>
          <div className={classes.actions}>
            <button>{'Login'}</button> 
          </div>
        </form>
      </section>
    );
  };

  export default AuthPage;