const usersBox = document.getElementById("users-list");

const search = document.getElementById("searchUser");

let users = [];

async function loadUsers(){

    const response = await fetch("https://snackible-backend.onrender.com/api/users");

    users = await response.json();

    display(users);

}

function display(list){

    console.log(list);

    usersBox.innerHTML = "";

    if(list.length === 0){

        usersBox.innerHTML = "<h3>No Users Found</h3>";

        return;

    }

    list.forEach(user=>{

        usersBox.innerHTML += `

        <div class="user-card">

            <div class="user-info">

                <h3>${user.name}</h3>

                <p>📧 ${user.email}</p>

                <p>📱 ${user.phone || "Not Available"}</p>

                <small>

                    Joined :
                    ${new Date(user.createdAt).toLocaleDateString()}

                </small>

            </div>

            <button
                class="delete-btn"
                onclick="deleteUser('${user._id}')">

                Delete

            </button>

        </div>

        `;

    });

}

search.addEventListener("input",()=>{

    const value = search.value.toLowerCase();

    display(

        users.filter(user=>

            user.name.toLowerCase().includes(value) ||

            user.email.toLowerCase().includes(value)

        )

    );

});

async function deleteUser(id){

    if(!confirm("Delete this user?")) return;

    await fetch(`https://snackible-backend.onrender.com/api/users/${id}`,{

        method:"DELETE"

    });

    loadUsers();

}

loadUsers();