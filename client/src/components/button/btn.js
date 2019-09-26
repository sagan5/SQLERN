import React from "react";
import styles from "./btn.module.css";

const btn = props => {
  return <button className={styles.btn}>{props.text}</button>;
};

export default btn;
