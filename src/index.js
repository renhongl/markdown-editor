import React from "react";
import { render } from "react-dom";
import { view as MarkdownEditor } from "./markdownEditor";
import { I18n } from "react-i18nify";
import en from "../public/lang/en.json";
import zh from "../public/lang/zh.json";

import "./styles.css";

I18n.setTranslations({
  en,
  zh
});

I18n.setLocale("zh");

const App = () => <MarkdownEditor />;

render(<App />, document.getElementById("root"));
