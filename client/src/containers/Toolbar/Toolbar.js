import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Aux from "../../hoc/Auxiliary/Auxiliary";

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedButton: null
    };
  }

  render() {
    const genresButton = (
      <Button
        variant="outline-primary"
        className="m-2"
        // lift up state to app.js to show correct input form
        onClick={() => {
          this.props.showInputForm("genres");
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
          this.props.showInputForm("invoice");
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
          this.props.showInputForm("invoices");
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
          this.props.showInputForm("chinook");
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
