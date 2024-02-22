//server.js
const fs = require('fs');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const router = jsonServer.router('./database.json');
const db = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());
const morgan = require("morgan");
server.use(morgan("dev"));
const SECRET_KEY = '123456789';

const expiresIn = '1h';

function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => (decode !== undefined ? decode : err));
}

function isAuthenticated({ email, password }) {
  return db.users.findIndex((user) => user.email === email && user.password === password) !== -1;
}
server.put('/auth/update/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const { username, email, password } = req.body;

  const userIndex = db.users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    const status = 404;
    const message = 'Người dùng không tồn tại';
    res.status(status).json({ status, message });
    return;
  }

  db.users[userIndex] = { id: userId, username, email, password };

  fs.writeFile('./users.json', JSON.stringify(db), (err) => {
    if (err) {
      const status = 500;
      const message = 'Lỗi khi cập nhật thông tin người dùng';
      res.status(status).json({ status, message });
      return;
    }

    const status = 200;
    const message = 'Thông tin người dùng đã được cập nhật';
    res.status(status).json({ status, message });
  });
});
server.get('/auth/:username', (req, res) => {
  const username = req.params.username;
  const user = db.users.find((user) => user.username === username);

  if (!user) {
    const status = 404;
    const message = 'Không tìm thấy người dùng';
    res.status(status).json({ status, message });
    return;
  }

  res.status(200).json(user);
});
function isUsernameExists(username) {
  return db.users.findIndex((user) => user.username === username) !== -1;
}
server.post('/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra xem tên người dùng đã tồn tại hay chưa
  if (isUsernameExists(username)) {
    const status = 401;
    const message = 'Tên người dùng đã tồn tại';
    res.status(status).json({ status, message });
    return;
  }

  // Kiểm tra xem email và mật khẩu đã tồn tại chưa
  if (isAuthenticated({ email, password, username })) {
    const status = 401;
    const message = 'Email và Mật khẩu đã tồn tại';
    res.status(status).json({ status, message });
    return;
  }

  // Thêm người dùng vào cơ sở dữ liệu
  db.users.push({ id: db.users.length, username, email, password });

  fs.writeFile('./users.json', JSON.stringify(db), (err) => {
    if (err) {
      console.error('Error writing to db.json:', err);
      const status = 500;
      const message = 'Lỗi khi đăng ký người dùng';
      res.status(status).json({ status, message });
      return;
    }

    const access_token = createToken({ username, email, password });
    res.status(200).json({ access_token });
  });
});

server.post('/auth/login', (req, res) => {
  const { email, password, username } = req.body;

  if (!isAuthenticated({ email, password, username })) {
    const status = 401;
    const message = 'Email hoặc Mật khẩu không đúng';
    res.status(status).json({ status, message });
    return;
  }

  const user = db.users.find((user) => user.email === email && user.password === password);

  // Tạo một đối tượng chứa thông tin người dùng, bao gồm ID, để thêm vào token
  const userObject = { id: user.id, username: user.username, email, password, special: user.special };

  const access_token = createToken(userObject);
  res.status(200).json({ access_token });
});
server.get('/auth', (req, res) => {
  res.status(200).json(db.users);
});
server.put('/auth/change-password/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const userIndex = db.users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    const status = 404;
    const message = 'Người dùng không tồn tại';
    res.status(status).json({ status, message });
    return;
  }

  const existingUser = db.users[userIndex];

  // Kiểm tra mật khẩu cũ
  if (existingUser.password !== oldPassword) {
    const status = 401;
    const message = 'Mật khẩu cũ không đúng';
    res.status(status).json({ status, message });
    return;
  }

  // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
  if (newPassword !== confirmPassword) {
    const status = 400;
    const message = 'Mật khẩu mới và xác nhận mật khẩu mới không khớp';
    res.status(status).json({ status, message });
    return;
  }

  // Cập nhật mật khẩu mới
  existingUser.password = newPassword;

  fs.writeFile('./users.json', JSON.stringify(db), (err) => {
    if (err) {
      const status = 500;
      const message = 'Lỗi khi cập nhật mật khẩu';
      res.status(status).json({ status, message });
      return;
    }

    const status = 200;
    const message = 'Mật khẩu đã được cập nhật';
    res.status(status).json({ status, message });
  });
});
server.listen(8000, () => {
  console.log('Chạy Auth API Server trên cổng 8000');
});
