import React, { Component } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import Genres from "./components/Genres/Genres";
import Invoice from "./components/Invoice/Invoice";
import Invoices from "./components/Invoices/Invoices";
import Chinook from "./components/Chinook/Chinook";
import Toolbar from "./containers/Toolbar/Toolbar";
import ResultTable from "./containers/ResultTable/ResultTable";

import { errorLogging, enterPressHandler } from "./helpers";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class App extends Component {
  constructor(props) {
    super(props);
    // bind this to the function
    this.errorLogging = errorLogging.bind(this);
    this.enterPressHandler = enterPressHandler.bind(this);
    this.state = {
      showInput: "",
      results: null,
      error: false,
      errorData: null
    };
  }

  showInputFormHandler = form => {
    if (this.state.showInput !== form) {
      this.setState({ showInput: form, results: null });
    } else {
      this.setState({ showInput: "", results: null });
    }
  };

  getResults = results => {
    this.setState({ results: results });
  };

  render() {
    let results = null;

    if (this.state.results) {
      results = (
        <Row className="justify-content-center">
          <Col md="auto">
            <ResultTable data={this.state.results} />
          </Col>
        </Row>
      );
    }

    return (
      <Container>
        <Row className="justify-content-center">
          <Col md="auto">
            <Toolbar showInputForm={this.showInputFormHandler} />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="auto">
            {this.state.showInput === "genres" ? (
              // pass getResults function to child to lift state up
              <Genres getResults={this.getResults} />
            ) : null}
            {this.state.showInput === "invoice" ? (
              <Invoice getResults={this.getResults} />
            ) : null}
            {this.state.showInput === "invoices" ? (
              <Invoices getResults={this.getResults} />
            ) : null}
            {this.state.showInput === "chinook" ? (
              <Chinook getResults={this.getResults} />
            ) : null}
          </Col>
        </Row>
        {results}
      </Container>
    );
  }
}

export default App;
