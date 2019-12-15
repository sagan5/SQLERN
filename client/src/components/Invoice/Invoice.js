import React, { Component } from "react";
import axios from "../../axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import { enterPressHandler } from "../../helpers";

class Invoice extends Component {
  constructor(props) {
    super(props);
    this.enterPressHandler = enterPressHandler.bind(this);
    this.state = {
      invoiceID: "",
      error: null
    };
  }

  componentDidMount = () => {
    console.log("Invoice did mount");
  };

  componentWillUnmount = () => {
    console.log("invoice will unmount");
  };

  getInvoice = () => {
    axios
      .get(`invoice/${this.state.invoiceID}`)
      .then(res => {
        // lift up results to app.js
        if (typeof res !== "undefined") {
          this.props.getResults(res.data);
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: err });
      });
  };

  invoiceIDChangeHandler = e => {
    const id = e.target.value;
    if (id < 1) {
      this.setState(prevState => ({
        invoiceID: prevState.invoiceID
      }));
    } else {
      this.setState({ invoiceID: id });
    }
  };

  render() {
    return (
      <Aux>
        <Form>
          <Form.Group controlId="formInvoiceId">
            <Form.Label>Invoice ID</Form.Label>
            <Form.Control
              type="number"
              autoFocus
              placeholder="Enter invoice ID"
              value={this.state.invoiceID}
              onChange={this.invoiceIDChangeHandler}
              onKeyPress={e => {
                this.enterPressHandler(e, this.getInvoice);
              }}
            />
          </Form.Group>
          <Button variant="primary" className="mb-2" onClick={this.getInvoice}>
            Get Invoice
          </Button>
        </Form>
      </Aux>
    );
  }
}

export default withErrorHandler(Invoice, axios);
