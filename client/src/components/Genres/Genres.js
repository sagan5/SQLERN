import React, { Component } from "react";
import axios from "../../axios";

import Button from "react-bootstrap/Button";

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

import Aux from "../../hoc/Auxiliary/Auxiliary";

class Genres extends Component {
  state = {
    error: null
  };

  getGenres = () => {
    axios
      .get(`genres`)
      .then(res => {
        // lift results up
        this.props.getResults(res.data);
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  // alternative request
  // getGenres = () => {
  //   fetch("http://localhost:5000/api/genres")
  //     .then(response => response.json())

  //     .then(data => this.setState({ genres: data }))
  //     .then(() => console.log(this.state.genres));
  // };

  render() {
    return (
      <Aux>
        <Button variant="primary" className="mb-2" onClick={this.getGenres}>
          Get genres list
        </Button>
      </Aux>
    );
  }
}

export default withErrorHandler(Genres, axios);
