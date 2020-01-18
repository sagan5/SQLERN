import React, { Component } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import Genres from "./components/Genres/Genres";
import Invoice from "./components/Invoice/Invoice";
import Invoices from "./components/Invoices/Invoices";
import Chinook from "./components/Chinook/Chinook";
import Toolbar from "./containers/Toolbar/Toolbar";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInput: ""
    };
  }

  showInputFormHandler = form => {
    this.state.showInput !== form
      ? this.setState({ showInput: form })
      : this.setState({ showInput: "" });
  };

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md="auto">
            {/* pass function to toolber.js to show correct input form*/}
            <Toolbar showInputForm={this.showInputFormHandler} />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="auto">
            {this.state.showInput === "genres" ? <Genres /> : null}
            {this.state.showInput === "invoice" ? <Invoice /> : null}
            {this.state.showInput === "invoices" ? <Invoices /> : null}
            {this.state.showInput === "chinook" ? <Chinook /> : null}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
