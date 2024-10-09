document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('user-form');
  const userList = document.getElementById('user-list');
  const userIdField = document.getElementById('user-id');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');

  // Load all users on page load
  fetch('/api/users')
    .then((response) => response.json())
    .then((data) => {
      data.forEach(addUserToTable);
    });

  // Add or update user on form submit
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = userIdField.value;
    const name = nameField.value;
    const email = emailField.value;

    if (id) {
      // Update user
      fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      }).then(() => location.reload());
    } else {
      // Create new user
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      }).then(() => location.reload());
    }
  });

  // Add user to table
  function addUserToTable(user) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    userList.appendChild(row);
  }

  // Edit user
  window.editUser = (id, name, email) => {
    userIdField.value = id;
    nameField.value = name;
    emailField.value = email;
  };

  // Delete user
  window.deleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      fetch(`/api/users/${id}`, {
        method: 'DELETE',
      }).then(() => location.reload());
    }
  };
});