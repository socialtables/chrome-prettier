// checked div color = #8E354A

function createElement(tagName, style = {}, props = {}) {
	const element = document.createElement(tagName);
	const styleKeys = Object.keys(style);
	styleKeys.forEach(key => {
		element.style[key] = style[key];
	});
	const propKeys = Object.keys(props);
	propKeys.forEach(key => {
		element[key] = props[key];
	});
	return element;
}

const checkboxStyle = {
	height: '24px',
	width: '58px',
	display: 'flex',
	backgroundColor: '#FEDFE1'
};

const checkbox = createElement('div', checkboxStyle);
document.getElementById('app').appendChild(checkbox);

setTimeout(() => {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { disabled: false });
	});
}, 3000);