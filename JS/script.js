class User {
    constructor(firstName, lastName, position, salary, userId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.position = position;
        this.salary = salary;
        this.userId = userId;
    }
}


class Store {
    static getUsers() {
        let users;
        if (localStorage.getItem('users') === null) {
            users = [];
        } else {
            users = JSON.parse(localStorage.getItem('users'))
        }
        return users
    };

    static addUser(user) {
        const users = Store.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    };

    static removeUser(userId) {
        const users = Store.getUsers();
        users.forEach((user, index) => {
            if (user.userId == userId) {
                users.splice(index, 1);
            }
            localStorage.setItem('users', JSON.stringify(users));
        })
    }

    static usersNumber() {
        const users = Store.getUsers();
        return users.length;
    }

    static editUser(userId, editedUser) {
        const users = Store.getUsers();

        users.forEach((user, index) => {
            if (user.userId == userId) {
                user = {...editedUser }
                users.splice(index, 1, user);
                localStorage.setItem('users', JSON.stringify(users));
            }
        })
    }

    static updateUser(userId) {
        const users = Store.getUsers();
        let editingUser;
        users.forEach((user) => {
            if (user.userId == userId) {
                editingUser = user;
            }
        })
        return editingUser;
    }
}

class UI {
    static displayUsers() {
        const users = Store.getUsers();
        users.forEach((user) => UI.addUserToStaff(user));
    }

    static addUserToStaff(user) {
        const list = document.querySelector('#user-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.position}</td>
            <td>${user.salary}</td>
            <td>${user.userId}</td>
            <td>  ///data-userId = "${user.userId}"
                <a href="#" data-type="edit" class="btn btn-success btn-sm delete">&#9998;</a>
                <a href="#" data-type="delete" class="btn btn-danger btn-sm delete">X</a>
            </td>
        `;
        list.appendChild(row);
    }

    static clearUserInputValue() {
        document.querySelector('#firstName').value = '';
        document.querySelector('#lastName').value = '';
        document.querySelector('#position').value = '';
        document.querySelector('#salary').value = '';
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.innerHTML = message;
        document.querySelector('#alert-container').append(div);
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000)
    }
    
    static deleteUser(value) {
        value.parentElement.parentElement.remove();
    }

    static editUserInputValue(user) {
        document.querySelector('#firstName').value = user.firstName;
        document.querySelector('#lastName').value = user.lastName;
        document.querySelector('#position').value = user.position;
        document.querySelector('#salary').value = user.salary;
    }

    static EditUser(usersRow, editingUser) {
        usersRow.forEach(user => {
            if (user.children[4].innerHTML == editingUser.userId) {
                user.children[0].innerHTML = editingUser.firstName;
                user.children[1].innerHTML = editingUser.lastName;
                user.children[2].innerHTML = editingUser.position;
                user.children[3].innerHTML = editingUser.salary;
            }
        })
    }
}

id_count = 0;

const newUser = document.getElementById('newUser');
const form_content = document.querySelector('.form_content');
const form_container = document.querySelector('.form_container');
const close_content = document.querySelector('.close_content');
const editButton = document.getElementById('editButton');
const addUser = document.getElementById('addUser');

document.getElementById('addUser').style.display = 'none';

function addClass(elem, className = 'active') {
    elem.classList.add(className);
}

function removeClass(elem, className = 'active') {
    elem.classList.remove(className);
}

function showFormContent() {
    addClass(form_container);
}

function hideFormContent() {
    if (editButton) {
        editButton.style.display = 'none';
    }

    if (addUser) {
        addUser.style.display = 'none';
    }
    UI.clearUserInputValue();
    removeClass(form_container);
}


newUser.addEventListener('click', showFormContent);
newUser.addEventListener('click', () => {
    addUser.style.display = 'block';
})

close_content.addEventListener('click', hideFormContent);

const generateRandomId = () => Date.now().toString().slice(-5);
// event
document.addEventListener('DOMContentLoaded', () => {
    usersNumber(id_count)
})

document.addEventListener('DOMContentLoaded', () => {
    UI.displayUsers();
    usersNumber();
})

document.querySelector('#user-form').addEventListener('submit', e => {
    e.preventDefault();
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const position = document.querySelector('#position').value;
    const salary = document.querySelector('#salary').value;
    if (firstName && lastName && position && salary) {
        const user = new User(firstName, lastName, position, salary, generateRandomId());
        UI.addUserToStaff(user);
        UI.clearUserInputValue();
        UI.showAlert('Added User', 'success');
        Store.addUser(user);
        usersNumber();
    } else {
        UI.showAlert('Empty input', 'danger');
    }
    hideFormContent()
})

function getUserId(elem) {
    return elem.parentElement.previousElementSibling.innerHTML;
}

document.querySelector('#user-list').addEventListener('click', e => {
    if (e.target.closest('[data-type="delete')) {
        const userId = getUserId(e.target);
        Store.removeUser(userId);
        UI.deleteUser(e.target);
        usersNumber()
    }

    if (e.target.closest('[data-type="edit')) {
        showFormContent();
        const userId = getUserId(e.target);
        const editingUser = Store.updateUser(userId);
        UI.editUserInputValue(editingUser);
        editButton.setAttribute('data-userId', userId)
        editButton.style.display = 'block';
    }
})

editButton.addEventListener('click', () => {
    const userId = editButton.getAttribute('data-userId');
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const position = document.querySelector('#position').value;
    const salary = document.querySelector('#salary').value;
    if (firstName && lastName && position && salary) {
        const editedUser = new User(firstName, lastName, position, salary, userId);
        Store.editUser(userId, editedUser);
        const usersRows = document.querySelectorAll('#user-list>tr');
        UI.EditUser(usersRows, editedUser);
    }
    hideFormContent();
    UI.showAlert('Edited User', 'success');
})

function usersNumber() {
    const ids = Store.usersNumber();
    const users_number = document.getElementById('users_number');
    users_number.innerHTML = `${ids} users`
}