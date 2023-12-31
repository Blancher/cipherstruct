export default function sum(input) {
    let total = 0;

    for (let i = 0; i < input.length; i += 2) {
        input[i] === '+' ? total += +input[i+1] : total -= +input[i+1];
    }

    return input.length % 2 === 0 ? total >= -26 && total <= 26 : true;
}