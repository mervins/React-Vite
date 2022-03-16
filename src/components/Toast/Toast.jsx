import React,{Fragment,useState, useEffect} from "react";
import "./Toast.css";

export const toastProperties = (type,message,title)=>{
    let toastProperties = null;
    switch(type) {
        case 'success':
            return toastProperties = {
                id:1,
                title: title,
                description: message,
                backgroundColor: '#5cb85c',
                // icon: checkIcon
            } 
        case 'danger':
            return toastProperties = {
                id:2,
                title: title,
                description: message,
                backgroundColor: '#d9534f',
                //icon: errorIcon
            } 
        case 'info':
            return toastProperties = {
                id:3,
                title: title,
                description: message,
                backgroundColor: '#5bc0de',
                //icon: infoIcon
            } 
        case 'warning':
            return toastProperties = {
                id:4,
                title: title,
                description: message,
                backgroundColor: '#f0ad4e',
                // icon: warningIcon
            } 
        default:
            return [];
    }
}

const Toast = (props)=>{
    const { toastList, position } = props;
    const [list, setList] = useState(toastList);

    useEffect(() => {
        setList([...toastList]);
    }, [toastList]);

    useEffect(() => {
        const interval = setInterval(() => {
            if ( toastList.length && list.length) {
                deleteToast(toastList[0].id);
            }
        }, 800);
        
        return () => {
            clearInterval(interval);
        }

        // eslint-disable-next-line
    }, [toastList, list]);

    const deleteToast = id => {
        const listItemIndex = list.findIndex(e => e.id === id);
        const toastListItem = toastList.findIndex(e => e.id === id);
        list.splice(listItemIndex, 1);
        toastList.splice(toastListItem, 1);
        setList([...list]);
    }

    const listItem = list.map((toast, i) =>    {
                return (<div key={i} className={`notification toast ${position}`} style={{ backgroundColor: toast.backgroundColor }}>
                 
                    {/* <div className="notification-image">
                        <img src={toast.icon} alt="" />
                    </div> */}
                    <div>
                    <p className="notification-title">{toast.title}</p>
                                <p className="notification-message">
                                    {toast.description}
                                </p>
                    </div>
                </div>)
            }        
         )
    
    return (
        <Fragment>
            <div className={`notification-container ${position}`}>
               {listItem} 
            </div>
        </Fragment>
    )
}

export default Toast;