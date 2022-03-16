
import { useState,useContext,useEffect, useRef } from "react";
import Card from "../../components/Card/Card";
import classes from "./FormPickup.module.css";
import Button from "../../UI/Button/Button";
import Select from "../../UI/Select/Select";
import GlobalContext from "../../store/GlobalContext";
import useHttp from "../../hook/use-http";
import { useSelector } from 'react-redux';
import List from "../../UI/List/List";
import HeaderList from "../../UI/List/HeaderList";
import Items from "../../UI/List/Items"; 
import { BiTrashAlt } from 'react-icons/bi';  

const HEADER = [{id:0,name:'Driver'},{id:2,name:'Supplier'},{id:3,name:'Product'},{id:4,name:'Price'},{id:5,name:'Qunatity'},{id:6,name:'Total'}];

const FormPickup = (props)=>{ 
    const [driver,setDriver] = useState();
    const [supplier,setSupplier] = useState({}); 
    const [productItems,setProductItems] = useState([]);   
    const [price,setPrice] = useState(0); 
    const [product,setProduct] = useState({})
    const [items,setItems] = useState([])
    const ctx = useContext(GlobalContext); 
    const {sendRequest} = useHttp();  
    const itemsSupplier = useSelector(state => state.supplier); 
    const [grandTotal,setGrandTotal] = useState(0)
    const refDate = useRef();
    const refQauntity = useRef();
    
    useEffect(()=>{
        sendRequest({url:ctx.url_base+`/api/product/${supplier.id || null}`},getProductItems);  
    },[supplier]);
    
    useEffect(()=>{
        let tempGrandTotal = 0;
        let total = items.map(item => tempGrandTotal = tempGrandTotal + item.total)
        setGrandTotal(tempGrandTotal);
    },[items])
    
    const getProductItems = (data)=>{
        setProductItems(data)
    }
    const getProduct = (data)=>{ 
        let prod = productItems.filter(item => item.id === data.id); 
        setPrice(prod[0].price);
        setProduct(data);
    }
    const getSupplier=(value)=>{  
        console.log(supplier)
        setSupplier(value)
    }
    const deleteItem = (itemDel) => {
        console.log(itemDel)
        setItems(state => state.filter((item,index) => index !== itemDel))
    }
    const submitPickUpHandler = (e)=>{
        e.preventDefault();  
            try{
                const tempItem = {
                    driver: driver.driver,
                    supplier: supplier.name, 
                    quantity: refQauntity.current.value,
                    price: price,
                    product: product.description,
                    prodId: product.id,
                    total: refQauntity.current.value * price
                }; 
                if(tempItem.prodId === undefined || tempItem.product === undefined
                    || tempItem.supplier === undefined || tempItem.quantity.trim() === ""
                    || refDate.current.value.trim() === ""){
                    props.showToast("danger",'Please check the form','Error')
                    return;
                }
                console.log(tempItem);
                setItems(state => [...state,tempItem]);  
            }catch(e){
                props.showToast("danger",'Please check the form','Error')
            }
    }
    const savePickUp = ()=>{
        if(items.length > 0){
            const form = {
                date:refDate.current.value,
                total:grandTotal,
                product:JSON.stringify(items)
            };
                const formSubmit = {url:ctx.url_base+'/api/addPickup', 
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                form,
                }; 
                sendRequest(formSubmit,pickUpResponse);
        }else{
            props.showToast("danger",'Please add items','Error')
        }  
        }
        
  
    const pickUpResponse = (data) =>{
        if(data.status === "ok"){ 
            props.addItem(data.item)
            props.showToast("info",'Successfully saved!','Success')
            console.log(data.item)  
            props.onClose(false);
        } 
        
    }
    let itemsPickUp = items.map((item,index)=>{
        return (<Items key={index}>
                    <div key="0">
                         <h5>{item.driver}</h5>
                    </div> 
                    <div key="3">
                        <h5>{item.supplier}</h5>
                    </div>
                    <div key="4">
                        <h5>{item.product}</h5>
                    </div>
                    <div key="5">
                        <h5>{item.price}</h5>
                    </div>
                    <div key="6">
                        <h5>{item.quantity}</h5>
                    </div>
                    <div key="7">
                        <h5>{item.total}</h5>
                    </div>
                    <div key="8" className={classes.cust}>
                        {/* <button onClick={()=>{selectTab(ACTION.ACTION_EDIT,item)}} ><Card><BiEdit/></Card></button> */}
                        <button onClick={()=>{deleteItem(index)}}><Card><BiTrashAlt/></Card></button>
                    </div> 
                </Items>);
    }) 
  
    return (
        <> 
            <form onSubmit={submitPickUpHandler}>
                <div className={classes.form}> 
                        <Card>
                            <Select id="1" label="Driver" items={props.track} onSelectHandler={(value)=>{setDriver(value)}}></Select>
                            <Select id="2" label="Supplier" items={itemsSupplier.items} onSelectHandler={getSupplier}></Select>    
                            <div className={classes.input} >   
                                <input type="date" ref={refDate}></input> 
                                <label htmlFor="Date" >Date</label>    
                            </div>
                        </Card> 
                        <Card className={classes.product}>
                            <Select id="4" label="Product" items={productItems} onSelectHandler={getProduct}></Select>
                            <div className={classes.input} >   
                                <input type="number"  ref={refQauntity}></input> 
                                <label htmlFor="Quantity" >Quantity</label>    
                            </div>
                            <div className={classes.input} >   
                                <input type="number"  value={price} disabled={true}></input> 
                                <label htmlFor="Price" >Price</label>    
                            </div>
                            <Button>Add Product</Button>
                        </Card>  
                </div> 
            </form> 
            <List>
                <div className={classes.total}>
                    <div onClick={savePickUp}>
                        <Button>Submit</Button></div><h1>Grand Total: ₱{grandTotal}</h1>
                    </div>
                <ul>
                    <HeaderList header={HEADER}></HeaderList>
                    {itemsPickUp}
                </ul>
            </List>
        </>
    )
}

export default FormPickup;