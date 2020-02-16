import React, { Component } from "react";
import axios from "../../axios";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import ResultTable from "../../containers/ResultTable/ResultTable";
import DeleteModal from "../../containers/Modals/DeleteModal/DeleteModal";
import AddModal from "../../containers/Modals/AddModal/AddModal";
import EditModal from "../../containers/Modals/EditModal/EditModal";
import { enterPressHandler } from "../../helpers";

class Chinook extends Component {
  constructor(props) {
    super(props);
    this.enterPressHandler = enterPressHandler.bind(this);
    this.state = {
      tables: [],
      selectedTable: "",
      columns: [],
      selectedColumn: "",
      searchString: "",
      results: [],
      lastEntryDeleted: false,
      showDeleteModal: false,
      deletedEntryId: null,
      showAddModal: false,
      tableColumns: null,
      showEditModal: false,
      editEntryData: null,
      error: null
    };
  }

  componentDidMount() {
    console.log("chinook did mount");
    this.getTables();
  }

  componentWillUnmount() {
    console.log("chinook will unmount");
  }

  getTables = () => {
    axios
      .get("chinook/tables")
      .then(res => {
        this.setState({
          tables: res.data,
          selectedTable: res.data[0]
        });
      })
      .then(() => {
        this.getColumns(this.state.selectedTable);
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("getTables error", err);
      });
  };

  getColumns = table => {
    axios
      .get(`chinook/${table}`)
      .then(res => {
        this.setState({
          columns: res.data,
          selectedColumn: res.data[0]
        });
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("getColumns error", err);
      });
  };

  getResults = () => {
    const table = this.state.selectedTable;
    const column = this.state.selectedColumn;
    const string = this.state.searchString;

    axios
      .get(`chinook/${table}/${column}/${string}`)
      .then(res => {
        if (res.data) {
          this.setState({ results: res.data });
        } else {
          this.setState({
            error: true
          });
        }
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("getResults error", err);
      });
  };

  deleteEntryByIdHandler = id => {
    const table = this.state.selectedTable;
    const column = this.state.columns[0];
    axios
      .delete(`chinook/${table}/${column}/${id}`)
      .then(res => {
        if (res.status === 200) {
          // remove deleted entry from results to update state and cause re-render
          // clone results
          const oldResults = [...this.state.results];
          const newResults = [...this.state.results];
          // find index of deleted entry object within an array
          const index = oldResults.findIndex(e => e[Object.keys(e)[0]] === id);
          // mutate results array and remove deleted entry
          newResults.splice(index, 1);
          // check if last invoice is entry
          if (newResults.length > 0) {
            this.setState({ results: newResults });
          } else {
            this.setState({ lastEntryDeleted: true });
          }
          this.setState({ showDeleteModal: true, deletedEntryId: id });
        } else {
          alert(`Response status is ${res.status}`);
        }
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("deleteEntryByIdHandler error", err);
      });
  };

  tableSelectionHandler = e => {
    const table = e.target.value;
    this.setState({ selectedTable: table });
    this.getColumns(table);
  };

  columnSelectionHandler = e => {
    this.setState({ selectedColumn: e.target.value });
  };

  stringChangeHandler = e => {
    this.setState({ searchString: e.target.value });
  };

  modalCloseHandler = () => {
    this.setState({
      showDeleteModal: false,
      showAddModal: false,
      showEditModal: false
    });
  };

  showAddModalHandler = table => {
    if (this.state.selectedTable) {
      axios
        .get(`/chinook/${table}`)
        .then(res => {
          // convert received array of table columns to object
          const tableColumnsObject = res.data.reduce(
            (el, key) => Object.assign(el, { [key]: "" }),
            {}
          );
          this.setState({ tableColumns: tableColumnsObject });
        })
        .then(() => {
          this.setState({ showAddModal: true });
        });
    } else {
      alert("no table selected");
    }
  };

  addEntryHandler = newEntry => {
    axios
      .post(`/chinook/add/${this.state.selectedTable}`, { newEntry })
      .then(res => {
        if (res.status === 200) {
          alert(res.data.msg);
        } else {
          alert("Something bad happened");
        }
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("addEntryHandler error", err);
      });
  };

