import express from 'express';
import bodyParser from 'body-parser';
import { readFile, writeFile } from 'fs/promises';

const app = express();
const port = 3000;
const filePath = './users.json';

app.use(bodyParser.json());
app.use(express.static('public'));


// Pulling JSON data

const getUsers = async () => {
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

const saveUsers = async (users) => {
  try {
    await writeFile(filePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Adding in CRUD functionality

// Get request
app.get('/api/users', async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

// Post request
app.post('/api/users', async (req, res) => {
  const users = await getUsers();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone 
  };
  users.push(newUser);
  await saveUsers(users);
  res.json(newUser);
});

// Put request (instead of patch)
app.put('/api/users/:id', async (req, res) => {
  const users = await getUsers();
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex !== -1) {
    users[userIndex] = {
      id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    await saveUsers(users);
    res.json(users[userIndex]);
  } else {
    res.status(404).send('User not found');
  }
});

// Delete request
app.delete('/api/users/:id', async (req, res) => {
  let users = await getUsers();
  const id = parseInt(req.params.id);
  users = users.filter((user) => user.id !== id);

  await saveUsers(users);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});