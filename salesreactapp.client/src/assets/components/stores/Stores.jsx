import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap';
import { AiOutlineCheck, AiFillEdit, AiFillDelete } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '../Loader';
import DialogConfirmDelete from '../DialogConfirmDelete';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const newStore = { name: '', address: '' };
    const [addingStore, setAddingStore] = useState(false);
    const [currentEditStore, setCurrentEditStore] = useState(null);
    const [currentIdToDelete, setCurrentIdToDelete] = useState(-1);
    const [editingStore, setEditingStore] = useState(false);
    const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false);

    useEffect(() => {
        fetchStores();
    }, []);

    const apiUrl = 'http://localhost:5071/api/stores';

    const fetchStores = async () => {
        try {
            const response = await axios.get(apiUrl);
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    { /*ADD NEW STORE BUTTON*/ }
    const handleAddModalOpen = () => setAddingStore(true);
    const handleAddModalClose = () => setAddingStore(false);

    { /*EDIT NEW STORE BUTTON*/ }
    function onEditClick(id) {
        setCurrentIdToDelete(id);
        setEditingStore(true);
        fetchStore(id);
    }
    const handleEditModalClose = () => setEditingStore(false);

    { /* DELETE STORE BUTTON*/ }
    function onDeleteClick(id) {
        setCurrentIdToDelete(id);
        setShowDialogConfirmDelete(true);
    }

    const handleConfirmDelete = () => {
        deleteStore(currentIdToDelete);
        handleCloseDialogConfirmDelete();
    };

    const handleCloseDialogConfirmDelete = () => {
        setCurrentIdToDelete(-1);
        setShowDialogConfirmDelete(false)
    };

    { /* CRUD HTTP METHODS */ }
    const handleAddStore = async (store) => {
        try {
            const response = await axios.post(apiUrl, store);
            fetchStores();
            handleAddModalClose();
        } catch (error) {
            console.error('Error adding store:', error);
        }
    };

    const fetchStore = async (id) => {
        try {
            const response = await axios.get(`${apiUrl}/${id}`);
            setCurrentEditStore(response.data);
        } catch (error) {
            console.error('Error fetching store by ID:', error);
            throw error;
        }
    };

    const handleUpdateStore = async (updatedStore) => {
        try {
            const response = await axios.put(`${apiUrl}/${updatedStore.id}`, updatedStore);
            fetchStores();
            handleEditModalClose();
            setCurrentEditStore(null);
        } catch (error) {
            console.error('Error updating store:', error);
        }
    };

    const deleteStore = async (id) => {
        try {
            const response = await axios.delete(`${apiUrl}/${id}`);
            setCurrentIdToDelete(-1);
            fetchStores();
        } catch (error) {
            console.error('Error deleting store:', error);
        }
    };

    return (
        <div>
            <Button className="sales-btn-add-new" onClick={handleAddModalOpen}>Add Store</Button>

            { /* Modal Adding */}
            {addingStore && (<ModalAddEdit showModal={addingStore}
                handleModalClose={handleAddModalClose}
                handleStore={handleAddStore}
                store={newStore}
                mode="Create"
            >
            </ModalAddEdit>
            )}

            { /* Modal Editing */}
            {editingStore ? currentEditStore ? (
                <ModalAddEdit showModal={editingStore}
                    handleModalClose={handleEditModalClose}
                    handleStore={handleUpdateStore}
                    store={currentEditStore}
                    mode="Edit"
                >
                </ModalAddEdit>
            ) : (
                <Loader></Loader>
            ) : null
            }

            {/* Delete Dialog */}
            <DialogConfirmDelete
                show={showDialogConfirmDelete}
                handleClose={handleCloseDialogConfirmDelete}
                handleConfirm={handleConfirmDelete}
                headerText='Delete store'
            >

            </DialogConfirmDelete>

            {/* Render record list */
                !stores?.length ? (<div>There are no elements to be shown</div>): (
                    <DataTable stores = { stores }
                onEditClick = { onEditClick }
                onDeleteClick = { onDeleteClick }
                ></DataTable>)
            }
        </div>
    );
};

const DataTable = ({ stores, onEditClick, onDeleteClick }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {stores.map(store => (
                    <tr key={store.id}>
                        <td>{store.id}</td>
                        <td>{store.name}</td>
                        <td>{store.address}</td>
                        <td>
                            <Button variant="warning" onClick={() => onEditClick(store.id)}><AiFillEdit /> Edit</Button>&nbsp;
                            <Button variant="danger" onClick={() => onDeleteClick(store.id)}><AiFillDelete /> Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
};


const ModalAddEdit = ({ showModal, handleModalClose, handleStore, store, mode }) => {
    const [currentStore, setCurrentStore] = useState(store);
    const [error, setError] = useState('');

    { /* Form handling */ }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentStore(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        const errorMsg = validateForm();
        if (errorMsg.length > 0) {
            setError(errorMsg);
            return;
        }
        setError('');
        handleStore(currentStore);
    };

    const validateForm = () => {
        const errors = [];
        const namePattern = /^[a-zA-Z0-9\s.'-]+$/;
        const addressPattern = /^[a-zA-Z0-9\s.,'/-]+$/;
        if (!currentStore.name) {
            errors.push('Name is required.');
        } else if (!namePattern.test(currentStore.name)) {
            errors.push('Incorrect name format.');
        }
        if (!currentStore.address) {
            errors.push('Address is required.');
        } else if (!addressPattern.test(currentStore.address)) {
            errors.push('Incorrect address format.');
        }
        return errors;
    };

    return (
        <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>{mode} store</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error.length > 0 && (
                    <Alert variant="danger">
                        <ul className="sales-error-messages">
                            {error.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </Alert>
                )}
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" name="name" value={currentStore.name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter address" name="address" value={currentStore.address} onChange={handleChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleModalClose}>
                    Close
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                    {mode} <AiOutlineCheck />
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Stores;