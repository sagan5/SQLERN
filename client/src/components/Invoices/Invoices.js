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
import AddModal from "../../containers/Modals/AddModal/AddModal";
import EditModal from "../../containers/Modals/EditModal/EditModal";
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
      showAddModal: false,
      tableColumns: null,
      showEditModal: false,
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
      showMissingModal: false,
      showAddModal: false,
      showEditModal: false
    });
  };

  showAddModalHandler = () => {
    axios
      .get("/chinook/invoices")
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
  };

  addInvoiceHandler = invoice => {
    axios
      .post("/invoice/add", { newEntry: invoice })
      .then(res => {
        if (res.status === 200) {
          alert(res.data.msg);
        } else {
          alert("Something bad happened");
        }
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("addInvoiceHandler error", err);
      });
  };

  getInvoiceHandler = id => {
    axios
      .get(`/invoice/${id}`)
      .then(res => {
        if (res.status === 200) {
          this.setState({ editInvoiceData: res.data });
        } else {
          alert("Something bad happened");
        }
      })
      .then(() => {
        this.setState({ showEditModal: true });
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("getInvoiceHandler error", err);
      });
  };

  updateInvoiceHandler = data => {
    axios
      .put(`invoice/edit/${data[Object.keys(data)[0]]}`, { entryData: data })
      .then(res => {
        if (res.status === 200) {
          alert(res.data.msg);
          this.modalCloseHandler();
        } else {
          alert(res.data.msg);
        }
      })
      .then(() => {
        this.getInvoicesByIdsHandler();
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
          editButtonFunc={this.getInvoiceHandler}
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

    let deleteModal = null;

    if (this.state.showDeleteModal) {
      deleteModal = (
        <DeleteModal
          showModal={this.state.showDeleteModal}
          closeHandler={this.modalCloseHandler}
        >
          Invoice with ID {this.state.deletedInvoiceId} was deleted!
        </DeleteModal>
      );
    }

    let inputModal = null;

    if (this.state.showEmptyIdModal) {
      inputModal = (
        <InputModal
          showModal={this.state.showEmptyIdModal}
          closeHandler={this.modalCloseHandler}
        >
          Please enter ID of at least one invoice!
        </InputModal>
      );
    }

    let missingModal = null;

    if (this.state.showMissingModal) {
      missingModal = (
        <MissingModal
          showModal={this.state.showMissingModal}
          closeHandler={this.modalCloseHandler}
        >
          These Id's weren't found: {this.state.missingInvoicesIds}
        </MissingModal>
      );
    }

    let addModal = null;

    if (this.state.showAddModal) {
      addModal = (
        <AddModal
          showModal={this.state.showAddModal}
          modalTitle="Add new invoice"
          addEntryHandler={this.addInvoiceHandler}
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
          modalTitle="Edit invoice data"
          editEntryHandler={this.getInvoiceHandler}
          updateEntryHandler={this.updateInvoiceHandler}
          closeHandler={this.modalCloseHandler}
          entryData={this.state.editInvoiceData}
        ></EditModal>
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
                className="mb-2 m-2"
                onClick={this.getInvoicesByIdsHandler}
              >
                Get Invoices
              </Button>
              <Button
                variant="primary"
                className="mb-2 m-2"
                onClick={this.showAddModalHandler}
              >
                Add invoice
              </Button>
            </Form>
          </Col>
        </Row>
        {deleteModal}
        {inputModal}
        {missingModal}
        {addModal}
        {editModal}
        {results}
      </Aux>
    );
  }
}

export default withErrorHandler(Invoices, axios);
