import { useState, useEffect } from 'react';
import axios from 'axios';
import TableBase from '../table/Table.jsx';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



var customersJson = {
    "customers": [
        {
            "Id": 1,
            "Name": "Hector",
            "Address": "100 Belmore Av, Sydney"
        },
        {
            "Id": 2,
            "Name": "Sofia",
            "Address": "101 Camalth St, Sydney"
        },
        {
            "Id": 3,
            "Name": "Jaime",
            "Address": "102 Bumanga St, Sydney"
        }
    ]
};

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const apiUrl = 'http://localhost:5071/api/customers';

    useEffect(() => {
        fetchCustomers();
    }, []);

    // GET: api/Customers
    const fetchCustomers = async () => {
        try {
            const response = await axios.get(apiUrl);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    // GET: api/Customers/{id}
    // PUT: api/Customers/{id}
    // POST: api/Customers
    // DELETE: api/Customers/{id}

    function onAddClick() {
        alert(`Add new Customer`);
    }
    function onEditClick(id) {
        alert(`Edit click ID: ${id}`);
    }
    function onDeleteClick(id) {
        alert(`Delete click ID: ${id}`);
    }

    return (
        <>
            <h6>Customers component</h6>
            <div>{customers && customers.toString()}</div>
            { /*
            <Button variant="primary" onClick={onAddClick}>New Customer</Button>
            <div className="u-separator-sm"></div>
            <TableBase props={customersJson.customers}
                colnames={['ID', 'Name', 'Address']}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}>
            </TableBase>
            */}
        </>
    );
}

export default Customers;
