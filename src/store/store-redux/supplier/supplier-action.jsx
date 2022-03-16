import { supplierActions } from "./supplier-slice";  
// import useHttp from "../../../hook/use-http";
export const fetchSuppleirData = ()=>{
    return async(dispatch) => {  
        //  const {sendRequest} = useHttp();
        // const response = await fetch(
        //     'http://127.0.0.1:3329/api/supplier'
        //   );
        // // sendRequest({url:`http://127.0.0.1:3329/api/supplier`},getSupplier); 
        // const items =  await response.json()
        // // const getSupplier = ( data) => {
        //     dispatch(supplierActions.replaceItem({items:items || []}))
        // // }

        const fetchData = async () => { 
            const response = await fetch(
                'http://127.0.0.1:3329/api/supplier'
            );
      
            if (!response.ok) {
              throw new Error('Could not fetch cart data!');
            }
      
            const data = await response.json();
      
            return data;
          };

          const cartData = await fetchData();
          console.log(cartData)
          dispatch(
            supplierActions.replaceItem({
              items: cartData || [], 
            })
          );
    }
}