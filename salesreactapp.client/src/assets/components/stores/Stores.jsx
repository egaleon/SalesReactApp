import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Table } from 'react-bootstrap';
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


    useEffect(() => {
        console.log('currentIdToDelete: ', currentIdToDelete);
    }, [currentIdToDelete]);


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
            console.log('New store added:', response.data);
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
            console.log('Store updated:', response.data);
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
            console.log('Store deleted:', response.data);
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
    console.log('STORES -> ', stores);
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

    { /* Form handling */ }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentStore(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>{mode} store</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                <Button variant="success" onClick={() => handleStore(currentStore)}>
                    {mode} <AiOutlineCheck />
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Stores;