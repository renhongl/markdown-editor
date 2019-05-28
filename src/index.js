import React from "react";
import { render } from "react-dom";
import { view as MarkdownEditor } from "./markdownEditor";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import lang from "./lang.json";

import "./styles.css";

i18n.use(initReactI18next).init({
  resources: lang,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

const App = () => <MarkdownEditor />;

render(<App />, document.getElementById("root"));
