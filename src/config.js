require("dotenv").config();

const port = process.env.PORT;
const isSsl = process.env.SSL?process.env.SSL === "true" : false;

module.exports = {port, isSsl};