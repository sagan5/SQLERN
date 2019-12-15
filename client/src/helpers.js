// error logging function

export function errorLogging(err) {
  console.log("function was called");
  this.setState({ error: true, errorData: err, showModal: true });
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log("response data", err.response.data);
    console.log("response status", err.response.status);
    console.log("response headers", err.response.headers);
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log("request error", err.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", err.message);
  }
  console.log("error config", err.config);
}

// enter key press handler

export function enterPressHandler(event, func) {
  if (event.key === "Enter") {
    event.preventDefault();
    func();
  }
}

export function clickHappened() {
  console.log("click happened");
}

export function errorCloseHandler() {
  this.setState({ showModal: false });
}
