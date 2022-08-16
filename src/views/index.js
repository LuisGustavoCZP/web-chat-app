const emojis = require('./emojis');
const { sendGlobalStyle } = require('./styles');
const { sendLogoIcon } = require('./images');
const { sendInputScript, sendIndexScript, sendLoginScript } = require('./scripts');
const { sendLoginPage, sendHomePage } = require('./pages');

module.exports = { emojis, sendGlobalStyle, sendLogoIcon, sendInputScript, sendIndexScript, sendLoginScript, sendLoginPage, sendHomePage }