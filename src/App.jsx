import React, {Fragment, useState, useEffect} from "react";
import Header from "./components/Header/Header"; 
import Form from "./components/Form/Form";   
import Router from "./Routes/Routes";  
import {fetchSuppleirData} from "./store/store-redux/supplier/supplier-action";
import { useDispatch } from 'react-redux';
import classes from './App.module.css'; 


function App() {
  const [showForm, setShowForm] = useState(false);
  const [category,setCategory] = useState(0); 
  
  const dispatch = useDispatch();
  
  useEffect(()=>{
    dispatch(fetchSuppleirData());
},[dispatch])

  const selectTab = (selected,type)=>{
    setCategory(type)
      if(selected === 'form'){
        setShowForm(true)
      }else{
        setShowForm(false)
      }
  }

  return (
   <Fragment>
     {showForm && <Form onClose={selectTab} cat={category}></Form>}
     <Header onTab={selectTab}></Header>
     <hr></hr>
    <main className={classes.main}> 
        <Router></Router>  
      </main>
   </Fragment>
  );
}

export default App;
