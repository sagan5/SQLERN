import React, { Component } from "react";
import axios from "../../axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import ResultTable from "../../containers/ResultTable/ResultTable";
import DeleteModal from "../../containers/Modals/DeleteModal/DeleteModal";
import Aux from "../../hoc/Auxiliary/Auxiliary";

class Genres extends Component {
  state = {
    results: [],
    lastEntryDeleted: false,
    showDeleteModal: false,
    deletedItemId: null,
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

  modalCloseHandler = () => {
    this.setState({ showDeleteModal: false });
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

    return (
      <Aux>
        <Row className="justify-content-center">
          <Col md="auto">
            <Button
              variant="primary"
              className="mb-2"
              onClick={this.getGenresHandler}
            >
              Get genres list
            </Button>
          </Col>
        </Row>
        <DeleteModal
          showModal={this.state.showDeleteModal}
          closeHandler={this.modalCloseHandler}
        >
          Genre with ID {this.state.deletedItemId} was deleted!
        </DeleteModal>
        {results}
      </Aux>
    );
  }
}

export default withErrorHandler(Genres, axios);