  getEntryDataHandler = id => {
    axios
      .get(
        `chinook/edit/${this.state.selectedTable}/${this.state.columns[0]}/${id}`
      )
      .then(res => {
        if (res.status === 200) {
          this.setState({ editEntryData: res.data });
        } else {
          alert("Something bad happened");
        }
      })
      .then(() => {
        this.setState({ showEditModal: true });
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("getEntryDataHandler error", err);
      });
  };

  updateEntryDataHandler = data => {
    axios
      .put(
        `chinook/edit/${this.state.selectedTable}/${
          data[Object.keys(data)[0]]
        }`,
        { entryData: data }
      )
      .then(res => {
        if (res.status === 200) {
          alert(res.data.msg);
          this.modalCloseHandler();
        } else {
          alert(res.data.msg);
        }
      })
      .then(() => {
        this.getResults();
      });
  };

  render() {
    let results = null;

    if (this.state.results.length !== 0) {
      results = (
        <ResultTable
          data={this.state.results}
          // pass deleteEntryByIdHandler function to results table, delete button
          deleteButtonFunc={this.deleteEntryByIdHandler}
          editButtonFunc={this.getEntryDataHandler}
        />
      );
    }

    if (this.state.lastEntryDeleted) {
      results = (
        <Row className="justify-content-center">
          <Col md="auto">
            <p>Last entry was deleted</p>
          </Col>
        </Row>
      );
    }

    let deleteModal = null;

    if (this.state.showDeleteModal) {
      deleteModal = (
        <DeleteModal
          showModal={this.state.showDeleteModal}
          closeHandler={this.modalCloseHandler}
        >
          Entry with ID {this.state.deletedEntryId} from{" "}
          {this.state.selectedTable} table was deleted!
        </DeleteModal>
      );
    }

    let addModal = null;

    if (this.state.showAddModal) {
      addModal = (
        <AddModal
          showModal={this.state.showAddModal}
          modalTitle="Add new invoice"
          addEntryHandler={this.addEntryHandler}
          tableColumns={this.state.tableColumns}
          closeHandler={this.modalCloseHandler}
        />
      );
    }

    let editModal = null;

    if (this.state.showEditModal) {
      editModal = (
        <EditModal
          showModal={this.state.showEditModal}
          modalTitle="Edit entry data"
          editEntryHandler={this.getEntryDataHandler}
          updateEntryHandler={this.updateEntryDataHandler}
          closeHandler={this.modalCloseHandler}
          entryData={this.state.editEntryData}
        ></EditModal>
      );
    }

    return (
      <Container>
        <Row className="justify-content-center">
          <Col md="auto">
            <Form>
              <Form.Group controlId="chinookTableSelect">
                <Form.Label>Select table</Form.Label>
                <Form.Control
                  as="select"
                  autoFocus
                  onChange={event => {
                    this.tableSelectionHandler(event);
                  }}
                >
                  {this.state.tables.map(table => {
                    return (
                      <option key={this.state.tables.indexOf(table)}>
                        {table}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="chinookColumnSelect">
                <Form.Label>Select column</Form.Label>
                <Form.Control
                  as="select"
                  onChange={event => {
                    this.columnSelectionHandler(event);
                  }}
                  value={this.state.selectedColumn}
                >
                  {this.state.columns.map(column => {
                    return (
                      <option key={this.state.columns.indexOf(column)}>
                        {column}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="chinookString">
                <Form.Label>Enter string to search for</Form.Label>
                <Form.Control
                  as="input"
                  onChange={event => {
                    this.stringChangeHandler(event);
                  }}
                  value={this.state.searchString}
                  onKeyPress={event => {
                    this.enterPressHandler(event, this.getResults);
                  }}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="chinookSearch">
                <Button
                  variant="primary"
                  size="m-2 lg"
                  active
                  onClick={this.getResults}
                >
                  Search
                </Button>
                <Button
                  variant="primary"
                  className="m-2 lg"
                  onClick={() => {
                    this.showAddModalHandler(this.state.selectedTable);
                  }}
                >
                  Add entry
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        {deleteModal}
        {addModal}
        {results}
        {editModal}
      </Container>
    );
  }
}

export default withErrorHandler(Chinook, axios);
