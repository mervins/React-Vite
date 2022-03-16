import { Route, Redirect } from "react-router-dom"; 

const ProtectedRoute = (props) =>{ 
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if(!isLoggedIn){
        return <Redirect to="/login"/>;
    }

    return <Route {...props}/>
}

export default ProtectedRoute;
