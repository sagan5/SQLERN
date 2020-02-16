import React, { Component } from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { enterPressHandler } from "../../../helpers";

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.enterPressHandler = enterPressHandler.bind(this);
    this.state = {
      oldData: null,
      newData: null
    };
  }

  componentDidMount = () => {
    this.setState({
      oldData: this.props.entryData,
      newData: this.props.entryData
    });
  };

  dataChangeHandler = (e, key) => {
    // clone state with spread operator and change object's key value to a new one
    const newData = { ...this.state.newData, [key]: e.target.value };
    this.setState(() => ({ newData }));
  };

  focusElementById = id => {
    document.getElementById(id).focus();
  };

  saveChangesButtonHandler = () => {
    // check if some data is changed
    if (
      JSON.stringify(Object.values(this.state.oldData)) !==
      JSON.stringify(Object.values(this.state.newData))
    ) {
      this.props.updateEntryHandler(this.state.newData);
    } else {
      this.props.closeHandler();
    }

    // this.props.closeHandler();
  };

  render() {
    let formBody = null;

    if (this.state.oldData) {
      formBody = Object.keys(this.state.newData).map((newDataKey, index) => {
        return (
          <Form.Group key={newDataKey}>
            <Form.Label>
              {newDataKey.match(/[A-Z]+[^A-Z]*|[^A-Z]+/g).join(" ")}
            </Form.Label>
            <Form.Control
              id={index}
              // protect ID value from editing
              readOnly={index === 0 ? true : false}
              value={[Object.values(this.state.newData)[index]]}
              onChange={e => {
                this.dataChangeHandler(e, newDataKey);
              }}
              onKeyPress={e => {
                this.enterPressHandler(e, this.saveChangesButtonHandler);
              }}
            />
          </Form.Group>
        );
      });
    }

    return (
      <Modal
        show={this.props.showModal}
        onHide={this.props.closeHandler}
        // onEntered={() => {
        //   this.focusElementById("1");
        // }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>{formBody}</Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={this.saveChangesButtonHandler}
            id="saveButton"
          >
            Save
          </Button>
          <Button variant="secondary" onClick={this.props.closeHandler}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditModal;
