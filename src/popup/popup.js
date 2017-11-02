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
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		disabled = !disabled;
		toggleContainer.style.justifyContent = disabled ? 'flex-end' : 'flex-start';
		chrome.tabs.sendMessage(tabs[0].id, { disabled });
	});
}

const toggleText = createElement('div', {}, {}, ['disable']);

const toggleContainer = createElement('div', toggleContainerStyle, { onclick: toggleDisabled });
document.getElementById('app').appendChild(toggleContainer)
document.getElementById('app').appendChild(toggleText);

const toggleStyle = {
	backgroundColor: '#8E354A',
	height: '24px',
	width: '29px',
	borderRadius: '4px',
};

const toggle = createElement('div', toggleStyle);
toggleContainer.appendChild(toggle);
