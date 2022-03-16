
import React, {useState,useContext, useEffect,useReducer} from "react"; 
import Floating from "../../UI/Button/Floating";
import List from "../../UI/List/List";
import Items from "../../UI/List/Items";
import HeaderList from "../../UI/List/HeaderList";
import Form from "../../components/Form/Form";
import GlobalContext from "../../store/GlobalContext";
import useHttp from "../../hook/use-http";
import { BiEdit,BiTrashAlt,BiGroup } from 'react-icons/bi';
import classess from "./Inventory.module.css";
import Card from "../../components/Card/Card"; 
import Modal from "../../UI/Modal/Modal";  
import Button from "../../UI/Button/Button";
import Toast, {toastProperties} from "../../components/Toast/Toast";
import TableTitle from "../../UI/Table/TableTitle";
import Pagination, {PG,configPagination} from "../../components/Pagination/Pagination";

const HEADER = [{id:0,name:'Description'},{id:1,name:'Price'},{id:2,name:'Selling Price'},{id:3,name:'Stock'},{id:4,name:'Unit'}];

export const ACTION = {
    ACTION_ADD:'Add',
    ACTION_EDIT:'Edit',
    ACTION_REMOVE:'Remove',
    ACTION_FETCH:'Fetch'
}

const itemsReducer = (itemsState,action)=>{  
    switch(action.type){
        case ACTION.ACTION_ADD:  
            return itemsState.concat(action.data);
        case ACTION.ACTION_EDIT: 
            let indexItem = itemsState.findIndex((item)=>{
                return item.id === action.data.id
            });
            const tempItems = [...itemsState]; 
            const tempItem = tempItems[indexItem]; 
            const updateItem = {...tempItem, ...action.data};
            tempItems[indexItem] = updateItem;  
            return tempItems;
        case ACTION.ACTION_REMOVE:  
            return itemsState.filter(item => {return item.id !== action.data.id});
        default: 
            return itemsState = [...action.data];
    } 
}
 
const Inventory = ()=>{
    const ctx = useContext(GlobalContext);  
    const [showForm, setShowForm] = useState(false); 
    const [showDelete, setShowDelete] = useState(false);
    const [category,setCategory] = useState(0); 
    const [status,setStatus] = useState(); 
    const [editItem,setEditItem] = useState({}); 
    const [itemsState,dispatchAction] = useReducer(itemsReducer,[]);
    const {sendRequest} = useHttp(); 
    const [list, setList] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationConfig,setPaginationConfig] = useState({...configPagination})

    useEffect(()=>{ 
        sendRequest({url:ctx.url_base+`/api/inventoryPG?page=${currentPage-1}&size=${PG.SIZE}`},getData); 
    },[sendRequest,currentPage]) 

    const getData = (data)=>{ 
        setPaginationConfig({totalItems:data.totalItems ,totalPages:data.totalPages}) 
        dispatchAction({type:null,data:[...data.rows]}); 
        console.log(data.rows)  
    }
    const customerAddHandler = (customer) => {
        dispatchAction({type:ACTION.ACTION_ADD,data:customer});
        showToast("success",'Customer Added','Success')
      };
    const onSubmitHandle = (form1)=>{  
        if(status === ACTION.ACTION_ADD){ 
            const form = {...form1};
            const formExport = {url:ctx.url_base+'/api/addCustomer', 
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            form,
            }; 
            sendRequest(formExport,customerAddHandler);
        }else if(status === ACTION.ACTION_EDIT){ 
            const form = {...editItem,...form1};    
            const formExport = {url:ctx.url_base+'/api/editCustomer', 
            method: 'PUT',
            headers: {'Content-Type': 'application/json',},
            form,
            }; 
            sendRequest(formExport,updateData);
        }
    
        setShowForm(false)
    } 
    const updateData = (data)=>{  
        dispatchAction({type:ACTION.ACTION_EDIT,data:data});
        showToast("info",'Customer Updated','Success')
    } 
    const selectTab = (status,item)=>{  
        setEditItem(item) 
        setStatus(status)
        setCategory(1); 
        setShowForm(true); 
      }
    const closeForm = ()=>{
        setShowForm(false); 
    }
    // const deleteWar = (item) =>{
    //     setShowDelete(true);
    //     setEditItem(item);
    // }
    const deleteCust = ()=>{   
        const formExport = {url:ctx.url_base+'/api/deleteCustomer/'+editItem.id, 
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',}
        };
        sendRequest(formExport,deletedCust); 
        setShowDelete(false);
    }
    const deletedCust=()=>{
        dispatchAction({type:ACTION.ACTION_REMOVE,data:editItem});
        showToast("danger",'Customer Deleted','Success')
    }
    const showToast = (type,message,title)=>{
        let toast = toastProperties(type,message,title)
        setList([...list, toast]); 
    }
    const changePage = (page)=>{ 
        setCurrentPage(page)     
    }
    let item =  itemsState.map((item)=>{
        return (<Items key={item.id}>
                    <div>
                         <h5>{item.Product.description || ''}</h5>
                    </div>
                    <div>
                        <h5>{item.Product.price || ''}</h5>
                    </div>
                    <div>
                        <h5>{item.Product.sellingprice || ''}</h5>
                    </div>
                    <div>
                        <h5>{item.stock.toString() || ''}</h5>
                    </div>
                    <div>
                        <h5>{item.Product.unit || ''}</h5>
                    </div>
                    {/* <div className={classess.cust}>
                        <button onClick={()=>{selectTab(ACTION.ACTION_EDIT,item)}} ><Card><BiEdit/></Card></button>
                        <button onClick={()=>{deleteWar(item)}}><Card><BiTrashAlt/></Card></button>
                    </div>  */}
                </Items>);
    })

    return (
        <>
            <div>
                <TableTitle>
                    <div className={classess.title}>
                        <div> Inventory <BiGroup/></div>
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
                <Toast toastList={list} position="top-right"></Toast>
                {showForm && <Form addCustomer={onSubmitHandle} onClose={closeForm} 
                                cat={category} status={status}
                                editItem={editItem}>
                            </Form>
                }
                {showDelete && 
                    <Modal >
                        <div className={classess.delete}>
                            <div><h2>Confirm</h2></div>
                            <div>Are you sure you want to remove this customer?</div>
                            <br/>
                            <div className={classess.deleteBtn}><div onClick={()=>{setShowDelete(false)}}><Button>Cancel</Button></div> <div onClick={deleteCust}><Button>Continue</Button></div></div>
                        </div>
                    </Modal>
                }
                <List>
                    <ul>
                        <HeaderList header={HEADER}></HeaderList>
                        {item}
                    </ul>
                </List>
                <Floating onClickFloat={selectTab}>ADD</Floating>
            </div>
        </>
    )
}

export default Inventory;