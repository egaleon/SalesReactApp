import { Button, Modal } from 'react-bootstrap';
import { AiOutlineClose } from "react-icons/ai";

const DialogConfirmDelete = ({ show, handleClose, handleConfirm, headerText }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{headerText}</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure?</Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleClose}>
                    cancel
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                    delete <AiOutlineClose />
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DialogConfirmDelete;