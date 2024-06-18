import { useEffect, useState } from 'react';
import { Button, Card, Nav, Tabs, Tab, Container, Row } from 'react-bootstrap';
import Customers from './assets/components/customers/Customers.jsx';
import Stores from './assets/components/stores/Stores.jsx';
import Products from './assets/components/products/Products.jsx';
import Sales from './assets/components/sales/Sales.jsx';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    const [currEntity, setCurrEntity] = useState("customers");
    return (
        <>
            <header className="sales-header">
                <Container>
                    <Nav
                        onSelect={(selectedKey) => setCurrEntity(selectedKey)}
                        defaultActiveKey="customers"
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="customers">Customers</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="stores">Stores</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="products">Products</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="sales">Sales</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Container>
            </header>            
            <Container>
                <section className="sales-mainsection">
                    {currEntity == "customers" && <Customers></Customers>}
                    {currEntity == "stores" && <Stores></Stores>}
                    {currEntity == "products" && <Products></Products>}
                    {currEntity == "sales" && <Sales></Sales>}
                </section>
            </Container>
        </>
    );
}

export default App;
