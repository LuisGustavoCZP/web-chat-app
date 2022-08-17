import messager from "./messager.js";
import createEmojiWindow from "./emojis.js";
import usersWindow from "./users.js";

const fileButton = document.getElementById("messager-file");
const audioButton = document.getElementById("messager-audio");

const profileButton = document.getElementById("user-profile");

messager.start();