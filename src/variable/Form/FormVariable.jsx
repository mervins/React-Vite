 const FormVariable = (category,inputs)=>{
    const form = {}
    switch(category){
        case 'SupAndCus':
            Object.assign(form,{//THIS FORM REPRESENT FOR SUPPLIER and CUSTOMER(same table field)
                name:inputs[0].value,
                contact:inputs[1].value,
                address:inputs[2].value, 
            });
            return form; 
        case 'Track':
            Object.assign(form,{//THIS FORM REPRESENT FOR TRACK
                driver:inputs[0].value,
                contact:inputs[1].value,
                agent:inputs[2].value,
                plate_number:inputs[3].value,
            });
            return form;
        case 'Product':
            Object.assign(form,{//THIS FORM REPRESENT FOR TRACK
                description:inputs[0].value,
                price:inputs[1].value,
                sellingprice:inputs[2].value,
                unit:inputs[3].value,
            });
            return form;
    }  
    
}

export default FormVariable;