import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const bootstrapWrapper = props => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md="auto">{props.children}</Col>
      </Row>
    </Container>
  );
};

export default bootstrapWrapper;
