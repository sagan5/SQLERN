import React from "react";
import styles from "./App.module.css";

import Btn from "./components/button/btn";

function App() {
  return (
    <div className={styles.App}>
      <p>Hello world!</p>
      <Btn text={"I am a button"}></Btn>
      <Btn text={"I am a button"}></Btn>
      <Btn text={"I am a button"}></Btn>
      <Btn text={"I am a button"}></Btn>
      <Btn text={"I am a button"}></Btn>
      <Btn text={"I am a button"}></Btn>
    </div>
  );
}

export default App;
