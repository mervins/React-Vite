import Modal from "../../UI/Modal/Modal";
import classess from "./Delete.module.css";
import Button from "../../UI/Button/Button";

const Delete = (props)=>{

    const ondeleteHandler = ()=>{
        props.onDeleteHandler();
    }
    const onCancelHandler = () => {
        props.onCancelHandler()
    }

    return (
        <>
        <Modal >
            <div className={classess.delete}>
                <div>
                    <h2>Confirm</h2></div>
                <div>
                    {/* Are you sure you want to remove this supplier? */}
                    {props.message}
                </div>
                <br/>
                <div className={classess.deleteBtn}>
                    <div onClick={onCancelHandler}>
                        <Button>Cancel</Button></div> 
                    <div onClick={ondeleteHandler}>
                        <Button>Continue</Button></div>
                    </div>
            </div>
        </Modal>
        </>
    )
}

export default Delete;