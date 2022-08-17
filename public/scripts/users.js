import WindowModal from './modal.js';

class WindowUsers extends WindowModal
{
    #users;
    #userlist;

    constructor ()
    {
        super();
        this.#users = [];
        const display = document.createElement("div");
        this.#userlist = document.createElement("ul");
        display.appendChild(this.#userlist)
        this.content.appendChild(display);
    }

    update (users)
    {
        this.#users = users;
        this.#userlist.innerHTML = '';
        users.forEach(user => 
        {
            const li = document.createElement("li");
            const username = document.createElement("span");
            username.classList.add("username");
            username.innerText = user;
            li.appendChild(username);
            this.#userlist.appendChild(li);
        });
    }
}

customElements.define("window-users", WindowUsers);

const usersButton = document.getElementById("user-list");

function createUsersWindow ()
{
    const windowUsers = document.createElement("window-users");
    windowUsers.width = 300;
    windowUsers.height = 440;
    windowUsers.build("right");
    windowUsers.classList.add("userlist");
    windowUsers.style.right += `${usersButton.clientWidth}px`;

    function openWindow (e)
    {
        e.preventDefault();
        usersButton.onclick = undefined;
        windowUsers.onclose = closeWindow;
        usersButton.appendChild(windowUsers);
    }

    function closeWindow (e)
    {
        usersButton.onclick = openWindow;
        windowUsers.onclose = undefined;
        windowUsers.remove();
    }

    usersButton.onclick = openWindow;

    return windowUsers;
}

const usersWindow = createUsersWindow ();

export default usersWindow;