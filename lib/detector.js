const detectItems = new Map();
const detectStatus = new Map();

export function clear() {
	detectItems.clear();
	detectStatus.clear();
}

export function hasKey(key) {
	return detectItems.has(key);
}

export function set(key, item) {
	if (!key || !item)
		return console.error("Error: key or item does not exist.");

	detectItems.set(key, (typeof item === "object") ? recursiveCopied(item) : item);
	detectStatus.set(key, {isChanged: false, detected: []});
}

export function get(key) {
	if (!key || !detectItems.get(key))
		return console.error("Error: item does not exist.");

	return detectItems.get(key);
}

export function release(key) {
	if (!key || !detectItems.has(key))
		return console.error("Error: item does not exist.");

	detectItems.delete(key);
	detectStatus.delete(key);
}

export function detect(key, changeItem, { size = false, excludes = [] } = {}) {
	if (!key || !detectItems.has(key) || !changeItem)
		return console.error("Error: item does not exist.");
	if (typeof detectItems.get(key) !== typeof changeItem)
		return console.error("Error: Different Type.");

	const {detect, change} = excludeItems(detectItems.get(key), changeItem, excludes);
	if (size && (Object.keys(detect).length !== Object.keys(change).length)) {
		updateStatus(key, true, detect, change);

		return detectStatus.get(key);
	}

	return detectChange(key, detect, change, size);
}

function detectChange(detectKey, detectItem, changeItem, isSize) {
	if (typeof detectItem !== "object" && typeof changeItem !== "object") {
		if (detectItem !== changeItem)
			updateStatus(detectKey, true, detectItem, changeItem)

		return detectStatus.get(detectKey);
	}

	if (isSize && (Object.keys(detectItem).length !== Object.keys(changeItem).length)) {
		updateStatus(detectKey, true, detectItem, changeItem);

		return detectStatus.get(detectKey);
	}

	Object.entries(detectItem).map(([key, value]) => {
		const detect = value;
		const change = changeItem[key];

		if (!detect && !change)
			return;
		if ((detect !== change) && (!detect || !change))
			return updateStatus(detectKey, true, detect, change);

		detectChange(detectKey, value, changeItem[key], isSize);
	});

	return detectStatus.get(detectKey);
}

function updateStatus(key, isChanged, detectItem, changeItem) {
	const status = detectStatus.get(key);
	status.isChanged = isChanged;
	status.detected.push({
		detect: detectItem,
		change: changeItem
	});

	detectStatus.set(key, status);
}

function excludeItems(detectItem, changeItem, excludes) {
	return {
		detect: (typeof detectItem !== "object") ? detectItem : recursiveExclude(detectItem, excludes),
		change: (typeof changeItem !== "object") ? changeItem : recursiveExclude(changeItem, excludes)
	}
}

function recursiveExclude(item, excludes) {
	const copied = {};
	for (const [key, value] of Object.entries(item)) {
		if (excludes.includes(key)) continue;

		copied[key] = (typeof value !== "object" || !value) ? item[key] : recursiveExclude(value, excludes);
	}

	return copied;
}

function recursiveCopied(item) {
	const copied = {};
	for (const [key, value] of Object.entries(item))
		copied[key] = (typeof value !== "object" || !value) ? item[key] : recursiveCopied(value);

	return copied;
}