document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('user-form');
  const userList = document.getElementById('user-list');
  const userIdField = document.getElementById('user-id');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const phoneField = document.getElementById('phone');

  // Display current users when page loads
  const showUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    data.forEach(addUserToTable);
  };

  showUsers();

  // Allow you to add or update user on form submission (based on whether the id exists already)
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = userIdField.value;
    const name = nameField.value;
    const email = emailField.value;
    const phone = phoneField.value;

    if (id) {
      await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
    } else {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
    }

    location.reload();
  });

  // Add user to table
  function addUserToTable(user) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>
        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}','${user.phone}')">Edit</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    userList.appendChild(row);
  }

  // Edit user
  window.editUser = (id, name, email, phone) => {
    userIdField.value = id;
    nameField.value = name;
    emailField.value = email;
    phoneField.value = phone;
  };

  // Delete user with confirmation pop up
  window.deleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      location.reload();
    }
  };
});