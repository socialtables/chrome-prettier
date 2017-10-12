import React from "react";
import { renderToString } from "react-dom/server";
import { format } from "prettier";
import SyntaxHighlighter from "react-syntax-highlighter";
import { highlightAuto } from "lowlight";
import { github } from "react-syntax-highlighter/dist/styles";



const codeTags = [...document.getElementsByTagName('code')];
const lowlight = codeTags.forEach(code => {
  const { language, secondBest } = highlightAuto(code.innerText);
  const isLanguage = language && language === 'javascript';
  const isSecondBestLanguage = secondBest && secondBest.language === 'javascript';
  if (isLanguage || 
    isSecondBestLanguage || 
    code.className.includes("language-js") || 
    code.className.includes("lang-js") ||
    code.className.includes("gatsby-code-jsx")
  ) {
    const formatted = format(code.innerText);
    const highlighted = renderToString(<SyntaxHighlighter style={github} language="javascript">{formatted}</SyntaxHighlighter>);
    code.innerHTML = highlighted;
  }
});
