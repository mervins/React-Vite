import React,{useState,useEffect,useContext,useReducer} from "react";
import classess from './Track.module.css';
import Floating from "../../UI/Button/Floating";
import List from "../../UI/List/List";
import Items from "../../UI/List/Items";
import HeaderList from "../../UI/List/HeaderList";
import Form from "../../components/Form/Form";
import {ACTION} from '../Customer/Cutomer';
import Card from "../../components/Card/Card"; 
import { BiEdit,BiTrashAlt,BiCar } from 'react-icons/bi';
import useHttp from "../../hook/use-http";
import GlobalContext from "../../store/GlobalContext";
import Toast,{toastProperties} from "../../components/Toast/Toast";
import Modal from "../../UI/Modal/Modal";
import Button from "../../UI/Button/Button";
import TableTitle from "../../UI/Table/TableTitle";
import Pagination, {PG,configPagination} from "../../components/Pagination/Pagination";

const HEADER = [{id:0,name:'Driver'},{id:1,name:'Contact'},{id:2,name:'Address'},{id:3,name:'Agent'},{id:4,name:'Action'}];
 
const trackReducer = (trackState,action)=>{
    console.log(action)
    switch(action.type){
        case ACTION.ACTION_ADD:  
            return trackState.concat(action.data);
        case ACTION.ACTION_EDIT: 
            let indexItem = trackState.findIndex((item)=>{
                return item.id === action.data.id
            });
            const tempItems = [...trackState]; 
            const tempItem = tempItems[indexItem]; 
            const updateItem = {...tempItem, ...action.data};
            tempItems[indexItem] = updateItem; 
            console.log(updateItem)
            return tempItems;
        case ACTION.ACTION_REMOVE:  
            return trackState.filter(item => {return item.id !== action.data.id});
        default:
            return trackState = [...action.data];
    } 
}  
const Track = ()=>{
    const ctx = useContext(GlobalContext); 
    const [showForm, setShowForm] = useState(false); 
    const [category,setCategory] = useState(2);
    const [itemState,dispactTrack] = useReducer(trackReducer,[]); 
    const [status,setStatus] = useState(); 
    const [editItem,setEditItem] = useState({});  
    const [list, setList] = useState([]); 
    const [showDelete, setShowDelete] = useState(false);
    const {sendRequest} = useHttp();  
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationConfig,setPaginationConfig] = useState({...configPagination})

    useEffect(()=>{
        sendRequest({url:ctx.url_base+`/api/trackPG?page=${currentPage-1}&size=${PG.SIZE}`},getData); 
    },[sendRequest,currentPage])

    const getData = (data)=>{ 
        setPaginationConfig({totalItems:data.totalItems ,totalPages:data.totalPages})
        dispactTrack({type:null,data:[...data.rows]})
    }
    const selectTab = (status,item)=>{ 
        setEditItem(item) 
        setStatus(status)
        setCategory(2); 
        setShowForm(true); ;  
    }
    const closeForm = ()=>{
        setShowForm(false); 
    }
    const onSubmitHandle = (form1)=>{  
        if(status === ACTION.ACTION_ADD){ 
            const form = {...form1};
            const formExport = {url:ctx.url_base+'/api/addTrack', 
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            form,
            }; 
            sendRequest(formExport,trackAddHandler);
        }else if(status === ACTION.ACTION_EDIT){ 
            const form = {...editItem,...form1};    
            const formExport = {url:ctx.url_base+'/api/editTrack', 
            method: 'PUT',
            headers: {'Content-Type': 'application/json',},
            form,
            }; 
            sendRequest(formExport,updateData);
        } 
        setShowForm(false)
    }
    const trackAddHandler = (track) => {
        dispactTrack({type:ACTION.ACTION_ADD,data:track});
        showToast("success",'Track Added','Success')
      };
    const updateData = (data)=>{  
        dispactTrack({type:ACTION.ACTION_EDIT,data:data});
        showToast("info",'Track Updated','Success')
    }  
    const deleteWar = (item) =>{
        setShowDelete(true);
        setEditItem(item);
    }
    const deleteTrack = ()=>{   
        const formExport = {url:ctx.url_base+'/api/deleteTrack/'+editItem.id, 
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',}
        };
        sendRequest(formExport,deletedTrack); 
        setShowDelete(false);
    }
    const deletedTrack=()=>{
        dispactTrack({type:ACTION.ACTION_REMOVE,data:editItem});
        showToast("danger",'Customer Deleted','Success')
    }
    const showToast = (type,message,title)=>{
        let toast = toastProperties(type,message,title)
        setList([...list, toast]); 
    }
    const changePage = (page)=>{ 
        setCurrentPage(page)     
    }
    let item = itemState.map((item,index)=>{ 
        return (<Items key={index}>
                    <div>
                        <h5>{item.driver}</h5>
                    </div>
                    <div>
                        <h5>{item.contact}</h5>
                    </div> 
                    <div>
                        <h5>{item.agent}</h5>
                    </div>
                    <div>
                        <h5>{item.plate_number}</h5>
                    </div>
                    <div className={classess.track}>
                        <button onClick={()=>{selectTab(ACTION.ACTION_EDIT,item)}} ><Card><BiEdit/></Card></button>
                        <button onClick={()=>{deleteWar(item)}}><Card><BiTrashAlt/></Card></button>
                    </div> 
                </Items>);
    })
    return(
        <div>
            <TableTitle>
                <div className={classess.title}>
                    <div>Track <BiCar/></div>
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
            {showDelete && 
                <Modal >
                    <div className={classess.delete}>
                        <div><h2>Confirm</h2></div>
                        <div>Are you sure you want to remove this customer?</div>
                        <br/>
                        <div className={classess.deleteBtn}><div onClick={()=>{setShowDelete(false)}}><Button>Cancel</Button></div> <div onClick={deleteTrack}><Button>Continue</Button></div></div>
                    </div>
                </Modal>
            }
            {showForm && <Form addCustomer={onSubmitHandle} onClose={closeForm} 
                            cat={category} status={status} editItem={editItem}></Form>}
            <List>
                <ul>
                    <HeaderList header={HEADER}></HeaderList>
                     {item}
                </ul>
            </List>
            <Floating onClickFloat={selectTab}>ADD</Floating>
        </div>
    )
}

export default Track;