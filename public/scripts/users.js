import WindowModal from './modal.js';

class WindowUsers extends WindowModal
{
    #users;
    #userlist;
    #onclickuser;

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
        this.#users = users.sort((a, b) => 
        {
            if(a.online && !b.online) return -1;
            if(a.online && b.online) return 0;
            if(!a.online && b.online) return 1;
        });
        
        this.#userlist.innerHTML = '';
        users.forEach(user => 
        {
            const li = document.createElement("li");

            const click = document.createElement("button");
            if(user.online) 
            {
                li.classList.add("online");
                click.onclick = () => 
                {
                    if(this.#onclickuser) this.#onclickuser(user)
                };
            }

            const username = document.createElement("span");
            username.classList.add("username");
            username.innerText = user.name;
            click.appendChild(username);
            const userstatus = document.createElement("span");
            userstatus.classList.add("userstatus");
            userstatus.classList.add("material-symbols-rounded");
            userstatus.innerText = "person";
            click.appendChild(userstatus);

            li.appendChild(click);
            this.#userlist.appendChild(li);
        });
    }

    getUser (userid)
    {
        return this.#users.find((user) => user.id === userid);
    }

    set onclickuser (callback)
    {
        this.#onclickuser = callback;
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