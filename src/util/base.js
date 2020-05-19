/**
 * Chunk the array
 * @param {Array} arr
 * @param {Number} size
 */
export function chunk(arr, size) {
    if (!Array.isArray(arr)) {
        return [];
    }
    const result = [];
    const len = arr.length;
    let i = 0;
    size = size || len;
    while (i < len) {
        result.push(arr.slice(i, (i += size)));
    }
    return result;
}
