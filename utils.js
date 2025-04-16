/**
 * Generates a random number between -8 and 20 (inclusive)
 * @returns {number} Random number between -8 and 20
 */
function generateRandomNumber() {
    // Generate a random number between -8 and 20
    return Math.floor(Math.random() * (20 - (-8) + 1)) + (-8);
}

module.exports = {
    generateRandomNumber
};
