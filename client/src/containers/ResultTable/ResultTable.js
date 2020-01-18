import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

class ResultTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: this.props.data,
      table: this.props.table,
      error: null
    };
  }

  // prevent updating ResultTable component when entering ids in parent components
  shouldComponentUpdate = nextProps => {
    if (this.props.data === nextProps.data) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    console.log("results mounted");

    // table buttons
    const editButton = (
      <Button
        variant="outline-info"
        // className="m-2"
        // onClick={() => {
        //   this.handleShowChange("genres");
        // }}
      >
        Edit
      </Button>
    );

    // table rendering functions
    // table head
    const renderTableHead = head => {
      // if response is array
      if (Array.isArray(head)) {
        return (
          <tr>
            {Object.keys(head[0]).map((key, index) => {
              return <td key={index}>{key}</td>;
            })}
            <td colSpan="2"></td>
          </tr>
        );
      } else {
        return (
          // if response is object
          <tr>
            {Object.keys(head).map((key, index) => {
              return <td key={index}>{key}</td>;
            })}
            <td colSpan="2"></td>
          </tr>
        );
      }
    };

    // table body
    const renderTableBody = body => {
      // if response is array
      if (Array.isArray(body)) {
        return body.map((value, index) => {
          return (
            <tr key={index}>
              {Object.values(value).map((value, index) => {
                return <td key={index}>{value}</td>;
              })}
              <td>{editButton}</td>
              <td>
                <Button
                  // delete button
                  variant="outline-danger"
                  onClick={() => {
                    this.props.deleteButtonFunc(value[Object.keys(value)[0]]);
                  }}
                >
                  Delete item {value[Object.keys(value)[0]]}
                </Button>
              </td>
            </tr>
          );
        });
      } else {
        // if response is object
        return (
          <tr>
            {Object.values(body).map((value, index) => {
              return <td key={index}>{value}</td>;
            })}
            <td>{editButton}</td>
            <td>
              <Button
                // delete button
                variant="outline-danger"
                onClick={() => {
                  this.props.deleteButtonFunc([Object.values(body)[0]]);
                }}
              >
                Delete item {[Object.values(body)[0]]}
              </Button>
            </td>
          </tr>
        );
      }
    };
    return (
      <Row className="justify-content-center">
        <Col md="auto">
          <Table striped hover>
            <thead>{renderTableHead(this.props.data)}</thead>
            <tbody>{renderTableBody(this.props.data)}</tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}

export default ResultTable;
