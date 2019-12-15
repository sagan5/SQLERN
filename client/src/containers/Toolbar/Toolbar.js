import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Aux from "../../hoc/Auxiliary/Auxiliary";

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedButton: null,
      showGenres: false
    };
  }

  // lift up state to app.js
  handleShowChange(form) {
    this.props.showInputForm(form);
  }

  render() {
    const genresButton = (
      <Button
        variant="outline-primary"
        className="m-2"
        // lift up state to app.js
        onClick={() => {
          this.handleShowChange("genres");
        }}
      >
        Get genres
      </Button>
    );

    const invoiceButton = (
      <Button
        variant="outline-primary"
        className="m-2"
        onClick={() => {
          this.handleShowChange("invoice");
        }}
      >
        Get invoice by ID
      </Button>
    );

    const invoicesButton = (
      <Button
        variant="outline-primary"
        className="m-2"
        onClick={() => {
          this.handleShowChange("invoices");
        }}
      >
        Get invoices by ID's
      </Button>
    );

    const chinookButton = (
      <Button
        variant="outline-dark"
        className="m-2"
        onClick={() => {
          this.handleShowChange("chinook");
        }}
      >
        Search DB
      </Button>
    );

    return (
      <Aux>
        {genresButton}
        {invoiceButton}
        {invoicesButton}
        {chinookButton}
      </Aux>
    );
  }
}

export default Toolbar;
