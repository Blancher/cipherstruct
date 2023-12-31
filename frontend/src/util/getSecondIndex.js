export default function getSecondIndex(array, element) {
    const firstIndex = array.indexOf(element.toUpperCase());
    const secondIndex = array.indexOf(element.toUpperCase(), firstIndex + 1);
    return secondIndex;
}