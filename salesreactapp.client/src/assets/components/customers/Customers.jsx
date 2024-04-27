import React from 'react';
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
            <Button variant="primary" onClick={onAddClick}>New Customer</Button>
            <div className="u-separator-sm"></div>
            <TableBase props={customersJson.customers}
                colnames={['ID', 'Name', 'Address']}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}>
            </TableBase>
        </>
    );
}

export default Customers;
