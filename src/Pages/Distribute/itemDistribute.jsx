

const ItemDistribute = (props)=>{

    const { HeaderList,List,Items, HEADER_DISTRIBUTE,itemDistribute,total} = props;
    const stringToObject = (data) => JSON.parse(data);
    console.log((props.itemDistribute))
    return(
        <>
            {/* <div><h1>Grand Total: ₱</h1></div> */}
            <List>
                <div><h1>Grand Total: ₱{itemDistribute.total}</h1></div>
                <ul>
                    <HeaderList header={HEADER_DISTRIBUTE}></HeaderList>
                    {stringToObject(itemDistribute.product).map((item,index)=>{
                        return (<Items key={index}>
                            <div key="0">
                                <h5>{item.Product.description}</h5>
                                </div> 
                                <div key="3">
                                    <h5>₱ {item.Product.sellingprice}</h5>
                                </div>
                                <div key="4">
                                    <h5>{item.sold}</h5>
                                </div>
                                <div key="7">
                                    <h5>₱ {item.total}</h5>
                            </div>
                        </Items>);
                    })}
                </ul>
                </List> 
        </>
    )
}

export default ItemDistribute;