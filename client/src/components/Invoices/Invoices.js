import React, { Component } from "react";
import axios from "../../axios";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import ResultTable from "../../containers/ResultTable/ResultTable";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import DeleteModal from "../../containers/Modals/DeleteModal/DeleteModal";
import InputModal from "../../containers/Modals/InputModal/InputModal";
import MissingModal from "../../containers/Modals/MissingModal/MissingModal";
import { enterPressHandler } from "../../helpers";

class Invoices extends Component {
  constructor(props) {
    super(props);
    this.enterPressHandler = enterPressHandler.bind(this);
    this.state = {
      invoicesIds: "",
      results: [],
      showEmptyIdModal: false,
      lastEntryDeleted: false,
      showDeleteModal: false,
      deletedInvoiceId: null,
      showMissingModal: false,
      missingInvoicesIds: [],
      error: null
    };
  }

  componentDidMount = () => {
    console.log("invoices did mount");
  };

  componentWillUnmount = () => {
    console.log("invoices will unmount");
  };

  getInvoicesByIdsHandler = () => {
    const ids = this.state.invoicesIds.match(/\d+/g);
    console.log("request ids", ids);
    if (ids !== null) {
      axios
        .get(`invoices/${ids}`)
        .then(res => {
          // array comparison function to find missing ids in request
          const checkForNotFoundIds = (reqIdsArr, resIdsArr) => {
            let notFoundIds = [];
            notFoundIds = reqIdsArr.filter(
              reqId => !resIdsArr.includes(parseInt(reqId))
            );
            this.setState({
              showMissingModal: true,
              missingInvoicesIds: notFoundIds.join(", ")
            });
            // return alert(`These Ids weren't found: ${notFoundIds}`);
          };

          // check if all ids were found
          let foundIds = res.data.map(invoice => invoice.InvoiceId);
          if (ids.length !== foundIds.length) {
            checkForNotFoundIds(ids, foundIds);
          }
          this.setState({ results: res.data, lastEntryDeleted: false });
        })
        .catch(err => {
          this.setState({ error: err });
          console.log("getInvoicesByIdsHandler error", err);
        });
    } else {
      this.setState({ showEmptyIdModal: true });
    }
  };

  deleteInvoiceByIdHandler = id => {
    axios
      .delete(`invoice/${id}`)
      .then(res => {
        if (res.status === 200) {
          // alert(`Invoice with ID ${id} was succesfully deleted`);
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
            this.setState({ lastEntryDeleted: true, invoicesIds: "" });
          }
          this.setState({ showDeleteModal: true, deletedInvoiceId: id });
        } else {
          alert(`Response status is ${res.status}`);
        }
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("deleteInvoiceByIdHandler error", err);
      });
  };

  invoiceIdsChangeHandler = e => {
    const ids = e.target.value;
    if (ids !== "") {
      const mutatedIds = ids
        // accept entered ids separted by "." or ","
        .match(/\d+[.,]?/g)
        // join array of captured ids into string
        .join("")
        // replace "." with "," to look nicer
        .replace(/[.]+/g, ",");
      this.setState({ invoicesIds: mutatedIds });
      console.log(mutatedIds);
    } else {
      this.setState({ invoicesIds: "" });
    }
  };
  modalCloseHandler = () => {
    this.setState({
      showDeleteModal: false,
      showEmptyIdModal: false,
      showMissingModal: false
    });
  };

  render() {
    let results = null;

    if (this.state.results.length !== 0) {
      results = (
        <ResultTable
          data={this.state.results}
          // pass deleteInvoiceByIdHandler function to results table, delete button
          deleteButtonFunc={this.deleteInvoiceByIdHandler}
        />
      );
    }

    if (this.state.lastEntryDeleted) {
      results = (
        <Row className="justify-content-center">
          <Col md="auto">
            <p>Last invoice was deleted</p>
          </Col>
        </Row>
      );
    }
    return (
      <Aux>
        <Row className="justify-content-center">
          <Col md="auto">
            <Form>
              <Form.Group controlId="formInvoicesIDs">
                <Form.Label>Invoices ID's</Form.Label>
                <Form.Control
                  type="text"
                  autoFocus
                  placeholder="Enter invoices ID's"
                  value={this.state.invoicesIds}
                  onChange={this.invoiceIdsChangeHandler}
                  onKeyPress={e => {
                    this.enterPressHandler(e, this.getInvoicesByIdsHandler);
                  }}
                />
              </Form.Group>
              <Button
                variant="primary"
                className="mb-2"
                onClick={this.getInvoicesByIdsHandler}
              >
                Get Invoices
              </Button>
            </Form>
          </Col>
        </Row>
        <DeleteModal
          showModal={this.state.showDeleteModal}
          closeHandler={this.modalCloseHandler}
        >
          Invoice with ID {this.state.deletedInvoiceId} was deleted!
        </DeleteModal>
        <InputModal
          showModal={this.state.showEmptyIdModal}
          closeHandler={this.modalCloseHandler}
        >
          Please enter ID of at least one invoice!
        </InputModal>
        <MissingModal
          showModal={this.state.showMissingModal}
          closeHandler={this.modalCloseHandler}
        >
          These Id's weren't found: {this.state.missingInvoicesIds}
        </MissingModal>
        {results}
      </Aux>
    );
  }
}

export default withErrorHandler(Invoices, axios);
