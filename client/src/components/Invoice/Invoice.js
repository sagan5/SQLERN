import React, { Component } from "react";
import axios from "../../axios";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import ResultTable from "../../containers/ResultTable/ResultTable";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import AddModal from "../../containers/Modals/AddModal/AddModal";
import EditModal from "../../containers/Modals/EditModal/EditModal";
import DeleteModal from "../../containers/Modals/DeleteModal/DeleteModal";
import InputModal from "../../containers/Modals/InputModal/InputModal";

import { enterPressHandler } from "../../helpers";

class Invoice extends Component {
  constructor(props) {
    super(props);
    this.enterPressHandler = enterPressHandler.bind(this);
    this.state = {
      invoiceId: "",
      results: null,
      showEmptyIdModal: false,
      showDeleteModal: false,
      deletedInvoiceId: null,
      showAddModal: false,
      editInvoiceData: null,
      tableColumns: null,
      error: null
    };
  }

  componentDidMount = () => {
    console.log("invoice did mount");
  };

  componentWillUnmount = () => {
    console.log("invoice will unmount");
  };

  getInvoiceByIdHandler = () => {
    if (this.state.invoiceId !== "") {
      axios
        .get(`invoice/${this.state.invoiceId}`)
        .then(res => {
          this.setState({ results: res.data });
        })
        .catch(err => {
          this.setState({ error: err });
          console.log("getInvoiceByIdHandler error", err);
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
          this.setState({
            invoiceId: "",
            results: null,
            showDeleteModal: true,
            deletedInvoiceId: id
          });
        } else {
          alert(`Response status is ${res.status}`);
        }
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("deleteInvoiceByIdHandler error", err);
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

  invoiceIdChangeHandler = e => {
    const id = e.target.value;
    // check for empty string to allow deletion of id
    if (id === "" || /^[0-9\b]+$/.test(id)) {
      this.setState({ invoiceId: id });
    }
  };

  modalCloseHandler = () => {
    this.setState({
      showDeleteModal: false,
      showEmptyIdModal: false,
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
        this.getInvoiceByIdHandler(data[Object.keys(data)[0]]);
      });
  };

  render() {
    let results = null;

    if (this.state.results) {
      results = (
        <ResultTable
          data={this.state.results}
          // pass deleteInvoiceByIdHandler function to results table, delete button
          deleteButtonFunc={this.deleteInvoiceByIdHandler}
          editButtonFunc={this.getInvoiceHandler}
        />
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
          Please enter ID of invoice you're looking for!
        </InputModal>
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
              <Form.Group controlId="formInvoiceId">
                <Form.Label>Invoice ID</Form.Label>
                <Form.Control
                  type="number"
                  autoFocus
                  placeholder="Enter invoice ID"
                  value={this.state.invoiceId}
                  onChange={this.invoiceIdChangeHandler}
                  onKeyPress={e => {
                    this.enterPressHandler(e, this.getInvoiceByIdHandler);
                  }}
                />
              </Form.Group>
              <Button
                variant="primary"
                className="mb-2 m-2"
                onClick={this.getInvoiceByIdHandler}
              >
                Get invoice
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
        {addModal}
        {editModal}
        {results}
      </Aux>
    );
  }
}

export default withErrorHandler(Invoice, axios);
