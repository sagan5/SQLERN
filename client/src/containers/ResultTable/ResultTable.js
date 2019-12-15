import React from "react";
import Table from "react-bootstrap/Table";

import axios from "axios";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
// table rendering functions

// table head
const renderTableHead = head => {
  if (Array.isArray(head)) {
    return (
      <tr>
        {Object.keys(head[0]).map((key, index) => {
          return <td key={index}>{key}</td>;
        })}
      </tr>
    );
  } else {
    return (
      <tr>
        {Object.keys(head).map((key, index) => {
          return <td key={index}>{key}</td>;
        })}
      </tr>
    );
  }
};

// table body
const renderTableBody = body => {
  if (Array.isArray(body)) {
    return body.map((value, index) => {
      return (
        <tr key={index}>
          {Object.values(value).map((value, index) => {
            return <td key={index}>{value}</td>;
          })}
          <td>Edit</td>
          <td>Delete</td>
        </tr>
      );
    });
  } else {
    return (
      <tr>
        {Object.values(body).map((value, index) => {
          return <td key={index}>{value}</td>;
        })}
        <td>Edit</td>
        <td>Delete</td>
      </tr>
    );
  }
};

const resultTable = props => {
  console.log("results mounted");
  return (
    <Table striped hover>
      <thead>{renderTableHead(props.data)}</thead>
      <tbody>{renderTableBody(props.data)}</tbody>
    </Table>
  );
};

export default withErrorHandler(resultTable, axios);
// export default resultTable;
