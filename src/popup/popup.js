import * as styles from "react-syntax-highlighter/dist/styles";

function createElement(tagName, style = {}, props = {}, children = []) {
	const element = document.createElement(tagName);
	const styleKeys = Object.keys(style);
	styleKeys.forEach(key => {
		element.style[key] = style[key];
	});
	const propKeys = Object.keys(props);
	propKeys.forEach(key => {
		element[key] = props[key];
	});
	children.forEach(child => {
		child = typeof child === 'string' ? document.createTextNode(child) : child;
		element.appendChild(child);
	});
	return element;
}

let disabled = false;

const toggleContainerStyle = {
	height: '24px',
	width: '58px',
	display: 'flex',
	backgroundColor: '#FEDFE1',
	borderRadius: '4px',
	justifyContent: disabled ? 'flex-end' : 'flex-start',
};

function toggleDisabled() {
	disabled = !disabled;
	toggleContainer.style.justifyContent = disabled ? 'flex-end' : 'flex-start';
	return { disabled };
}

function sendMessageToTab(getMessage) {
	return function() {
		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
			const message = getMessage(...arguments);
			chrome.tabs.sendMessage(tabs[0].id, message);
		});
	}
}

const toggleTextStyle = {
	boxSizing: 'border-box',
	fontSize: '14px',
	height: '24px',
	paddingLeft: '10px',
	paddingTop: '10px',
};
const toggleText = createElement('div', toggleTextStyle, {}, ['Disable']);
const toggleRowStyle = {
	display: 'flex',
	justifyContent: 'space-between'
};

const toggleContainer = createElement('div', toggleContainerStyle, { onclick: sendMessageToTab(toggleDisabled) });
const toggleRow = createElement('div', toggleRowStyle, {}, [toggleContainer, toggleText]);
document.getElementById('app').appendChild(toggleRow)

const toggleStyle = {
	backgroundColor: '#8E354A',
	height: '24px',
	width: '29px',
	borderRadius: '4px',
};

const toggle = createElement('div', toggleStyle);
toggleContainer.appendChild(toggle);

function changeSyntaxStyle(e) {
	return { style: JSON.stringify(styles[e.target.value])}
}

const options = Object.keys(styles).map(style => {
	return createElement('option', {}, { value: style }, [style])
});

const select = createElement('select', {}, { onchange: sendMessageToTab(changeSyntaxStyle) }, options);
document.getElementById('app').appendChild(select);