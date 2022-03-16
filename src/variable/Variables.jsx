import { ACTION } from "../Pages/Customer/Cutomer";

export const CATEGORY_NAME = ["Supplier","Customer","Track","Product"]
export const CATEGORY_TYPE = ["SupAndCus","SupAndCus","Track","Product"]

const track = [{
    id:0,
    type:"text",
    label:"Driver", 
    value:''
},{
    id:1,
    type:"number",
    label:"Contact",  
    value:''
},{
    id:2,
    type:"text",
    label:"Agent",  
    value:''
},{
    id:3,
    type:"text",
    label:"Plate Number",  
    value:''
}]
const formSupAndCus = [{
    id:0,
    type:"text",
    label:"Name", 
    value:''
},{
    id:1,
    type:"number",
    label:"Contact",  
    value:''
},{
    id:2,
    type:"text",
    label:"Address",  
    value:''
}]

let product = [{
    id:0,
    type:"text",
    label:"Description", 
    value:'', 
},{
    id:1,
    type:"number",
    label:"Price",  
    value:'',  
},{
    id:2,
    type:"number",
    label:"Selling Price",  
    value:'', 
},{
    id:3,
    type:"text",
    label:"Unit",  
    value:'', 
}
]

const FormName = (category,status,item) =>{   
    switch(category){
        case 'SupAndCus':
            if(status === ACTION.ACTION_EDIT){ //use edit
                formSupAndCus[0].value = item.name;
                formSupAndCus[1].value = item.contact;
                formSupAndCus[2].value = item.address;
            }
            return formSupAndCus;
        case 'Track':
            if(status === ACTION.ACTION_EDIT){ //use edit
                track[0].value = item.driver;
                track[1].value = item.contact;
                track[2].value = item.agent; 
                track[3].value = item.plate_number; 
            }
            return track;
        case 'Product':
            if(status === ACTION.ACTION_FETCH){ //use edit
                product[0].value = item.description || '';
                product[1].value = item.price || '';
                product[2].value = item.sellingprice || ''; 
                product[3].value = item.unit || ''; 
            }
            return product;
    } 
}

export default FormName;