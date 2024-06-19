import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { AiOutlineCheck, AiFillEdit, AiFillDelete } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '../Loader';
import DialogConfirmDelete from '../DialogConfirmDelete';

const Products = () => {
    const [products, setProducts] = useState([]);
    const newProduct = { name: '', price: '' };
    const [addingProduct, setAddingProduct] = useState(false);
    const [currentEditProduct, setCurrentEditProduct] = useState(null);
    const [currentIdToDelete, setCurrentIdToDelete] = useState(-1);
    const [editingProduct, setEditingProduct] = useState(false);
    const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);


    useEffect(() => {
        console.log('currentIdToDelete: ', currentIdToDelete);
    }, [currentIdToDelete]);


    const apiUrl = 'http://localhost:5071/api/products';

    const fetchProducts = async () => {
        try {
            const response = await axios.get(apiUrl);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
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
            console.log('New product added:', response.data);
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
            console.log('Product updated:', response.data);
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
            console.log('Product deleted:', response.data);
            setCurrentIdToDelete(-1);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div>
            <Button className="sales-btn-add-new" onClick={handleAddModalOpen}>Add Product</Button>
            <ModalAddEdit showModal={addingProduct}
                handleModalClose={handleAddModalClose}
                handleProduct={handleAddProduct}
                product={newProduct}
                mode="Create"
            >
            </ModalAddEdit>

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
            <DataTable products={products}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
            ></DataTable>
        </div>
    );
};


const DataTable = ({ products, onEditClick, onDeleteClick }) => {

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
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

    { /* Form handling */ }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>{mode} product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                <Button variant="success" onClick={() => handleProduct(currentProduct)}>
                    {mode} <AiOutlineCheck />
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Products;