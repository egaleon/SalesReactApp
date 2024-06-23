import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { AiOutlineCheck, AiFillEdit, AiFillDelete } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '../Loader';
import DialogConfirmDelete from '../DialogConfirmDelete';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const newCustomer = { name: '', address: '' };
    const [addingCustomer, setAddingCustomer] = useState(false);
    const [currentEditCustomer, setCurrentEditCustomer] = useState(null);
    const [currentIdToDelete, setCurrentIdToDelete] = useState(-1); 
    const [editingCustomer, setEditingCustomer] = useState(false);
    const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false); 

    useEffect(() => {
        fetchCustomers();
    }, []);


    useEffect(() => {
        console.log('currentIdToDelete: ', currentIdToDelete);
    }, [currentIdToDelete]);


    const apiUrl = 'http://localhost:5071/api/customers';

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(apiUrl);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
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
            console.log('New customer added:', response.data);
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
            console.log('Customer updated:', response.data);
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
            console.log('Customer deleted:', response.data);
            setCurrentIdToDelete(-1);
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    return (
        <div>
            <Button className="sales-btn-add-new" onClick={handleAddModalOpen}>Add Customer</Button>

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
            <DataTable customers={customers}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
            ></DataTable>
        </div>
    );
};

export default Customers;


const DataTable = ({ customers, onEditClick, onDeleteClick }) => {

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
                {customers.map(customer => (
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
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
    
    { /* Form handling */ }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentCustomer(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                <Modal.Title>{mode} customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    <Button variant="success" onClick={() => handleCustomer(currentCustomer)}>
                        {mode} <AiOutlineCheck />
                    </Button>
                </Modal.Footer>
            </Modal>
    );        
}
