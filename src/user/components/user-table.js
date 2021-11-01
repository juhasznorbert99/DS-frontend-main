import React from "react";
import Table from "../../commons/tables/table";

const columns = [
    {
        Header: 'Username',
        accessor: 'username',
    },
    {
        Header: 'Password',
        accessor: 'password',
    },
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Address',
        accessor: 'address',
    },
    {
        Header: 'BirthDay',
        accessor: 'birthDay',
    },
    {
        Header: 'Token',
        accessor: 'token',
    },
    {
        Header: 'Role',
        accessor: 'role',
    }
];

const filters = [

];

class Userble extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData
        };
    }

    render() {
        return (
            <Table
                data={this.state.tableData}
                columns={columns}
                search={filters}
                pageSize={5}
            />
        )
    }
}
export default UserTable;