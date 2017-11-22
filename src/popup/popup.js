import * as styles from "react-syntax-highlighter/dist/styles";

let disabled = false;

const toggleContainerStyle = {
	alignItems: 'center',
	backgroundColor: '#FEDFE1',
	borderRadius: '4px',
	cursor: 'pointer',
	display: 'flex',
	height: '24px',
	justifyContent: 'space-between',
	width: '58px',
};

const disableTextStyle = {
	fontSize: '14px',
	lineHeight: '24px',
	marginLeft: '10px',
};

const toggleRowStyle = {
	color: '#8E354A',
	display: 'flex',
	justifyContent: 'flex-start',
	marginBottom: '12px',
};

const toggleStyle = {
	backgroundColor: '#8E354A',
	borderRadius: '4px 0 0 4px',
	height: '24px',
	width: '50%',
};

const toggleLabelStyle = {
	color: '#E16B8C',
	fontWeight: '500',
	textAlign: 'center',
	width: '50%',
};

const headerStyle = {
	color: '#8E354A',
	marginBottom: '12px',
};

const selectStyle = {
	height: '24px',
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
	toggle.style.borderRadius = disabled ? '0 4px 4px 0' : '4px 0 0 4px';
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

const styleOptions = Object.keys(styles).map(style => {
	return createElement('option', {}, { value: style }, [style])
});

const select = createElement('select', {}, { onchange: sendMessageToTab(changeSyntaxStyle) }, styleOptions);
app.appendChild(select);