import classess from "./Aging.module.css";
import Button from "../../../UI/Button/Button";
import React, {useState,useEffect} from "react";

const HEADER = [{id:0,name:'date'},{id:1,name:'Balance'},{id:2,name:'Total'},{id:3,name:'Action'}];

const HEADERITEMS = [{id:1,name:'Description'},{id:2,name:'Price'},{id:3,name:'Sold'},{id:4,name:'Total'},{id:5,name:'Action'}];

const Aging = (props)=>{
    
    const {List,HeaderList,Items,customerRecords,Modal} = props;

    const [items,setItems] = useState([]);
    const [itemsShow, setItemsShows] = useState(false)
    const dateToString = (date) => {let newDate = new Date(date); return newDate.toDateString();}
    const stringToObject = (data) => JSON.parse(data); 

    useEffect(()=>{
        setItems(items)
        console.log(items)
    },[items])
    return(
        <>
            <h1 className={classess.h2}>Records</h1> 
            <div className={classess.line}></div> 
            <List>
                <ul>
                    <HeaderList header={HEADER}></HeaderList> 
                    {
                        customerRecords.map((item,index)=>{
                        return (<Items key={index}>
                                    <div>
                                        <h5>{dateToString(item.date)}</h5>
                                    </div>
                                    <div> 
                                        <h5><b>₱</b> {stringToObject(item.payment).balance}</h5>
                                    </div>
                                    <div>
                                        <h5><b>₱</b>{item.total}</h5>
                                    </div> 
                                    <div className={classess.cust}>  
                                        <div onClick={()=>{
                                            setItems(item);
                                            setItemsShows(true)
                                        }}><Button>View</Button></div>
                                        <Button >Return</Button>
                                    </div> 
                                </Items>);
                        })  
                    }
                </ul>
            </List>
            {
                itemsShow && 
                <Modal withSize="notNull" zIndex={30} onClose={(val)=>{setItemsShows(val)}}>
                    <h1 className={classess.h2}>ITEMS</h1> 
                    <div className={classess.line}></div> 
                    <List>
                <ul>
                    <HeaderList header={HEADERITEMS}></HeaderList> 
                    {
                        stringToObject(items.product).map((item,index)=>{
                        return (<Items key={index}>
                                    <div>
                                        <h5>{item.Product.description}</h5>
                                    </div>
                                    <div> 
                                        <h5><b>₱</b> {item.Product.price}</h5>
                                    </div>
                                    <div>
                                        <h5>{item.sold}</h5>
                                    </div> 
                                    <div>
                                        <h5><b>₱</b>{item.total}</h5>
                                    </div> 
                                    <div className={classess.cust}>  
                                        <div onClick={()=>{
                                            setItems(item);
                                            setItemsShows(true)
                                        }}><Button>Pay</Button></div>
                                        <div><Button >Return</Button></div>
                                    </div> 
                                </Items>);
                        }) 
                    }
                        
                </ul>
            </List>
                </Modal>
            }
        </>
    )
}

export default Aging;