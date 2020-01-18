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
