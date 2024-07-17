import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap';
import { AiOutlineCheck, AiFillEdit, AiFillDelete } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '../Loader';
import DialogConfirmDelete from '../DialogConfirmDelete';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const newSale = { customerId: '', productId: '', storeId: '', dateSold: '' };
    //const [newSale, setNewSale] = useState();
    /*....*/
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const apiUrl = 'http://localhost:5071/api';
    const salesApiUrl = `${apiUrl}/sales`;
    const customersApiUrl = `${apiUrl}/customers`;
    const productsApiUrl = `${apiUrl}/products`;
    const storesApiUrl = `${apiUrl}/stores`;
    /*....*/
    const [addingSale, setAddingSale] = useState(false);
    const [currentEditSale, setCurrentEditSale] = useState(null);
    const [currentIdToDelete, setCurrentIdToDelete] = useState(-1);
    const [editingSale, setEditingSale] = useState(false);
    const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false);

    useEffect(() => {
        fetchSales();
        fetchCustomers();
        fetchProducts();
        fetchStores();
    }, []);

    { /* CRUD HTTP METHODS */ }
    const fetchSales = async () => {
        try {
            const response = await axios.get(salesApiUrl);
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(customersApiUrl);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(productsApiUrl);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchStores = async () => {
        try {
            const response = await axios.get(storesApiUrl);
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    const handleAddSale = async (sale) => {
        try {
            const response = await axios.post(salesApiUrl, sale);
            fetchSales();
            handleAddModalClose();
        } catch (error) {
            console.error('Error adding sale:', error);
        }
    };

    const fetchSale = async (id) => {
        try {
            const response = await axios.get(`${salesApiUrl}/${id}`);
            setCurrentEditSale(response.data);
        } catch (error) {
            console.error('Error fetching sale by ID:', error);
            throw error;
        }
    };

    const handleUpdateSale = async (updatedSale) => {
        try {
            const response = await axios.put(`${salesApiUrl}/${updatedSale.id}`, updatedSale);
            fetchSales();
            handleEditModalClose();
            setCurrentEditSale(null);
        } catch (error) {
            console.error('Error updating sale:', error);
        }
    };

    const deleteSale = async (id) => {
        try {
            const response = await axios.delete(`${salesApiUrl}/${id}`);
            setCurrentIdToDelete(-1);
            fetchSales();
        } catch (error) {
            console.error('Error deleting sale:', error);
        }
    };

    { /*ADD NEW SALE BUTTON*/ }
    const handleAddModalOpen = () => setAddingSale(true);
    const handleAddModalClose = () => setAddingSale(false);

    { /*EDIT EDIT SALE BUTTON*/ }
    function onEditClick(id) {
        setCurrentIdToDelete(id);
        setEditingSale(true);
        fetchSale(id);
    }
    const handleEditModalClose = () => setEditingSale(false);

    { /* DELETE SALE BUTTON*/ }
    function onDeleteClick(id) {
        setCurrentIdToDelete(id);
        setShowDialogConfirmDelete(true);
    }

    const handleConfirmDelete = () => {
        deleteSale(currentIdToDelete);
        handleCloseDialogConfirmDelete();
    };

    const handleCloseDialogConfirmDelete = () => {
        setCurrentIdToDelete(-1);
        setShowDialogConfirmDelete(false)
    };
    
    /* Rendering */
    return (
        <div>
            <Button className="sales-btn-add-new" onClick={handleAddModalOpen}>Add Sale</Button>

            { /* Modal Adding */}
            {addingSale && (<ModalAddEdit showModal={addingSale}
                handleModalClose={handleAddModalClose}
                handleSale={handleAddSale}
                sale={newSale}
                customers={customers}
                products={products}
                stores={stores}
                mode="Create"
            >
            </ModalAddEdit>
            )}

            { /* Modal Editing */}
            {editingSale ? currentEditSale ? (
                <ModalAddEdit showModal={editingSale}
                    handleModalClose={handleEditModalClose}
                    handleSale={handleUpdateSale}
                    sale={currentEditSale}
                    customers={customers}
                    products={products}
                    stores={stores}
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
                headerText='Delete sale'
            >

            </DialogConfirmDelete>

            {/* Render record list */
                !sales?.length ? (<div>There are no elements to be shown</div>) : (
                    <DataTable sales={sales}
                        customers={customers}
                        products={products}
                        stores={stores}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}
                    ></DataTable>
                )}
        </div>
    );
};

export default Sales;


const DataTable = ({ sales, customers, products, stores, onEditClick, onDeleteClick }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getCustomerName = (id) => {
        const customer = customers.find(cust => cust.id === id);
        return customer ? customer.name : 'Unknown';
    };

    const getProductName = (id) => {
        const product = products.find(prod => prod.id === id);
        return product ? product.name : 'Unknown';
    };

    const getStoreName = (id) => {
        const store = stores.find(stor => stor.id === id);
        return store ? store.name : 'Unknown';
    };

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Date Sold</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Store</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {sales.map(sale => (
                    <tr key={sale.id}>
                        <td>{formatDate(sale.dateSold)}</td>
                        <td>{getCustomerName(sale.customerId)}</td>
                        <td>{getProductName(sale.productId)}</td>
                        <td>{getStoreName(sale.storeId)}</td>
                        <td>
                            <Button variant="warning" onClick={() => onEditClick(sale.id)}><AiFillEdit /> Edit</Button>&nbsp;
                            <Button variant="danger" onClick={() => onDeleteClick(sale.id)}><AiFillDelete /> Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
};


const ModalAddEdit = ({ showModal, handleModalClose, handleSale, sale, customers, products, stores, mode }) => {
    { /* Date format */ }
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [currentSale, setCurrentSale] = useState({
        ...sale,
        dateSold: sale ? formatDateForInput(sale.dateSold) : ''
    });

    const [error, setError] = useState('');

    { /* Form handling */ }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSale(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateDateFormat = (date) => {
        const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        return datePattern.test(date);
    };

    const validateForm = () => {
        const errors = [];
        if (!currentSale.dateSold || currentSale.dateSold === 'NaN-NaN-NaN') {
            errors.push('Date sold is required.');
        } else if (!validateDateFormat(currentSale.dateSold)) {
            errors.push('Date sold must be in format yyyy-mm-dd.');
        }
        if (!currentSale.customerId) {
            errors.push('Customer is required.');
        }
        if (!currentSale.productId) {
            errors.push('Product is required.');
        }
        if (!currentSale.storeId) {
            errors.push('Store is required.');
        }

        return errors;
    };


    const handleSubmit = () => {
        const errorMsg = validateForm();
        if (errorMsg.length > 0) {
            setError(errorMsg);
            return;
        }
        setError('');
        handleSale(currentSale);
    };

    return (
        <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>{mode} sale</Modal.Title>
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
                    <Form.Group controlId="formDateSold">
                        <Form.Label>Date sold</Form.Label>
                        <Form.Control
                            type="date"
                            name="dateSold"
                            value={currentSale.dateSold}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCustomerId">
                        <Form.Label>Customer</Form.Label>
                        <Form.Control
                            as="select"
                            name="customerId"
                            value={currentSale.customerId}
                            onChange={handleChange}>
                            <option value="" disabled>Select Customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formProductId">
                        <Form.Label>Product</Form.Label>
                        <Form.Control
                            as="select"
                            name="productId"
                            value={currentSale.productId}
                            onChange={handleChange}>
                            <option value="">Select Product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formStoreId">
                        <Form.Label>Store</Form.Label>
                        <Form.Control
                            as="select"
                            name="storeId"
                            value={currentSale.storeId}
                            onChange={handleChange}>
                            <option value="">Select Store</option>
                            {stores.map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </Form.Control>
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
