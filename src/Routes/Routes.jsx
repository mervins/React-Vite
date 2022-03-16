import React from "react";
import { Route,Switch, BrowserRouter as MainRouter, Redirect } from "react-router-dom";  
import Customer from "../Pages/Customer/Cutomer"; 
import Supplier from "../Pages/Supplier/Supplier"; 
import Track from "../Pages/Track/Track"; 
import Products from "../Pages/Products/Products";
import Inventory from "../Pages/Inventory/Inventory";
import Pickup from "../Pages/Pickup/Pickup";
import AuthPage from "../Pages/Auth/Auth";
import ProtectedRoute from "./ProtectedRoute";
import Distribute from "../Pages/Distribute/Distribute";

const Router = () =>{
    return (
        <>
            <Switch>
                <Route path="/login">
                    <AuthPage></AuthPage>
                </Route>
                {/* <ProtectedRoute path="/">
                    <Redirect push to="/Inventory">
                    </Redirect>
                </ProtectedRoute> */}
                <ProtectedRoute path="/Customer">
                    <Customer></Customer>
                </ProtectedRoute>
                <ProtectedRoute path="/Track">
                    <Track></Track>
                </ProtectedRoute>
                <ProtectedRoute path="/Supplier" component={Supplier}>
                    {/* <Supplier></Supplier> */}
                </ProtectedRoute>
                <ProtectedRoute path="/Products">
                    <Products></Products> 
                </ProtectedRoute>
                <ProtectedRoute path="/Inventory">
                    <Inventory></Inventory> 
                </ProtectedRoute>
                <ProtectedRoute path="/Pickup">
                    <Pickup></Pickup> 
                </ProtectedRoute>
                <ProtectedRoute path="/Distribute" component={Distribute} />
                <Redirect to="/Inventory"/>
            </Switch> 
        </>
    )
}

export default Router;
