import {inputManager} from './input.js';

const userSetting = document.getElementById("user");
const userInput = document.getElementById("user-input");
const userSubmit = document.getElementById("user-submit");

function inputUser(e)
{
    inputManager(e, userInput, userSubmit, login);
}

function login ()
{
    const match = userInput.value.match(/(\w{1,}[ ])*\w{0,}/gi);
    if(!match || match.length == 0) return;
    const username = match[0].trim();
    console.log(username);
    location.assign(`/login?username=${username}`);
}

userInput.addEventListener('keydown', inputUser);
userSubmit.addEventListener('click', login);
userInput.focus();