const divider = 100;
const decimals = 2;

module.exports = {
    nonDecimalFormat: (value) => {
        return Math.round((value * divider));
    },

    decimalFormat: (value) => {
        return (value / divider).toFixed(decimals).toString();
    },
}
