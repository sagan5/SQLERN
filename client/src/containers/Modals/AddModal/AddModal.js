import React, { Component } from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { enterPressHandler } from "../../../helpers";

class AddModal extends Component {
  constructor(props) {
    super(props);
    this.enterPressHandler = enterPressHandler.bind(this);
    this.state = {
      newData: {}
    };
  }

  componentDidMount = () => {
    this.setState({ newData: this.props.tableColumns });
  };

  dataChangeHandler = (e, key) => {
    // clone state with spread operator and change object's key value to a new one
    const newData = { ...this.state.newData, [key]: e.target.value };
    this.setState(() => ({ newData }));
  };

  focusElementById = id => {
    document.getElementById(id).focus();
  };

  addButtonHandler = () => {
    if (this.state.newData) {
      this.props.addEntryHandler(this.state.newData);
      this.props.closeHandler();
      this.setState({ newData: null });
    } else {
      alert("Enter something before adding it");
    }
  };

  render() {
    let formBody = null;

    if (this.props.tableColumns) {
      formBody = Object.keys(this.state.newData)
        .slice(1)
        .map((newDataKey, index) => {
          return (
            <Form.Group key={newDataKey}>
              <Form.Label>
                {newDataKey.match(/[A-Z]+[^A-Z]*|[^A-Z]+/g).join(" ")}
              </Form.Label>
              <Form.Control
                id={newDataKey}
                onChange={e => {
                  this.dataChangeHandler(e, newDataKey);
                }}
                // onKeyPress={e => {
                //   this.enterPressHandler(e, this.saveChangesButtonHandler);
                // }}
              />
            </Form.Group>
          );
        });
    }

    return (
      <Modal
        show={this.props.showModal}
        onHide={this.props.closeHandler}
        onEntered={() => {
          this.focusElementById(Object.keys(this.state.newData)[1]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>{formBody}</Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.addButtonHandler}>
            Add
          </Button>
          <Button variant="secondary" onClick={this.props.closeHandler}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

// <Form.Group>
//             <Form.Label>{this.props.formLabel}</Form.Label>
//             <Form.Control
//               type="text"
//               id="textInputField"
//               placeholder={this.props.placeholder}
//               value={this.state.name}
//               onChange={this.nameChangeHandler}
//               onKeyPress={e => {
//                 this.enterPressHandler(e, this.addButtonHandler);
//               }}
//             />
//           </Form.Group>

export default AddModal;
