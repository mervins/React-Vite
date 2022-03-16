import React, {Fragment,useState,useContext,useEffect, useReducer} from "react";
import classess from "./Products.module.css"; 
import TableTitle from "../../UI/Table/TableTitle";
import Toast, {toastProperties} from "../../components/Toast/Toast";
import Modal from "../../UI/Modal/Modal";
import Pagination, {PG,configPagination} from "../../components/Pagination/Pagination";
import List from "../../UI/List/List";
import HeaderList from "../../UI/List/HeaderList";
import { BiAddToQueue,BiCalendarEdit,BiGroup,BiTrashAlt,BiEdit } from 'react-icons/bi';
import useHttp from "../../hook/use-http";
import  GlobalContext from "../../store/GlobalContext";
import Items from "../../UI/List/Items"; 
import FormProduct from "./Form";
import Card from "../../components/Card/Card";
import Button from "../../UI/Button/Button";

const HEADER = [{id:0,name:'Distributor'},{id:1,name:'Contact'},{id:2,name:'Address'},{id:3,name:'Action'}];
const HEADER_PRODUCT = [{id:0,name:'Description'},{id:1,name:'Price'},{id:2,name:'Selling Price'},{id:3,name:'Unit'},,{id:4,name:'Action'}];

export const ACTION = {
    ACTION_ADD:'Add',
    ACTION_EDIT:'Edit',
    ACTION_REMOVE:'Remove',
    ACTION_FETCH:'Fetch'
}

const setProducts = (itemsState,action)=>{
    switch(action.type){
        case ACTION.ACTION_FETCH:
            return itemsState = [...action.data];
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
            if(action.data.type === ACTION.ACTION_ADD){ 
                let tempProd = [...itemsState]
                tempProd.splice(action.data.index,1)
                return itemsState = [...tempProd];
            }
                return itemsState.filter(item => item.id !== action.data.id);
        default: 
            return itemsState = [...action.data];
    } 
}


