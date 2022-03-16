import { Fragment,useState,useEffect } from "react"
import ReactDOM from "react-dom";
import classes from './Modal.module.css'; 
import { IoCloseCircleSharp } from "react-icons/io5";

const Backdrop = (props)=>{
    const divStyle = {
        zIndex: props.zIndex, 
      };
    return <div className={classes.backdrop} style={divStyle}></div>
}

const ModalOverlay = (props) =>{
    const sizeWidth = !props.withSize ? classes.modalSm : classes.modalLg; // if null the value use the default size
    const showIcon = !props.withSize ? '' : classes.closeIcon; // if not null the value show the x icon else use the override in other components
    return <div className={` ${classes.modal}  ${sizeWidth}`}>
                <div className={showIcon} onClick={()=>{props.onClose(false)}}>{showIcon && <IoCloseCircleSharp/>}</div>
                <div>{props.children}</div>
            </div>
 
}
const portalElement = document.getElementById("backdrop")

const Modal = (props)=>{
    const [domReady, setDomReady] = useState(false) 
    useEffect(() => {
        setDomReady(true)
    })
    return (
        domReady ?
        <Fragment>   
                {ReactDOM.createPortal(<Backdrop zIndex={props.zIndex}></Backdrop>,portalElement)}
                {ReactDOM.createPortal(<ModalOverlay withSize={props.withSize} onClose={props.onClose}>{props.children}</ModalOverlay>,portalElement)} 
        </Fragment>
        : null
    )
}

export default Modal;