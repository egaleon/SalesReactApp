import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap';
import { AiOutlineCheck, AiFillEdit, AiFillDelete } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '../Loader';
import DialogConfirmDelete from '../DialogConfirmDelete';

const Products = () => {
    const newProduct = { name: '', price: '' };
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [currentEditProduct, setCurrentEditProduct] = useState(null);
    const [currentIdToDelete, setCurrentIdToDelete] = useState(-1);
    const [addingProduct, setAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(false);
    const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false);
 
    useEffect(() => {
        fetchProducts();
    }, []);

    const apiUrl = 'https://salesapp-leon-avcedxb4hue3aqer.eastus-01.azurewebsites.net/api/products';

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await axios.get(apiUrl);
            setProducts(response.data);
            setLoadingProducts(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoadingProducts(false);
        }
    };

    { /*ADD NEW PRODUCT BUTTON*/ }
    const handleAddModalOpen = () => setAddingProduct(true);
    const handleAddModalClose = () => setAddingProduct(false);

    { /*EDIT NEW PRODUCT BUTTON*/ }
    function onEditClick(id) {
        setCurrentIdToDelete(id);
        setEditingProduct(true);
        fetchProduct(id);
    }
    const handleEditModalClose = () => setEditingProduct(false);

    { /* DELETE PRODUCT BUTTON*/ }
    function onDeleteClick(id) {
        setCurrentIdToDelete(id);
        setShowDialogConfirmDelete(true);
    }

    const handleConfirmDelete = () => {
        deleteProduct(currentIdToDelete);
        handleCloseDialogConfirmDelete();
    };

    const handleCloseDialogConfirmDelete = () => {
        setCurrentIdToDelete(-1);
        setShowDialogConfirmDelete(false)
    };

    { /* CRUD HTTP METHODS */ }
    const handleAddProduct = async (product) => {
        try {
            const response = await axios.post(apiUrl, product);
            fetchProducts();
            handleAddModalClose();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const fetchProduct = async (id) => {
        try {
            const response = await axios.get(`${apiUrl}/${id}`);
            setCurrentEditProduct(response.data);
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            throw error;
        }
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            const response = await axios.put(`${apiUrl}/${updatedProduct.id}`, updatedProduct);
            fetchProducts();
            handleEditModalClose();
            setCurrentEditProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await axios.delete(`${apiUrl}/${id}`);
            setCurrentIdToDelete(-1);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div>
            {!loadingProducts && (<Button className="sales-btn-add-new" onClick={handleAddModalOpen}>Add Product</Button>)}
            
            {addingProduct && (
                <ModalAddEdit showModal={addingProduct}
                    handleModalClose={handleAddModalClose}
                    handleProduct={handleAddProduct}
                    product={newProduct}
                    mode="Create"
                >
                </ModalAddEdit>
                )
            }

            { /* Modal Editing */}
            {editingProduct ? currentEditProduct ? (
                <ModalAddEdit showModal={editingProduct}
                    handleModalClose={handleEditModalClose}
                    handleProduct={handleUpdateProduct}
                    product={currentEditProduct}
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
                headerText='Delete product'
            >
            </DialogConfirmDelete>


            {/* Render record list */}
            {loadingProducts ? (<div><b><i>Getting Products ...</i></b></div>) : (
                !products?.length ? (<div>There are no elements to be shown</div>) : (
                    <DataTable products={products}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}
                    ></DataTable>
                )
            )
            }
        </div>
    );
};


const DataTable = ({ products, onEditClick, onDeleteClick }) => {

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>
                            <Button variant="warning" onClick={() => onEditClick(product.id)}><AiFillEdit /> Edit</Button>&nbsp;
                            <Button variant="danger" onClick={() => onDeleteClick(product.id)}><AiFillDelete /> Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
};


const ModalAddEdit = ({ showModal, handleModalClose, handleProduct, product, mode }) => {
    const [currentProduct, setCurrentProduct] = useState(product);
    const [error, setError] = useState('');

    { /* Form handling */ }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prevState => ({
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
        handleProduct(currentProduct);
    };

    const validateForm = () => {
        const errors = [];
        const namePattern =/[a-zA-Z0-9\s._'-]/;
        if (!currentProduct.name) {
            errors.push('Name is required.');
        } else if (!namePattern.test(currentProduct.name)) {
            errors.push('Incorrect name format.');
        }
        if (!currentProduct.price) {
            errors.push('Price is required.');
        }
        return errors;
    };

    return (
        <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>{mode} product</Modal.Title>
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
                        <Form.Control type="text" placeholder="Enter name" name="name" value={currentProduct.name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" placeholder="Enter price" name="price" value={currentProduct.price} onChange={handleChange} />
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

export default Products;
