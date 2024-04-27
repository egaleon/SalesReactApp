import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TableBase = ({ props, colnames, onEditClick, onDeleteClick }) => {

    console.log('props: ', props);
    console.log('cols: ', colnames);
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {colnames && colnames.map(colname => <th>{colname}</th>)}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {props && props.map(customer => (
                    <tr key={customer.Id}>
                        { Object.getOwnPropertyNames(customer).map(p => (
                            <td>{customer[p]}</td>
                        ))}
                        <td>
                            <Button variant="warning" onClick={() => onEditClick(customer.Id)}>Edit</Button>&nbsp;
                            <Button variant="danger" onClick={() => onDeleteClick(customer.Id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default TableBase;

