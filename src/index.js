import React from "react";
import { render } from "react-dom";
import { view as MarkdownEditor } from "./markdownEditor";
import "./styles.css";

const App = () => <MarkdownEditor />;

render(<App />, document.getElementById("root"));
