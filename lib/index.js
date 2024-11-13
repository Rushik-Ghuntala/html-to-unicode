"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToUnicode = htmlToUnicode;
// Define the mapping of characters to Unicode bold, italic, and underline
const boldMap = {
    A: "𝗔",
    B: "𝗕",
    C: "𝗖",
    D: "𝗗",
    E: "𝗘",
    F: "𝗙",
    G: "𝗚",
    H: "𝗛",
    I: "𝗜",
    J: "𝗝",
    K: "𝗞",
    L: "𝗟",
    M: "𝗠",
    N: "𝗡",
    O: "𝗢",
    P: "𝗣",
    Q: "𝗤",
    R: "𝗥",
    S: "𝗦",
    T: "𝗧",
    U: "𝗨",
    V: "𝗩",
    W: "𝗪",
    X: "𝗫",
    Y: "𝗬",
    Z: "𝗭",
    a: "𝗮",
    b: "𝗯",
    c: "𝗰",
    d: "𝗱",
    e: "𝗲",
    f: "𝗳",
    g: "𝗴",
    h: "𝗵",
    i: "𝗶",
    j: "𝗷",
    k: "𝗸",
    l: "𝗹",
    m: "𝗺",
    n: "𝗻",
    o: "𝗼",
    p: "𝗽",
    q: "𝗾",
    r: "𝗿",
    s: "𝘀",
    t: "𝘁",
    u: "𝘂",
    v: "𝘃",
    w: "𝘄",
    x: "𝘅",
    y: "𝘆",
    z: "𝘇",
    "0": "𝟬",
    "1": "𝟭",
    "2": "𝟮",
    "3": "𝟯",
    "4": "𝟰",
    "5": "𝟱",
    "6": "𝟲",
    "7": "𝟳",
    "8": "𝟴",
    "9": "𝟵",
};
const italicMap = {
    A: "𝑎",
    B: "𝑏",
    C: "𝑐",
    D: "𝑑",
    E: "𝑒",
    F: "𝑓",
    G: "𝑔",
    H: "ℎ",
    I: "𝑖",
    J: "𝑗",
    K: "𝑘",
    L: "𝑙",
    M: "𝑚",
    N: "𝑛",
    O: "𝑜",
    P: "𝑝",
    Q: "𝑞",
    R: "𝑟",
    S: "𝑠",
    T: "𝑡",
    U: "𝑢",
    V: "𝑣",
    W: "𝑤",
    X: "𝑥",
    Y: "𝑦",
    Z: "𝑧",
    a: "𝑎",
    b: "𝑏",
    c: "𝑐",
    d: "𝑑",
    e: "𝑒",
    f: "𝑓",
    g: "𝑔",
    h: "𝑕",
    i: "𝑖",
    j: "𝑗",
    k: "𝑘",
    l: "𝑙",
    m: "𝑚",
    n: "𝑛",
    o: "𝑜",
    p: "𝑝",
    q: "𝑞",
    r: "𝑟",
    s: "𝑠",
    t: "𝑡",
    u: "𝑢",
    v: "𝑣",
    w: "𝑤",
    x: "𝑥",
    y: "𝑦",
    z: "𝑧",
    "0": "𝟎",
    "1": "𝟏",
    "2": "𝟐",
    "3": "𝟑",
    "4": "𝟒",
    "5": "𝟓",
    "6": "𝟖",
    "7": "𝟕",
    "8": "𝟖",
    "9": "𝟗",
    " ": " ",
};
// Underline mapping function using combining low line character (U+0332)
function toUnderlineUnicode(text) {
    return text
        .split("")
        .map((char) => char + "\u0332")
        .join("");
}
// Function to convert text to bold Unicode with type guard
function toBoldUnicode(text) {
    return text
        .split("")
        .map((char) => char in boldMap ? boldMap[char] : char)
        .join("");
}
// Function to convert text to italic Unicode with type guard
function toItalicUnicode(text) {
    return text
        .split("")
        .map((char) => char in italicMap ? italicMap[char] : char)
        .join("");
}
// Function to convert HTML to Unicode, handling specific tags and child list indentation
function htmlToUnicode(html) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    function traverseNode(node, listLevel = 0) {
        let result = "";
        if (node.nodeType === Node.TEXT_NODE) {
            result = node.textContent || "";
        }
        else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (element.tagName === "STRONG" || element.tagName === "B") {
                result += toBoldUnicode(Array.from(element.childNodes).map(traverseNode).join(""));
            }
            else if (element.tagName === "EM") {
                result += toItalicUnicode(Array.from(element.childNodes).map(traverseNode).join(""));
            }
            else if (element.tagName === "U") {
                result += toUnderlineUnicode(Array.from(element.childNodes).map(traverseNode).join(""));
            }
            else if (element.tagName === "P") {
                result +=
                    Array.from(element.childNodes).map(traverseNode).join("") + "\n";
            }
            else if (element.tagName === "UL") {
                result +=
                    "\n" +
                        Array.from(element.childNodes)
                            .map((child) => "• " + traverseNode(child, listLevel + 1))
                            .join("\n") +
                        "\n";
            }
            else if (element.tagName === "OL") {
                let counter = 1;
                result +=
                    "\n" +
                        Array.from(element.childNodes)
                            .map((child) => `${counter++}. ${traverseNode(child, listLevel + 1)}`)
                            .join("\n") +
                        "\n";
            }
            else if (element.tagName === "LI") {
                // Indent child lists based on nesting level
                const indentation = "  ".repeat(listLevel);
                result += indentation + Array.from(element.childNodes).map(traverseNode).join("") + "\n"; // Add line break after each <li>
            }
            else {
                result += Array.from(element.childNodes).map(traverseNode).join("");
            }
        }
        return result;
    }
    return traverseNode(tempElement).trim();
}
// Example usage
const normalHtml = `<p>🖋️ <em>Ever felt the power of words?</em></p><p>Just like a good outfit needs the right accessories, great writing requires the right emphasis! 🚀</p><ul><li>✨ <strong>Bold</strong>: Grab attention!</li><li>✨ <em>Italic</em>: Add finesse.</li><li>✨ <u>Underline</u>: Highlight info.</li></ul>`;
const unicodeHtml = htmlToUnicode(normalHtml);
console.log(unicodeHtml);