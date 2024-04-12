//const urlBase = "http://localhost:3000";
//Online
const urlBase = "https://json-server-15ec.onrender.com";
const userName = document.querySelector('#userName');
const userAge = document.querySelector('#userAge');
const userId = document.querySelector('#userId');
const form = document.querySelector('#form');
const tbody = document.querySelector('#tbody');

// renderUsers();

document.addEventListener("DOMContentLoaded", () => {
    userId.value = "";
    userAge.value = "";
    userName.value = "";
    renderUsers();
})

document.body.addEventListener("click", event => {

    console.log("Holaaa");
    const id = event.target.getAttribute("userId");
    if (event.target.classList.contains("btn-delete")) {
        // console.log(event.target);
        // const id = event.target.getAttribute("userId");
        deleteUser(id);
    }
    if (event.target.classList.contains("btn-editar")) {
        // console.log("Editar", event.target.getAttribute("userId"));
        fillUser(id);
    }
    // console.log(event.target.classList.contains("btn-delete"));

});

async function fillUser(id) {
    // Al hacer un consumo, requiere un await
    const user = await getUserById(id);

    // Igualar cada input al valor que nos llega 
    // enviando los valores del servicio al HTML
    
    userId.value = user.id;
    userName.value = user.name;
    userAge.value = user.age;
}


async function getUsers() {
    const response = await fetch(`${urlBase}/users`);
    const data = response.json(); // no se coloca await porque arriba ya está cumplida la promesa
    console.log(data);
    return data;
}

async function getUserById(id) {
    const response = await fetch(`${urlBase}/users/${id}`);
    const data = response.json(); // no se coloca await porque arriba ya está cumplida la promesa
    console.log(data);
    return data;
}

async function createUser(user) {
    await fetch(`${urlBase}/users`, {
        method: "POST", // se especifica el método porque por degecto es GET
        headers: {
            "Content-Type": "application/json" // Especificarle  que el json es de tipo strig. La transferencia de datos con la que se hace es mediante datos tipo texto en formato json, si no se le especifica el formato lo toma como texto plano.
        },
        body: JSON.stringify(user) // Lo convertimos a string
    });

    renderUsers();
}

async function updateUser(id, user) {
    await fetch(`${urlBase}/users/${id}`, {
        method: "PUT", // se especifica el método porque por degecto es GET
        headers: {
            "Content-Type": "application/json" // Especificarle  que el json es de tipo strig
        },
        body: JSON.stringify(user) // Lo convertimos a string
    });

    renderUsers();
}

async function deleteUser(id) {
    await fetch(`${urlBase}/users/${id}`, {
        method: "DELETE" // se especifica el método porque por degecto es GET
    });
    renderUsers();
}


async function renderUsers() {
    const users = await getUsers();

    tbody.innerHTML = ''; // Para limpiar y que no se duplique la lista

    users.forEach(user => {
        tbody.innerHTML += `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.age}</td>
            <td>
                <button class="btn btn-info btn-editar" userId="${user.id}">Editar</button>
                <button class="btn btn-danger btn-delete" userId="${user.id}">Eliminar</button>
            </td>
        </tr>
        `;
    });

    //Se resetea las variables porque no lo coge el DOM en vercel,
    // asi hace que se pueda volver a crear usuario sin esto va a actualizar el ultimo de editar y no agregaria
    
    userId.value = "";
    userAge.value = "";
    userName.value = "";
}

//Va a ser la diferenciaentre manipular el dom y de ver el servicio que tenemos por a parte
async function createUserDOM() {
    const user = {
        name: userName.value,
        age: userAge.value
    }

    if (userId.value) {
        // se le envía el id y el usuario
        await updateUser(userId.value, user);

    } else {

        await createUser(user);
    }

    // await createUser(user)
}

// Cuando ya exista el ID lo que queremos es editarlo no volverlo a crear porque ya existe


form.addEventListener("submit", (event) => {
    event.preventDefault(); // para quitarle el comportsmiento quer tiene por defecto el formulario de enviarse
    createUserDOM(); // 
    renderUsers(); // este hace la actualización d ela página
});

