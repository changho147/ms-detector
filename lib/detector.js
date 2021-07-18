const _detectItems = new Map();

export function clear() {
    _detectItems.clear();
}

export function set(key, item) {
    if (!key || !item)
        return console.error("Key or Items does not exist");

    _detectItems.set(key, (typeof item !== "object") ? item : _deepCopy(item));
}

export function put(key) {
    if (!key || !_detectItems.has(key))
        return console.error("DetectItem does not exist");

    _detectItems.delete(key);
}

export function detect(key, item, {length = false} = {}) {
    if (!key || !_detectItems.has(key))
        return console.error("DetectItem does not exist");

    return _changedDetect(_detectItems.get(key), item, {length: length});
}

function _changedDetect(detectItem, changedItem, {length = false} = {}) {
    let isChanged = false;
    if (typeof detectItem !== "object") {
        if (detectItem !== changedItem)
            isChanged = true;
    } else {
        if (length && Object.keys(detectItem).length !== Object.keys(changedItem).length)
            return true;

        isChanged = Object.entries(detectItem).some(([key, value]) => _changedDetect(value, changedItem[key]));
    }

    return isChanged;
}

function _deepCopy(item) {
    const cloneItem = {};
    for (const [key, value] of Object.entries(item))
        cloneItem[key] = (!value || typeof value !== "object") ? item[key] : _deepCopy(value);

    return cloneItem;
}