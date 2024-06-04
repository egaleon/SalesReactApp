import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { AiOutlineCheck } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';


const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const newCustomer = { name: '', address: '' };
    const [addingCustomer, setAddingCustomer] = useState(false);

    const [currentEditCustomer, setCurrentEditCustomer] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);


    useEffect(() => {
        console.log('currentEditCustomer: ',currentEditCustomer);
    }, [currentEditCustomer]);


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
        alert(`Edit click ID: ${id}`);
        setEditingCustomer(true);
        fetchCustomer(id);
    }
    const handleEditModalClose = () => setEditingCustomer(false);

    function onDeleteClick(id) {
        alert(`Delete click ID: ${id}`);
    }

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


    return (
        <div>
            <Button className="sales-btn-add-new" onClick={handleAddModalOpen}>Add Customer</Button>
            { /* Modal Adding */
                addingCustomer && 
                <ModalAddEdit showModal={addingCustomer}
                    handleModalClose={handleAddModalClose}
                    handleCustomer={handleAddCustomer}
                    customer={newCustomer}
                >
                </ModalAddEdit>
            }

            { /* Modal Editing */}

            { editingCustomer ? currentEditCustomer ? (
                <ModalAddEdit showModal={editingCustomer}
                    handleModalClose={handleEditModalClose}
                    handleCustomer={handleUpdateCustomer}
                    customer={currentEditCustomer}
                >
                </ModalAddEdit>
                ) : (
                    <Loader></Loader>
                ) : null
            }

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
                            <Button variant="warning" onClick={() => onEditClick(customer.id)}>Edit</Button>&nbsp;
                            <Button variant="danger" onClick={() => onDeleteClick(customer.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
};


const ModalAddEdit = ({ showModal, handleModalClose, handleCustomer, customer }) => {
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
                    <Modal.Title>Add New Customer</Modal.Title>
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
                        Create <AiOutlineCheck />
                    </Button>
                </Modal.Footer>
            </Modal>
    );        
}


const Loader = () => {
    return (
        <div className="sales-loader">
            <Spinner animation="border" />&#160;&#160; L O A D I N G ...
        </div>
    );
}
