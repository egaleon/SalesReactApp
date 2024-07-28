import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap';
import { AiOutlineCheck, AiFillEdit, AiFillDelete } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '../Loader';
import DialogConfirmDelete from '../DialogConfirmDelete';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const newCustomer = { name: '', address: '' };
    const [addingCustomer, setAddingCustomer] = useState(false);
    const [currentEditCustomer, setCurrentEditCustomer] = useState(null);
    const [currentIdToDelete, setCurrentIdToDelete] = useState(-1); 
    const [editingCustomer, setEditingCustomer] = useState(false);
    const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false); 

    useEffect(() => {
        fetchCustomers();
    }, []);

    const apiUrl = 'https://salesapp-leon-avcedxb4hue3aqer.eastus-01.azurewebsites.net/api/customers';

    const fetchCustomers = async () => {
        setLoadingCustomers(true);
        try {
            const response = await axios.get(apiUrl);
            setCustomers(response.data);
            setLoadingCustomers(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setLoadingCustomers(false);
        }
    };

    { /*ADD NEW CUSTOMER BUTTON*/ }
    const handleAddModalOpen = () => setAddingCustomer(true);
    const handleAddModalClose = () => setAddingCustomer(false);
    
    { /*EDIT NEW CUSTOMER BUTTON*/ }
    function onEditClick(id) {
        setCurrentIdToDelete(id);
        setEditingCustomer(true);
        fetchCustomer(id);
    }
    const handleEditModalClose = () => setEditingCustomer(false);

    { /* DELETE CUSTOMER BUTTON*/ }
    function onDeleteClick(id) {
        setCurrentIdToDelete(id);
        setShowDialogConfirmDelete(true);
    }

    const handleConfirmDelete = () => {
        deleteCustomer(currentIdToDelete);
        handleCloseDialogConfirmDelete();
    };

    const handleCloseDialogConfirmDelete = () => {
        setCurrentIdToDelete(-1);
        setShowDialogConfirmDelete(false)
    };

    { /* CRUD HTTP METHODS */ }
    const handleAddCustomer = async (customer) => {
        try {
            const response = await axios.post(apiUrl, customer);
            fetchCustomers();
            handleAddModalClose();
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const fetchCustomer = async (id) => {
        try {
            const response = await axios.get(`${apiUrl}/${id}`);
            setCurrentEditCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer by ID:', error);
            throw error; 
        }
    };

    const handleUpdateCustomer = async (updatedCustomer) => {
        try {
            const response = await axios.put(`${apiUrl}/${updatedCustomer.id}`, updatedCustomer);
            fetchCustomers();
            handleEditModalClose();
            setCurrentEditCustomer(null);
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    const deleteCustomer = async (id) => {
        try {
            const response = await axios.delete(`${apiUrl}/${id}`);
            setCurrentIdToDelete(-1);
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    return (
        <div>
            {!loadingCustomers && (<Button className="sales-btn-add-new" onClick={handleAddModalOpen}>Add Customer</Button>)}            

            { /* Modal Adding */}
            {addingCustomer && (<ModalAddEdit showModal={addingCustomer}
                handleModalClose={handleAddModalClose}
                handleCustomer={handleAddCustomer}
                customer={newCustomer}
                mode="Create"
            >
            </ModalAddEdit>
            )}

            { /* Modal Editing */}
            { editingCustomer ? currentEditCustomer ? (
                <ModalAddEdit showModal={editingCustomer}
                    handleModalClose={handleEditModalClose}
                    handleCustomer={handleUpdateCustomer}
                    customer={currentEditCustomer}
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
                headerText='Delete customer'
            >

            </DialogConfirmDelete>

            {/* Render record list */}
            {loadingCustomers ? (<div><b><i>Getting customers ...</i></b></div>) : (
                !customers?.length ? (<div>There are no elements to be shown</div>) : (
                    <DataTable customers={customers}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}
                    ></DataTable>
                )
            )
            }
        </div>
    );
};

export default Customers;


const DataTable = ({ customers, onEditClick, onDeleteClick }) => {

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {customers.map(customer => (
                    <tr key={customer.id}>
                        <td>{customer.name}</td>
                        <td>{customer.address}</td>
                        <td>
                            <Button variant="warning" onClick={() => onEditClick(customer.id)}><AiFillEdit /> Edit</Button>&nbsp;
                            <Button variant="danger" onClick={() => onDeleteClick(customer.id)}><AiFillDelete /> Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
};


const ModalAddEdit = ({ showModal, handleModalClose, handleCustomer, customer, mode }) => {
    const [currentCustomer, setCurrentCustomer] = useState(customer);
    const [error, setError] = useState('');

    { /* Form handling */ }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentCustomer(prevState => ({
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
        handleCustomer(currentCustomer);
    };
    
    const validateForm = () => {
        const errors = [];
        const namePattern = /^[a-zA-Zà-öø-ÿÀ-ÖØ-ß\s'-]+$/;
        const addressPattern = /^[a-zA-Z0-9\s.,'/-]+$/;
        if (!currentCustomer.name) {
            errors.push('Name is required.');
        } else if (!namePattern.test(currentCustomer.name)) {
            errors.push('Incorrect name format.');
        }
        if (!currentCustomer.address) {
            errors.push('Address is required.');
        } else if (!addressPattern.test(currentCustomer.address)) {
            errors.push('Incorrect address format.');
        }
        return errors;
    };

    return (
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                <Modal.Title>{mode} customer</Modal.Title>
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
                            <Form.Control type="text" placeholder="Enter name" name="name" value={currentCustomer.name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter address" name="address" value={currentCustomer.address} onChange={handleChange} />
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
