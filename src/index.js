import React from "react";
import { renderToString } from "react-dom/server";
import { format } from "prettier";
import SyntaxHighlighter from "react-syntax-highlighter";
import { highlightAuto } from "lowlight";
import { docco } from "react-syntax-highlighter/dist/styles";

highlightCode();
const observer = new MutationObserver(highlightCode);
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener('unload', () => observer.disconnect());

function highlightCode(mutations) {

	if (mutations
		&& mutations[0]
		&& mutations[0].addedNodes
		&& mutations[0].addedNodes[0]
		&& mutations[0].addedNodes[0].dataset
		&& mutations[0].addedNodes[0].dataset.reactSyntaxHighlighter) {
		return;
	}
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
		try {
			const formatted = format(code.innerText);
			const highlighted = renderToString(<SyntaxHighlighter style={docco} codeTagProps={{ style: { fontFamily: 'monospace', backgroundColor: 'transparent' } }} language="javascript" data-react-syntax-highlighter="true">{formatted}</SyntaxHighlighter>);
			if (code.parentNode && code.parentNode.tagName === "PRE") {
				code.parentNode.outerHTML = highlighted;
			}  else {
				code.outerHTML = highlighted;
			}
		}
		catch (err) {
			// do nothing
		}
	}
	});
}
