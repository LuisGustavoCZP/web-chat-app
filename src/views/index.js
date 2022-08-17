const emojis = require('./emojis');
const { sendGlobalStyle } = require('./styles');
const { sendLogoIcon } = require('./images');
const { sendScript } = require('./scripts');
const { sendLoginPage, sendHomePage } = require('./pages');

module.exports = { emojis, sendGlobalStyle, sendLogoIcon, sendScript, sendLoginPage, sendHomePage }