const Product = () =>{
    const ctx = useContext(GlobalContext);   
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationConfig,setPaginationConfig] = useState({...configPagination})
    const [itemsState,setItem] = useState([]);//this one is for supplier items
    const {sendRequest} = useHttp(); 
    const [isFormShow,setisFormShow] = useState(false);
    const [stateProducts,dispatchProducts] = useReducer(setProducts,[]);//use for products data
    const [list, setList] = useState([]); //use for toast items
    const [supplier,setSupplier] = useState({}); //get and set supplierID
    const [status,setStatus] = useState(); // use for the actions status 
    const [showDelete, setShowDelete] = useState(false);
    const [editProd,setEditProd] = useState({}); //hold the item to be update
    const [showAddForm,setShowAddForm] = useState(false);
    useEffect(()=>{ 
        sendRequest({url:ctx.url_base+`/api/supplierPG?page=${currentPage-1}&size=${PG.SIZE}`},getData); 
    },[sendRequest,currentPage]) 

    const getData = (data)=>{  
        setItem([...data.rows])
        setPaginationConfig({totalItems:data.totalItems ,totalPages:data.totalPages}) 
        console.log(paginationConfig)
    }
    const showProject = (supplier)=>{
        setisFormShow(true);
        setSupplier(item.id);
        setStatus(ACTION.ACTION_FETCH);
        setSupplier(supplier)
        sendRequest({url:ctx.url_base+`/api/product/${supplier.id}`},getProduct); 
    } 
    const getProduct= (data) => {
        dispatchProducts({type:ACTION.ACTION_FETCH,data:[...data]})
    }
    const changePage = (page)=>{ 
        setCurrentPage(page)     
    }
    const addProducts=(product)=>{ 
        setShowAddForm(false)  
        setShowAddForm(false);
        setStatus(ACTION.ACTION_ADD);  
        dispatchProducts({type:ACTION.ACTION_ADD,data:{...product,supplier_id:supplier.id}})
        showToast("success",'Added','Success')
    }
    const updateProducts=(product)=>{ 
        const form = {...editProd, ...product};
        const formExport = {url:ctx.url_base+'/api/editProduct', 
        method: 'PUT',
        headers: {'Content-Type': 'application/json',},
        form,
        }; 
        sendRequest(formExport,updatedProduct);   
        setShowAddForm(false); 
        // setStatus(ACTION.ACTION_EDIT);  
        // dispatchProducts({type:ACTION.ACTION_EDIT,data:{...product,supplier_id:supplier.id}})
        // showToast("success",'update','Success')
    }
    const updatedProduct = (data)=>{
        dispatchProducts({type:ACTION.ACTION_EDIT,data:{...data}})
        showToast("success",'update','Success') 
    }
    const showToast = (type,message,title)=>{
        let toast = toastProperties(type,message,title)
        setList([...list, toast]); 
    }
    const removeProduct = (item,index) =>{  
        if(status === ACTION.ACTION_ADD){
            dispatchProducts({type:ACTION.ACTION_REMOVE,data:{index:index,type:ACTION.ACTION_ADD}})
        }else{
            setShowDelete(true);
            setEditProd(item)
        }
        
    }
    const onSaveProducts=()=>{   
            const form = [...stateProducts];
            const formExport = {url:ctx.url_base+'/api/addProduct', 
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            form,
            }; 
            sendRequest(formExport,()=>{}); 
            dispatchProducts({type:null,data:[]})
            showToast("success",'Successfully Saved.','Success');
            setisFormShow(false);
            // sendRequest({url:ctx.url_base+`/api/addProduct`},()=>{}); 
    }
    const deleteProd = ()=>{
        const formExport = {url:ctx.url_base+'/api/deleteProduct/'+editProd.id, 
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',}
        };
        sendRequest(formExport,deletedProd); 
        setShowDelete(false);
    }
    const deletedProd = ()=>{
        dispatchProducts({type:ACTION.ACTION_REMOVE,data:editProd});
        showToast("danger",'Product Deleted','Success')
    }
    const updateProd = (item)=>{ 
        setEditProd(item); 
        setShowAddForm(true);
    }
    const closeFormInput= ()=>{
        setShowAddForm(false);
    }
    let item =  itemsState.map((item)=>{
        return (<Items key={item.id}>
                    <div>
                         <h5>{item.name}</h5>
                    </div>
                    <div>
                        <h5>{item.contact}</h5>
                    </div>
                    <div>
                        <h5>{item.address}</h5>
                    </div>
                    <div className={classess.cust}>
                        <button onClick={
                            ()=>{setisFormShow(true); 
                                setSupplier(item); 
                                setStatus(ACTION.ACTION_ADD);
                                dispatchProducts({type:null,data:[]})
                            }}><Card><BiAddToQueue/></Card></button>
                        <button onClick={()=>{showProject(item)}}><Card><BiCalendarEdit/></Card></button>
                    </div> 
                </Items>);
    }) 
    return (
        <Fragment>
            <Toast toastList={list} position="top-right"></Toast>
            <TableTitle>
                <div className={classess.title}>
                    <div> Distributors <BiGroup/></div>
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
            {showDelete && 
                <Modal zIndex={30}>
                    <div className={classess.delete}>
                        <div><h2>Confirm</h2></div>
                        <div>Are you sure you want to remove this Product?</div>
                        <br/>
                        <div className={classess.deleteBtn}><div onClick={()=>{setShowDelete(false)}}>
                            <Button>Cancel</Button></div> 
                            <div onClick={deleteProd}><Button>Continue</Button></div></div>
                    </div>
                </Modal>
            }
            { isFormShow && <Modal withSize="notNull" onClose={(val)=>{setisFormShow(val);setShowAddForm(false);}}>
                            <h2 className={classess.h2}>Products</h2> 
                            <div className={classess.line}></div> 
                            {showAddForm && <Modal zIndex={30}> <FormProduct closeFormInput={closeFormInput} updateProducts={updateProducts} addProducts={addProducts} status={status} editProd={editProd} isFormShow={isFormShow}></FormProduct> </Modal>}
                            {/* <hr/> */}
                            <TableTitle>
                                 <div className={classess.title}>
                                    <div><p className={classess.h2}>Supplier: {supplier.name}</p> </div>
                                    { status === ACTION.ACTION_ADD && <div className={classess.btn}>
                                        <div  onClick={()=>{setShowAddForm(true)}}>
                                        <Button>Create Product</Button>
                                            </div>
                                            <div onClick={onSaveProducts}>
                                            <Button>Save Product</Button>
                                        </div>
                                    </div>
                                }
                                </div>
                            </TableTitle> 
                            <List>
                                <ul>
                                    <HeaderList header={HEADER_PRODUCT}></HeaderList> 
                                    {
                                       stateProducts.map((item,index)=>{
                                        return (<Items key={index}>
                                                    <div>
                                                        <h5>{item.description}</h5>
                                                    </div>
                                                    <div>
                                                         <h5>{item.price}</h5>
                                                    </div>
                                                    <div>
                                                        <h5>{item.sellingprice}</h5>
                                                    </div>
                                                    <div>
                                                        <h5>{item.unit}</h5>
                                                    </div>
                                                    <div className={classess.cust}>  
                                                        { status === ACTION.ACTION_FETCH && <button onClick={()=>{updateProd(item)}}><Card><BiEdit/></Card></button>}
                                                        <button onClick={()=>{removeProduct(item,index)}}><Card><BiTrashAlt/></Card></button>
                                                    </div> 
                                                </Items>);
                                        })  
                                    }
                                </ul>
                            </List>
                        </Modal>
            }
            <List>
                <ul>
                    <HeaderList header={HEADER}></HeaderList>
                    {item}
                </ul>
            </List> 
        </Fragment>
    )
} 
export default Product;