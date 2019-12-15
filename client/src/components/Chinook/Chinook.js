import React, { Component } from "react";
import axios from "../../axios";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { errorLogging, enterPressHandler } from "../../helpers";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Chinook extends Component {
  constructor(props) {
    super(props);
    this.errorLogging = errorLogging.bind(this);
    this.enterPressHandler = enterPressHandler.bind(this);
    this.state = {
      tables: [],
      selectedTable: "",
      columns: [],
      selectedColumn: "",
      searchString: "",
      error: null
    };
  }

  componentDidMount() {
    console.log("chinook mounted");
    this.getTables();
  }

  getTables = () => {
    axios
      .get("chinook/tables")
      .then(res => {
        this.setState({
          tables: res.data,
          selectedTable: res.data[0]
        });
        this.getColumns(res.data[0]);
      })
      .catch(err => {
        this.setState({ error: err });
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
          // lift up results to app.js
          this.props.getResults(res.data);
        } else {
          this.setState({
            error: true
          });
        }
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  tableSelectionHandler = event => {
    const table = event.target.value;
    this.setState({ selectedTable: table });
    this.getColumns(table);
  };

  columnSelectionHandler = event => {
    this.setState({ selectedColumn: event.target.value });
  };

  stringChangeHandler = event => {
    this.setState({ searchString: event.target.value });
  };

  render() {
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
      </Container>
    );
  }
}

export default withErrorHandler(Chinook, axios);
