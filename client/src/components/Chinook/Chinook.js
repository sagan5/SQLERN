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
      showDeleteModal: false
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
                  size="lg"
                  active
                  onClick={this.getResults}
                >
                  Search
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <DeleteModal
          showModal={this.state.showDeleteModal}
          closeHandler={this.modalCloseHandler}
        >
          Entry with ID {this.state.deletedEntryId} from{" "}
          {this.state.selectedTable} table was deleted!
        </DeleteModal>
        {results}
      </Container>
    );
  }
}

export default withErrorHandler(Chinook, axios);
