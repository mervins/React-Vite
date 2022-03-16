import { useState,useEffect, useContext } from 'react';
import { BiBasket } from 'react-icons/bi'; 
import TableTitle from '../../UI/Table/TableTitle';
import classess from './Distribute.module.css';
import Floating from '../../UI/Button/Floating';
import List from '../../UI/List/List';
import HeaderList from '../../UI/List/HeaderList';
import Modal from '../../UI/Modal/Modal';
import FormDistribute from './FormDistribute'; 
import GlobalContext from "../../store/GlobalContext";
import useHttp from "../../hook/use-http";
import Items from '../../UI/List/Items';
import { BiTrashAlt,BiFolderOpen } from 'react-icons/bi';  
import Toast, {toastProperties} from "../../components/Toast/Toast";
import Pagination, {PG,configPagination} from "../../components/Pagination/Pagination";  
import Card from '../../components/Card/Card';
import ItemDistribute from './itemDistribute';
import Delete from '../../components/Delete/Delete';

const HEADER = [{id:0,name:'Date'},{id:4,name:'Distributor'},{id:1,name:'Customer'},{id:2,name:'Balance'},{id:3,name:'Total'},{id:5,name:'Action'}]; 
const HEADER_DISTRIBUTE = [{id:0,name:'Product'},{id:4,name:'Price'},{id:1,name:'Sold'},{id:2,name:'Total'}]

const Distribute = ()=>{
    const [isShowForm,setIsShowForm] = useState(false);
    const [product,setProduct] = useState([]);
    const [customer,setCustomer] = useState([]);
    const [inventory,setInventory] = useState([]);
    const [track,setTrack] = useState([])
    const ctx = useContext(GlobalContext);
    const {sendRequest} = useHttp();  
    const [list, setList] = useState([]); 
    const [listDistribute,setListDistribute] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationConfig,setPaginationConfig] = useState({...configPagination});
    const [showItemDistribute,setShowItemDistribute] = useState(false);
    const [itemDistribute,setItemDistribute] = useState({});
    const [showDelete, setShowDelete] = useState(false);
    const [distributeID,setDistributeID] = useState()
    
    useEffect(()=>{
        sendRequest({url:ctx.url_base+`/api/inventory`},(data)=>setInventory(data));   
        sendRequest({url:ctx.url_base+`/api/customer`},(data)=>setCustomer(data));
        sendRequest({url:ctx.url_base+`/api/track`},(data)=>setTrack(data));
    },[sendRequest])

    useEffect(()=>{ 
        sendRequest({url:ctx.url_base+`/api/distributePG?page=${currentPage-1}&size=${PG.SIZE}`},(data)=>{   
            setListDistribute(data.rows)
            console.log(data.rows)
        }); 
    },[sendRequest,currentPage])

    const showToast = (type,message,title)=>{
        let toast = toastProperties(type,message,title)
        setList([...list, toast]); 
    } 
    const changePage = (page)=>{ 
        setCurrentPage(page)     
    } 
    const itemDistributeShow = (item)=>{
        setShowItemDistribute(true); 
        console.log(item)
        setItemDistribute(item);   
    }
    const onDeleteHandler = ()=>{
        const formExport = {url:ctx.url_base+'/api/deleteDistribute/'+distributeID, 
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',}
        };
        sendRequest(formExport,(status)=>{
            if(status.deleted){
                setShowDelete(false);
                showToast("danger",'Transaction Deleted','Success');
                listDistribute(state => state.filter((item) => item.id !== distributeID))
            }
        });  
    }

    const dateToString = (date) => {let newDate = new Date(date); return newDate.toDateString();}
    const stringToObject = (data) => JSON.parse(data);
    let items = listDistribute.map((item,index)=>{
        return <Items key={index}>
                <div>
                    <h5>{dateToString(item.date)}</h5>
                </div>
                <div>
                    <h5>{stringToObject(item.driver).driver}</h5>
                </div>
                <div>
                    <h5>{stringToObject(item.customer).name}</h5>
                </div>
                <div>
                    <h5><b>₱</b> {stringToObject(item.payment).balance}</h5>
                </div>
                <div>
                    <h5><b>₱</b> {item.total}</h5>
                </div>
                <div className={classess.cust}> 
                    <button  onClick={()=>{itemDistributeShow(item)}}><Card><BiFolderOpen/></Card></button>
                    <button onClick={()=>{setShowDelete(true); setDistributeID(item.id)}}><Card><BiTrashAlt/></Card></button>
                </div>
        </Items>
    })

    return(
        <>
            <Toast toastList={list} position="top-right"></Toast>
            <Floating onClickFloat={()=>setIsShowForm(true)}>ADD</Floating>
            <TableTitle>
                <div className={classess.title}>
                    <div> Distribute <BiBasket/></div>
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
            {
                isShowForm && 
                <Modal withSize="notNull" onClose={(val)=>{setIsShowForm(val);}}>
                    <h2 className={classess.h2}>Distribute <BiBasket/></h2> 
                    <div className={classess.line}></div>  
                    <FormDistribute  
                    customer={customer}
                    track={track}
                    HeaderList={HeaderList} 
                    Items={Items}
                    BiTrashAlt={BiTrashAlt}
                    inventory={inventory}
                    // supplier={supplier} 
                    // track={track} 
                    showToast={showToast} 
                    onClose={(val)=>{setIsShowForm(val);}}
                    updateInventory={((dataInv,dataDist)=>{ 
                        setListDistribute(state => [dataDist,...state])
                        setInventory(dataInv)
                        setIsShowForm(false);
                        let newUpdate = [];
                        const update = dataInv.map((item1)=>{
                             inventory.filter((item2)=>{
                                if(item1.id === item2.id){
                                    if(item1.stock !== item2.stock){
                                        newUpdate.push(item1);
                                    }
                                }
                            })
                        });
                        const form = {list:newUpdate}
                        const formSubmit = {url:ctx.url_base+'/api/editInventoryList', 
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json',},
                        form,
                        }; 
                        sendRequest(formSubmit,(data)=>{});
                        })}
                    // addItem={addItem}
                    ></FormDistribute>
                </Modal>
            }
            {
                showItemDistribute && 
                <Modal withSize="notNull" onClose={(val)=>{setShowItemDistribute(val)}} >
                    <ItemDistribute
                        HeaderList={HeaderList}
                        List={List}
                        Items={Items}
                        HEADER_DISTRIBUTE={HEADER_DISTRIBUTE}
                        itemDistribute={itemDistribute}
                    />
 
                </Modal>
            }
            {showDelete && 
                <Delete message="Are you sure you want to remove this transaction? This will affect your inventory." 
                onCancelHandler={()=>{setShowDelete(false)}} onDeleteHandler={onDeleteHandler}></Delete>
            }
        </>
    )
}

export default Distribute;