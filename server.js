import express from 'express';
import bodyParser from 'body-parser';
import { readFileSync, writeFileSync } from 'fs';

const app = express();
const port = 3000;
const filePath = './users.json';

app.use(bodyParser.json());
app.use(express.static('public'));

// Helper functions to read and write JSON data
const getUsers = () => {
  const data = readFileSync(filePath);
  return JSON.parse(data);
};

const saveUsers = (users) => {
  writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// API to get all users
app.get('/api/users', (req, res) => {
  const users = getUsers();
  res.json(users);
});

// API to create a new user
app.post('/api/users', (req, res) => {
  const users = getUsers();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name: req.body.name,
    email: req.body.email,
  };
  users.push(newUser);
  saveUsers(users);
  res.json(newUser);
});

// API to update a user
app.put('/api/users/:id', (req, res) => {
  const users = getUsers();
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { id, name: req.body.name, email: req.body.email };
    saveUsers(users);
    res.json(users[userIndex]);
  } else {
    res.status(404).send('User not found');
  }
});

// API to delete a user
app.delete('/api/users/:id', (req, res) => {
  let users = getUsers();
  const id = parseInt(req.params.id);
  users = users.filter((user) => user.id !== id);
  saveUsers(users);
  res.sendStatus(204);  // No content to return
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});