import {useState, useCallback} from "react";
const useHttp = ()=>{
    const [isLoading,setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null); 

    const sendRequest = useCallback(async (requestConfig, addData)=>{
        setIsLoading(true);
        setIsError(null);
        try{
            const response = await fetch(requestConfig.url,{
                method:requestConfig.method ? requestConfig.method : 'Get',
                headers: requestConfig.headers ? requestConfig.headers : {},
                body : requestConfig.form ? JSON.stringify(requestConfig.form) : null,
            });

            if(!response.ok){
                throw new Error('Request Failed!');
            } 
            const data = await response.json();  
           
            addData(data);
        }catch(e){
            setIsError(e.message || 'Something went wrong'); 
                console.log(e)
        }
        // setIsLoading(false);
    },[])

    return {
        isLoading,
        isError, 
        sendRequest,
    }

}

export default useHttp;