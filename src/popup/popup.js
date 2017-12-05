import * as styles from "react-syntax-highlighter/src/styles/prism";

let disabled = false;

const toggleContainerStyle = {
	alignItems: 'center',
	backgroundColor: '#FEDFE1',
	borderRadius: '4px',
	border: '1px solid #8E354A',	
	cursor: 'pointer',
	display: 'flex',
	height: '24px',
	justifyContent: 'space-between',
	width: '58px',
};

const disableTextStyle = {
	fontSize: '14px',
	lineHeight: '26px',
	marginLeft: '10px',
};

const toggleRowStyle = {
	color: '#434343',
	display: 'flex',
	justifyContent: 'flex-start',
	marginBottom: '12px',
};

const toggleStyle = {
	backgroundColor: '#8E354A',
	height: '24px',
	width: '50%',
};

const toggleLabelStyle = {
	color: '#B3435D',
	fontWeight: '500',
	textAlign: 'center',
	width: '50%',
};

const headerStyle = {
	color: '#B3435D',
	marginBottom: '12px',
};

const selectStyle = {
	backgroundColor: '#FEF5F6',
	border: '1px solid #FEEFEA',
	color: '#434343',
	cursor: 'pointer',
	height: '24px',
	outline: 'none',
	width: '150px',
};

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

function toggleDisabled() {
	disabled = !disabled;
	toggleContainer.style.flexDirection = disabled ? 'row-reverse' : 'row';
	toggleLabel.innerHTML = disabled ? 'On' : 'Off';
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

function changeSyntaxStyle(e) {
	return { style: JSON.stringify(styles[e.target.value])}
}

const disableText = createElement('div', disableTextStyle, {}, ['Disable']);

const toggleText = disabled ? 'On' : 'Off';
const toggleLabel = createElement('div', toggleLabelStyle, {}, [toggleText]);
const toggle = createElement('div', toggleStyle);

const toggleContainerPlusTextStyle = Object.assign({}, toggleContainerStyle, { flexDirection: disabled ? 'row-reverse' : 'row' })

const toggleContainer = createElement('div', toggleContainerPlusTextStyle, { onclick: sendMessageToTab(toggleDisabled) }, [toggle, toggleLabel]);
const toggleRow = createElement('div', toggleRowStyle, {}, [toggleContainer, disableText]);

const app = document.getElementById('app');
const header = createElement('h3', headerStyle, {}, ['Chrome-prettier']);
app.appendChild(header);
app.appendChild(toggleRow);


function formatLabel(labelName) {
	const labelWithSpaces = labelName.replace(/[A-Z]/g, (match, offset, string) => ` ${match}`);
	const capitalizedLabel = labelWithSpaces[0].toUpperCase().concat(labelWithSpaces.slice(1));
	
	return capitalizedLabel;
}

const styleOptions = Object.keys(styles).map(style => {
	return createElement('option', {}, { value: style }, [formatLabel(style)])
});

const select = createElement('select', selectStyle, { onchange: sendMessageToTab(changeSyntaxStyle) }, styleOptions);
app.appendChild(select);
