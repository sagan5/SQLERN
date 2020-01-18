import React, { Component } from "react";

import Button from "react-bootstrap/Button";

import Modal from "react-bootstrap/Modal";
import Aux from "../Auxiliary/Auxiliary";

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    constructor(props) {
      super(props);
      // this.enterPressHandler = enterPressHandler.bind(this);
      this.state = {
        error: null
      };
    }

    _isMounted = false;

    componentDidMount = () => {
      this._isMounted = true;
      console.log("withErrorHandler mounted");
      this.reqInterceptor = axios.interceptors.request.use(
        req => {
          // clear errors when sending request
          this.setState({ error: null });
          console.log("request intercepted");
          console.log("request", req);
          return req;
        },
        error => {
          console.log("request error intercepted");
          if (this._isMounted) {
            this.setState({ error: error });
          }
        }
      );
      this.resInterceptor = axios.interceptors.response.use(
        res => {
          console.log("response intercepted");
          console.log("response", res);
          return res;
        },
        error => {
          console.log("response error intercepted");
          console.log(Object.keys(error));
          console.log("error", error);
          console.log("error config", error.config);
          console.log("error request", error.request);
          console.log("error response", error.response);
          // console.log("error isAxiosError", error.isAxiosError);
          // console.log("error toJSON", error.toJSON);
          if (this._isMounted) {
            this.setState({ error: error });
          }
        }
      );
    };

    componentWillUnmount = () => {
      this._isMounted = false;
      console.log("errorhandler component will unmount");
      // clean old interceptors so they would not cause errors
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    };

    errorConfirmedHandler = () => {
      this.setState({ error: false });
    };

    enterPressHandler = (event, func) => {
      console.log("hello mister");
      if (event.key === "Enter") {
        event.preventDefault();
        this.setState({ error: false });
      }
    };

    // focus on close button automaticaly
    focusCloseButton = () => {
      document.getElementById("closeButton").focus();
    };

    render() {
      let errorContent = null;

      if (this.state.error) {
        if (typeof this.state.error.response === "undefined") {
          errorContent = (
            <Aux>
              <p>Something went wrong! Check your network or DB connection</p>
              <p>Response is undefined</p>
            </Aux>
          );
        } else {
          errorContent = (
            <Aux>
              <p>
                {this.state.error.response.data.msg
                  ? this.state.error.response.data.msg
                  : this.state.error.response.data}
              </p>

              <p>Error URL: {this.state.error.config.url}</p>
              <p>Resonse status: {this.state.error.response.status}</p>
              <p>
                Response status text: {this.state.error.response.statusText}
              </p>
            </Aux>
          );
        }
      }

      return (
        <Aux>
          <Modal
            show={this.state.error ? true : false}
            onHide={this.errorConfirmedHandler}
            // when modal loads close button is focused
            onEntered={this.focusCloseButton}
          >
            <Modal.Header closeButton>
              <Modal.Title>Error message</Modal.Title>
            </Modal.Header>
            <Modal.Body>{errorContent}</Modal.Body>
            <Modal.Footer>
              <Button
                active={true}
                variant="secondary"
                onClick={this.errorConfirmedHandler}
                id="closeButton"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  };
};

export default withErrorHandler;
