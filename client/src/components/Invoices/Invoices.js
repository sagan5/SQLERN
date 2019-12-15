import React, { Component } from "react";
import axios from "../../axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { errorLogging, enterPressHandler } from "../../helpers";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

import Aux from "../../hoc/Auxiliary/Auxiliary";

class Invoices extends Component {
  constructor(props) {
    super(props);
    this.errorLogging = errorLogging.bind(this);
    this.enterPressHandler = enterPressHandler.bind(this);
    this.state = {
      invoicesID: "",
      error: null
    };
  }

  componentDidMount = () => {
    console.log("invoices did mount");
  };

  componentWillUnmount = () => {
    console.log("invoices will unmount");
  };

  getInvoices = () => {
    const ids = this.state.invoicesID.match(/\d+/g);
    axios
      .get(`invoices/${ids}`)
      .then(res => {
        // lift up results to app.js
        this.props.getResults(res.data);
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  invoiceIDsChangeHandler = e => {
    let ids = e.target.value;
    this.setState({ invoicesID: ids });
  };

  render() {
    return (
      <Aux>
        <Form>
          <Form.Group controlId="formInvoicesIDs">
            <Form.Label>Invoices ID's</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              placeholder="Enter invoices ID's"
              value={this.state.invoicesID}
              onChange={this.invoiceIDsChangeHandler}
              onKeyPress={e => {
                this.enterPressHandler(e, this.getInvoices);
              }}
            />
          </Form.Group>
          <Button variant="primary" className="mb-2" onClick={this.getInvoices}>
            Get Invoices
          </Button>
        </Form>
      </Aux>
    );
  }
}

export default withErrorHandler(Invoices, axios);
