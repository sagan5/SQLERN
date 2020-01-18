import React from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const deleteModal = props => {
  const focusCloseButton = () => {
    document.getElementById("closeButton").focus();
  };
  return (
    <Modal
      show={props.showModal}
      onHide={props.closeHandler}
      onEntered={focusCloseButton}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Success</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={props.closeHandler}
          id="closeButton"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default deleteModal;
