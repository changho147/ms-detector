const _detectItemsMap = new Map();
const _detectStatusMap = new Map();

function _changedDetect(detectItem, changeItem, key) {
    const statusItem = _detectStatusMap.get(key);

    if (typeof detectItem !== "object") {
        if (detectItem !== changeItem) {
            statusItem.isChanged = true;
            statusItem.detected.push({
                detectedItem: detectItem,
                changedItem: changeItem
            });
        }
    } else {
        Object.entries(detectItem).map(([itemKey, value]) => _changedDetect(value, changeItem[itemKey], key));
    }
    _detectStatusMap.set(key, statusItem);

    return _detectStatusMap.get(key);
}

function _deepCopy(item) {
    const cloneItem = {};
    for (const [key, value] of Object.entries(item))
        cloneItem[key] = (!value || typeof value !== "object") ? item[key] : _deepCopy(value);

    return cloneItem;
}

export function clear() {
    _detectItemsMap.clear();
    _detectStatusMap.clear();
}

export function set(key, item) {
    if (!key || !item)
        return console.error("Key or Items does not exist");

    _detectItemsMap.set(key, (typeof item !== "object") ? item : _deepCopy(item));
    _detectStatusMap.set(key, {isChanged: false, detected: []});
}

export function get(key) {
    if (!key || !_detectItemsMap.get(key))
        return console.error("DetectItem does not exist");

    return _detectItemsMap.get(key);
}

export function release(key) {
    if (!key || !_detectItemsMap.has(key))
        return console.error("DetectItem does not exist");

    _detectItemsMap.delete(key);
    _detectStatusMap.delete(key);
}

export function detect(key, item, {length = false} = {}) {
    if (!key || !_detectItemsMap.has(key))
        return console.error("DetectItem does not exist");

    const detectItem = _detectItemsMap.get(key);
    const statusItem = _detectStatusMap.get(key);
    if (statusItem.detected || statusItem.detected.length > 0)
        _detectStatusMap.set(key, {isChanged: false, detected: []});

    if (typeof detectItem === "object" && (length && Object.keys(detectItem).length !== Object.keys(item).length)) {
        statusItem.isChanged = true;
        statusItem.detected.push({
            detectedItem: detectItem,
            changedItem: item
        });
        _detectStatusMap.set(key, statusItem);

        return _detectStatusMap.get(key);
    }

    return _changedDetect(detectItem, item, key);
}
