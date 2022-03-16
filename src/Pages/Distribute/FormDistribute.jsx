import Card from "../../components/Card/Card";
import classes from "./FormDistribute.module.css";
import Select from "../../UI/Select/Select";
import { useState,useRef,useEffect,useContext } from "react";
import Button from "../../UI/Button/Button";
import useHttp from "../../hook/use-http";
import GlobalContext from "../../store/GlobalContext";
import Modal from "../../UI/Modal/Modal";
import { IoCloseCircleSharp } from "react-icons/io5";

const HEADER = [{id:0,name:'Product'},{id:1,name:'Price'},{id:2,name:'Quantity'},{id:3,name:'Total'},{id:4,name:'Action'}]; 
const REMARKS_DP = [{id:'0',name:"Cash"}, {id:'1', name:"Check"}];

const FormDistribute = (props)=>{ 
    const [order,setOrder] = useState([])
    const [itemProduct,setItemProduct] = useState({})
    const quantity = useRef(0);
    const [price,setPrice] = useState(0);
    const {customer,track} = props;
    const [inventoryDisplay,setInvetoryDisplay] = useState(props.inventory)
    const [grandTotal,setGrandTotal] = useState(0);
    const [balance, setBalance] = useState(0);
    const [amountReceive,setAmountReceive] = useState(0);
    const [driver,setDriver] = useState();
    const [customerSelect,setCustomer]= useState();
    const [stock,setStock] = useState(0); 
    const [showAddForm,setShowAddForm] = useState(false);
    const remarks = useRef({
        status:null,
        date:null, 
    });
    const transaction = useRef({
        date:null, 
    })
    const ctx = useContext(GlobalContext);
    const {sendRequest} = useHttp();  
     
    useEffect(()=>{
        let tempGrandTotal = 0;
        let total = order.map(item => tempGrandTotal = tempGrandTotal + item.total)
        setGrandTotal(tempGrandTotal); 
    },[order])

    useEffect(()=>{
        let bal = grandTotal - amountReceive;
        setBalance(bal)
    },[amountReceive])
 
    
    const addProduct = (e)=>{
        e.preventDefault();

        if(Object.keys(itemProduct).length === 0 || quantity.current.value.trim() === ''){
            props.showToast("danger",'Fill in the form','Error')
            return;
        }else if (stock < quantity.current.value || stock <= 0){
            props.showToast("danger",'Insufficient storage','Error')
            return 
        }
        const subTotal = quantity.current.value * price;  
        setInvetoryDisplay((state) => state.map((item)=> {//update stock inventory 
              if(item.id === itemProduct.id){
                setStock(item.stock - parseInt(quantity.current.value))
                return {...item, stock: item.stock - parseInt(quantity.current.value)}
              }else{
                  return {...item}
              } 
          })  
        )
        setItemProduct((state)=> {return {...state, stock:stock}});//update stock
        const item = {...itemProduct,stock:stock, sold:quantity.current.value, total: subTotal}
        console.log(item);
        setOrder(state => [item, ...state]);   
        
    } 
    const getProduct = (item)=>{  
        setItemProduct(item);
        setPrice(item.Product.sellingprice);
        setStock(item.stock)
    }
    const removeOrder = (delItem,delIndex)=>{  
        setInvetoryDisplay((state) => state.map((item)=> {//update stock inventory 
            if(item.id === delItem.id){ 
            setStock(item.stock + parseInt(delItem.sold))
            return {...item, stock: item.stock + parseInt(delItem.sold)} 
            }else{
                return {...item}
            } 
        })  
      ) 
        setOrder(state => state.filter((item,index) => index !== delIndex))
    }

    const getRemarks = (item)=>{
        remarks.current.status = item.name
    } 
    const getDriver = (item)=>{
        console.log(item)
        setDriver(item)
    }
    const getCustomer = (item) => {
        console.log(item)
        setCustomer(item)
    }
    
    const submitDeliver = (e)=>{
        e.preventDefault();  
        if(items.length > 0){ 
                console.log(remarks.current.status)
                if(driver === undefined || customer === undefined || transaction.current.date === null || remarks.current.status === null){
                    props.showToast("danger",'Please fill in','Error')
                    return;
                } 
                let bal = grandTotal - amountReceive;
                setBalance(bal)
                setShowAddForm(true)  
        }else{
            props.showToast("danger",'Please add items','Error')
        }   
    }

    const saveDelivery = ()=>{ 
        const form = {
            driver:JSON.stringify(driver),
            customer:JSON.stringify(customerSelect),
            date:transaction.current.date,
            payment:JSON.stringify({
                remarks: remarks.current.status,
                date: remarks.current.date,
                amountReceive:amountReceive,
                balance:balance,

            }),
            products:JSON.stringify(order), 
            total:grandTotal,
            customerId:customerSelect.id
        }
            const formSubmit = {url:ctx.url_base+'/api/addDistribute', 
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                form,
                }; 
                sendRequest(formSubmit,(data)=>{
                    props.showToast("success",'Successfully dilivered','Success')  
                    props.updateInventory(inventoryDisplay,data)
                    setShowAddForm(true);
                });
               
                // console.log(form)
    }

    const items = order.map((item,index)=>{
        return(
            <props.Items key={index}>
                <div>
                    <h5>{item.Product.description}</h5>
                </div> 
                <div>
                    <h5>{item.Product.sellingprice}</h5>
                </div>
                <div>
                    <h5>{item.sold}</h5>
                </div>
                <div>
                    <h5>{item.total}</h5>
                </div>
                <div className={classes.cust}>
                    <button onClick={()=>{removeOrder(item,index)}}><Card><props.BiTrashAlt/></Card></button>
                </div>
            </props.Items>
        )
    })

    return(
        <>
            {showAddForm &&
                <Modal zIndex={30}> 
                    <div>
                    <div className={classes.closeIcon} onClick={()=>{setShowAddForm(false)}}><IoCloseCircleSharp/></div>
                    <h2 className={classes.h2}>Summary</h2> 
                    <div className={classes.line}></div> 
                    <br></br>
                    <Card>
                        <h4>Grand Total: {grandTotal}</h4>
                        <h4>Date Transaction: {transaction.current.date}</h4>
                        <h4>Customer: {customerSelect.name}</h4>
                        <h4>Provider: {driver.driver}</h4>
                        <h4>Remarks: {remarks.current.status}</h4>
                        <h4>Post Date: {remarks.current.date || new Date().toISOString().slice(0, 10)}</h4>
                        <h4>Amount Recive:{amountReceive}</h4>
                        <h4>Balance:{balance}</h4>
                        <div className={classes.btnGrp}>
                            <div onClick={()=>{setShowAddForm(false)}}><Button>Cancel</Button></div>
                            <div onClick={saveDelivery}><Button>Save</Button></div>
                        </div>
                    </Card> 
                    </div>
                </Modal>
            }
           <div className={classes.container}>
               <div className={classes.card1}>
                    <Card>
                       <form onSubmit={addProduct}>
                            <div className={classes.product}>
                                <div>
                                    <Select id="2" label="Products" 
                                        items={inventoryDisplay} 
                                        onSelectHandler={getProduct}
                                        >
                                    </Select>  
                                </div>
                                <div className={classes.input} >   
                                    <input type="number"  value={stock} disabled={true}></input> 
                                    <label htmlFor="Stock" >Stock</label>    
                                </div> 
                                <div className={classes.input} >   
                                    <input type="number"  value={price} disabled={true}></input> 
                                    <label htmlFor="Price" >Price</label>    
                                </div> 
                                <div className={classes.input} >   
                                    <input type="number" ref={quantity} min="0"></input> 
                                    <label htmlFor="Quantity" >Quantity</label>    
                                </div> 
                            </div>
                            <div className={classes.btn}>
                                <Button>Add to Cart</Button>
                            </div>
                       </form>
                    </Card>
                    <Card>
                        <div>
                            <ul>
                            {<props.HeaderList header={HEADER}/>}
                            {items}
                            </ul>

                        </div>
                    </Card>
               </div>
               <div className={classes.card2}>
                   <Card>
                       <Card>
                          <h2>Grand Total: ₱ {grandTotal}.00</h2> 
                       </Card>
                        <form onSubmit={submitDeliver}>
                            <div>
                                <Card>
                                    <div className={classes.input} >   
                                        <input type="date" onChange={(e)=>{transaction.current.date = e.target.value}}></input> 
                                        <label htmlFor="Date" >Date</label>    
                                    </div> 
                                    <div>
                                        <Select id="3" label="Driver" 
                                            items={track} 
                                            onSelectHandler={getDriver}
                                            >
                                        </Select>  
                                    </div> 
                                    <div>
                                        <Select id="4" label="Customer" 
                                            items={customer} 
                                            onSelectHandler={getCustomer}
                                            >
                                        </Select>  
                                    </div> 
                                </Card>
                            </div>
                            <br></br>
                            <div>
                                <Card> 
                                    <Select id="5" label="Remarks" 
                                        items={REMARKS_DP} 
                                        onSelectHandler={getRemarks}
                                        >
                                    </Select>
                                    <div className={classes.input} >   
                                        <input type="date"  onChange={(e)=>{remarks.current.date = e.target.value}}></input> 
                                        <label htmlFor="On Date/Post Date" >On Date/Post Date</label>    
                                    </div>
                                    <div className={classes.input} >   
                                        <input type="number" value={amountReceive} onChange={(e)=>{
                                            if(e.target.value > grandTotal || e.target.value < 0){
                                                setAmountReceive(grandTotal)
                                            }else{
                                                setAmountReceive(e.target.value)
                                            }
                                            }}></input> 
                                        <label htmlFor="Quantity" >Amount Receive</label>    
                                    </div>
                                    <div className={classes.input} >   
                                        <input type="number"  disabled={true} value={balance}></input> 
                                        <label htmlFor="Quantity">Balance</label>    
                                    </div>
                                    <Button>Submit Delivery</Button>
                                </Card>
                            </div>
                        </form>
                   </Card>
               </div>
           </div>
        </>
    )
}

export default FormDistribute;