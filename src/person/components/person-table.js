import React from "react";
import Table from "../../commons/tables/table";
import ReactTable from "react-table";


const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Age',
        accessor: 'age',
    },
    {
        Header: '',
        Cell: row => (
            <div>
                <button>Edit</button>
                <button>Delete</button>
            </div>
        )
    }
];

const filters = [

];

class PersonTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData
        };
    }

    render() {
        return (
            <ReactTable
                data={this.state.tableData}
                columns={columns}
                search={filters}
                pageSize={5}
            />
        )
    }
}

export default PersonTable;