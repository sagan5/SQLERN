import React, { Component } from "react";
import axios from "../../axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import ResultTable from "../../containers/ResultTable/ResultTable";
import AddModal from "../../containers/Modals/AddModal/AddModal";
import EditModal from "../../containers/Modals/EditModal/EditModal";
import DeleteModal from "../../containers/Modals/DeleteModal/DeleteModal";
import Aux from "../../hoc/Auxiliary/Auxiliary";

class Genres extends Component {
  state = {
    results: [],
    lastEntryDeleted: false,
    showDeleteModal: false,
    deletedItemId: null,
    showAddModal: false,
    showEditModal: false,
    editGenreData: null,
    tableColumns: null,
    error: null
  };

  getGenresHandler = () => {
    axios
      .get(`genres`)
      .then(res => {
        this.setState({ results: res.data, lastEntryDeleted: false });
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("getGenresHandler error", err);
      });
  };

  // alternative request
  // getGenres = () => {
  //   fetch("http://localhost:5000/api/genres")
  //     .then(response => response.json())

  //     .then(data => this.setState({ genres: data }))
  //     .then(() => console.log(this.state.genres));
  // };

  deleteGenreHandler = id => {
    axios
      .delete(`genres/${id}`)
      .then(res => {
        if (res.status === 200) {
          this.setState({ showDeleteModal: true, deletedItemId: id });
          // remove deleted entry from results to update state and cause re-render
          // clone results
          const oldResults = [...this.state.results];
          const newResults = [...this.state.results];
          // find index of deleted entry object within an array
          const index = oldResults.findIndex(e => e[Object.keys(e)[0]] === id);
          // mutate results array and remove deleted entry
          newResults.splice(index, 1);
          // check if last entry is deleted
          newResults.length < 1
            ? this.setState({ lastEntryDeleted: true })
            : this.setState({ results: newResults });
        } else {
          alert(`Response status is ${res.status}`);
        }
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("deleteGenreHandler error", err);
      });
  };

  addGenreHandler = name => {
    axios
      .post(`genres/add`, {
        newEntry: name
      })
      .then(res => {
        if (res.status === 200) {
          alert(res.data.msg);
          this.getGenresHandler();
        } else {
          alert("Something bad happened");
        }
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("addGenreHandler error", err);
      });
  };

  getGenreHandler = id => {
    axios
      .get(`/genres/${id}`)
      .then(res => {
        if (res.status === 200) {
          this.setState({ editGenreData: res.data });
        } else {
          alert("Something bad happened");
        }
      })
      .then(() => {
        this.setState({ showEditModal: true });
      })
      .catch(err => {
        this.setState({ error: err });
        console.log("getGenreHandler error", err);
      });
  };

  updateGenreHandler = data => {
    axios
      .put(`genres/edit/${data[Object.keys(data)[0]]}`, { entryData: data })
      .then(res => {
        if (res.status === 200) {
          alert(res.data.msg);
          this.modalCloseHandler();
        } else {
          alert(res.data.msg);
        }
      })
      .then(() => {
        this.getGenresHandler();
      });
  };

  showAddModalHandler = () => {
    axios
      .get("/chinook/genres")
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
  modalCloseHandler = () => {
    this.setState({
      showDeleteModal: false,
      showAddModal: false,
      showEditModal: false
    });
  };

  getGenresColumnsHandler = () => {
    axios.get("/chinook/genres").then(res => {
      this.setState({ tableColumns: res.data });
    });
  };

  render() {
    let results = (
      <Row className="justify-content-center">
        <Col md="auto">
          <p>Click on a button to see genres list</p>
        </Col>
      </Row>
    );

    if (this.state.results.length !== 0) {
      results = (
        <ResultTable
          data={this.state.results}
          // pass deleteGenreHandler function to results table, delete button
          deleteButtonFunc={this.deleteGenreHandler}
          editButtonFunc={this.getGenreHandler}
        />
      );
    }

    if (this.state.lastEntryDeleted) {
      results = (
        <Row className="justify-content-center">
          <Col md="auto">
            <p>Last genre was deleted</p>
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
          Genre with ID {this.state.deletedItemId} was deleted!
        </DeleteModal>
      );
    }
    let addModal = null;

    if (this.state.showAddModal) {
      addModal = (
        <AddModal
          showModal={this.state.showAddModal}
          modalTitle="Add new genre"
          tableColumns={this.state.tableColumns}
          addEntryHandler={this.addGenreHandler}
          closeHandler={this.modalCloseHandler}
        />
      );
    }

    let editModal = null;

    if (this.state.showEditModal) {
      editModal = (
        <EditModal
          showModal={this.state.showEditModal}
          modalTitle="Edit genre"
          editEntryHandler={this.getGenreHandler}
          updateEntryHandler={this.updateGenreHandler}
          closeHandler={this.modalCloseHandler}
          entryData={this.state.editGenreData}
        ></EditModal>
      );
    }

    return (
      <Aux>
        <Row className="justify-content-center">
          <Col md="auto">
            <Button
              variant="primary"
              className="mb-2 m-2"
              onClick={this.getGenresHandler}
            >
              Get genres list
            </Button>
            <Button
              variant="primary"
              className="mb-2 m-2"
              onClick={this.showAddModalHandler}
            >
              Add new genre
            </Button>
          </Col>
        </Row>
        {deleteModal}
        {addModal}
        {editModal}
        {results}
      </Aux>
    );
  }
}

export default withErrorHandler(Genres, axios);
