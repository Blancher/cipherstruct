import getSecondIndex from './getSecondIndex';

export default function cipher(text, string, mode) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let newString = '';

    for (let i = 0; i < text.length; i++) {
        if (!alphabet.includes(text[i].toUpperCase())) {
            newString += text[i];
            continue;
        }

        let letter = text[i];

        for (let j = 0; j < string.length; j += 2) {
            letter = (mode === 'encrypt' && string[j] === '+') || (mode === 'decrypt' && string[j] === '-') ? alphabet[getSecondIndex(alphabet, letter) + +string[j+1]] : alphabet[getSecondIndex(alphabet, letter) - +string[j+1]];
        }

        newString += letter;
    }

    return newString;
}