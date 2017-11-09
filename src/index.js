import React from "react";
import { renderToString } from "react-dom/server";
import { format } from "prettier";
import SyntaxHighlighter from "react-syntax-highlighter";
import { highlightAuto } from "lowlight";
import docco from "react-syntax-highlighter/dist/styles/docco";

let nodes = [];
let prevRequest = {};
let style = docco;

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  console.log(request);
	  if (request.disabled && request.disabled !== prevRequest.disabled) {
		unhighlightCode();
		prevRequest.disabled = request.disabled;
	  } else if (!request.disabled && request.disabled !== prevRequest.disabled) {
		highlightCode(null, false);
		prevRequest.disabled = request.disabled;
	  } else if (request.style && request.style !== prevRequest.style) {
		prevRequest.style = request.style;
		style = JSON.parse(request.style);
		highlightCode(null, prevRequest.disabled)
	  }
});

highlightCode();
const observer = new MutationObserver(highlightCode);
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener('unload', () => {
	observer.disconnect();
	unsubscribe();
});

function highlightCode(mutations, disabled = false) {
	if ((mutations
		&& mutations[0]
		&& mutations[0].addedNodes
		&& mutations[0].addedNodes[0]
		&& mutations[0].addedNodes[0].dataset
		&& mutations[0].addedNodes[0].dataset.reactSyntaxHighlighter)
		|| disabled) {
		return;
	}
	console.log('after if', style);
	nodes = [];
	const codeTags = [...document.getElementsByTagName('code')];
	codeTags.forEach((code, index) => {
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
			const id = Math.random();
			const highlighted = renderToString(<SyntaxHighlighter style={style} id={`react-syntax-highlghter-${id}`} codeTagProps={{ style: { fontFamily: 'monospace', backgroundColor: 'transparent' } }} language="javascript" data-react-syntax-highlighter="true">{formatted}</SyntaxHighlighter>);
			console.log('highlighted', highlighted);
			if (code.parentNode && code.parentNode.tagName === "PRE") {
				const outerHTML = code.parentNode.outerHTML;
				code.parentNode.outerHTML = highlighted;
				const newNode = document.getElementById(`react-syntax-highlghter-${id}`);
				nodes.push({ node: newNode, outerHTML });
			} else {
				const outerHTML = code.outerHTML;
				code.outerHTML = highlighted;
				const newNode = document.getElementById(`react-syntax-highlghter-${id}`);
				nodes.push({ node: newNode, outerHTML });
			}
		}
		catch (err) {
			// do nothing
		}
	}
	});
}

function unhighlightCode() {
	nodes.forEach(({ node, outerHTML }) => node.outerHTML = outerHTML);
}