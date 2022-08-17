import { waitTime } from "./wait.js";

const logs = document.getElementById("logs-list");

async function update (data)
{
    const li = document.createElement("li");
    li.innerText = data;
    logs.append(li);
    await waitTime(1000);
    /* li.classList.add("fadeout");
    await waitTime(500);
    li.classList.remove("fadeout"); */
    li.remove();
}

export default { update };