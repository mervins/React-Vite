import { useState,useEffect, useContext } from "react";
import TableTitle from "../../UI/Table/TableTitle";
import Pagination, {PG,configPagination} from "../../components/Pagination/Pagination";
import classess from "./Pickup.module.css"; 
import {BiCar} from 'react-icons/bi';
import List from "../../UI/List/List";
import HeaderList from "../../UI/List/HeaderList";
import Floating from "../../UI/Button/Floating";
import Modal from "../../UI/Modal/Modal";
import FormPickup from "./FormPickup";
import GlobalContext from "../../store/GlobalContext";
import useHttp from "../../hook/use-http";
import Toast, {toastProperties} from "../../components/Toast/Toast";
import Items from "../../UI/List/Items"; 
import Card from "../../components/Card/Card";
import { BiTrashAlt,BiFolderOpen } from 'react-icons/bi'; 
import Delete from "../../components/Delete/Delete";

const HEADER = [{id:0,name:'Date'},{id:1,name:'Total'},{id:2,name:'Action'}]; 
const HEADER_PICKUP = [{id:0,name:'Driver'},{id:2,name:'Supplier'},{id:3,name:'Product'},{id:4,name:'Price'},{id:5,name:'Qunatity'},{id:6,name:'Total'}];

export const ACTION = {
    ACTION_ADD:'Add',
    ACTION_EDIT:'Edit',
    ACTION_REMOVE:'Remove',
    ACTION_FETCH:'Fetch'
}

const Pickup = ()=>{ 
    const [paginationConfig,setPaginationConfig] = useState({...configPagination})
    const [currentPage, setCurrentPage] = useState(1);
    const [isShowForm,setIsShowForm] = useState(false); 
    const [supplier,setSupplier] = useState([]);
    const [pickUp,setPickUp] = useState([])
    const [track,setTrack] = useState([]); 
    const [list, setList] = useState([]); 
    const [itemPickUp,setItemPickUp] = useState({});
    const [showItemPickUp,setShowItemPickUp] = useState(false);
    const [showWarDelete,setShowWarDelete] =useState(false);
    const [pickUpID,setPickUpID] = useState()
    const ctx = useContext(GlobalContext); 
    const {sendRequest} = useHttp();  

    useEffect(()=>{
        // sendRequest({url:ctx.url_base+`/api/supplier`},getSupplier); 
        sendRequest({url:ctx.url_base+`/api/pickup`},getPickUp)
        sendRequest({url:ctx.url_base+`/api/track`},getTack); 
       
    },[sendRequest])

    // const getSupplier = (data)=>{ 
    //     setSupplier(data); 
    // }
    const getPickUp = (data)=>{
        setPickUp(data);
        console.log(data)
    }
    const getTack = (data)=>{ 
        setTrack(data)
    }

    const changePage = (page)=>{ 
        setCurrentPage(page)     
    }

    const showForm = (action,type)=>{
        setIsShowForm(true)
    }
    const showToast = (type,message,title)=>{
        let toast = toastProperties(type,message,title)
        setList([...list, toast]); 
    }
    
    const itemPickUpShow = (item)=>{
        const product = {product: JSON.parse(item.product)};
        const items = product.product; 
        setShowItemPickUp(true); 
        setItemPickUp(() => { return {...item,items}});   
    }

    const onDeleteHandler = ()=>{   
        const formExport = {url:ctx.url_base+'/api/deletePicku/'+pickUpID, 
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',}
        };
        sendRequest(formExport,(status)=>{
            if(status.deleted){
                setShowWarDelete(false);
                showToast("danger",'Transaction Deleted','Success');
                setPickUp(state => state.filter((item) => item.id !== pickUpID))
            }
        });  
    }

    const addItem = (value)=>{
        setPickUp(state=>[value,...state])
    }

    const dateToString = (date) => {let newDate = new Date(date); return newDate.toDateString();}
    
    let items = pickUp.map((item,index)=>{
        return <Items key={index}>
                <div>
                    <h5>{dateToString(item.date)}</h5>
                </div>
                <div>
                    <h5><b>₱</b> {item.total}</h5>
                </div>
                <div className={classess.cust}>
                     <button  onClick={()=>{itemPickUpShow(item)}}><Card><BiFolderOpen/></Card></button>
                     <button onClick={()=>{setShowWarDelete(true); setPickUpID(item.id);}}><Card><BiTrashAlt/></Card></button>
                </div>
        </Items>
    })
    return (
        <>
        <Toast toastList={list} position="top-right"></Toast>
        {showWarDelete && 
        <Delete message="Are you sure you want to remove this transaction? This will affect your inventory." 
            onCancelHandler={()=>{setShowWarDelete(false)}} onDeleteHandler={onDeleteHandler}></Delete>}
            <TableTitle>
                <div className={classess.title}>
                    <div> Pick-up <BiCar/></div>
                    <div>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={paginationConfig.totalItems}
                        pageSize={PG.SIZE}
                        onPageChange={page => changePage(page)}/>  
                    </div> 
                </div>
            </TableTitle>
            <List>
                <ul>
                    <HeaderList header={HEADER}></HeaderList>
                    {items}
                </ul>
            </List> 
            {/* show item pickup list */}
           { showItemPickUp && 
           <Modal withSize="notNull" onClose={(val)=>{setShowItemPickUp(val);}}>
            <List>
                <div className={classess.total}><h1>Grand Total: ₱{itemPickUp.total}</h1></div>
                <ul>
                    <HeaderList header={HEADER_PICKUP}></HeaderList>
                    {itemPickUp.items.map((item,index)=>{
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
                                    <h5>₱ {item.total}</h5>
                            </div>
                        </Items>);
                    })}
                </ul>
                </List> 
            </Modal>}
            <Floating onClickFloat={showForm}>ADD</Floating>
            {
                isShowForm && 
                <Modal withSize="notNull" onClose={(val)=>{setIsShowForm(val);}}>
                    <h2 className={classess.h2}>Pickup</h2> 
                    <div className={classess.line}></div>  
                    <FormPickup supplier={supplier} track={track} 
                    showToast={showToast} 
                    onClose={(val)=>{setIsShowForm(val);}}
                    addItem={addItem}
                    ></FormPickup>
                </Modal>
            }
        </>
    )
}

export default Pickup;