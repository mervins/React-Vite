import React, {useState,useEffect} from "react" 
import { useHistory } from "react-router";  
import useHttp from "../hook/use-http";

const global = {
    url_base:'http://127.0.0.1:3329',
    isLoggedIn:false,
    token:null,
    users:{},
    errorLogin:false,
    onLogout:() => {},
    onLogin: (username,password)=>{} 
}

const ProviderContext = React.createContext(global);

export const GlobalContext = (props)=>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken,setAccessToken] = useState();
    const [userInfo, setUserInfo] = useState();
    const [statusError,setStatusError] = useState(false)
    const history = useHistory(); 
    const {sendRequest} = useHttp();
    useEffect(()=>{
        const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');
        if (storedUserLoggedInInformation) {
            setIsLoggedIn(true);
        }else{ 
            setIsLoggedIn(false);
        }
        
    },[])

    const logoutHandler = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        history.push("/login");
        setIsLoggedIn(false);
        setAccessToken(null);
        setUserInfo({})
        
      };
    
      const loginHandler = (username,password) => {   
            const form = {username:username,password:password};    
            const formExport = {url:global.url_base+'/api/login', 
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            form,
            }; 
            sendRequest(formExport,loginData); 
      };

      const loginData = (data)=>{
          if(data.success){
            localStorage.setItem('isLoggedIn', true); 
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user))
            setIsLoggedIn(true); 
            setAccessToken(data.accessToken);
            setUserInfo(JSON.stringify(data.user));
            setStatusError(data.success)
            history.push("/Supplier")
          }
        
      } 

    return <ProviderContext.Provider value={
        {
            url_base:'http://127.0.0.1:3329',
            isLoggedIn:isLoggedIn,
            token:accessToken,
            users:userInfo,
            errorLogin:statusError,
            onLogout: logoutHandler,
            onLogin: loginHandler,
        
        }
    }>{props.children}</ProviderContext.Provider>
}

export default ProviderContext;