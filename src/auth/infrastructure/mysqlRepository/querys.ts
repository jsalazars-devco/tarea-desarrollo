export const FIND_ALL = 'SELECT * FROM users';

export const FIND_BY_ID = 'SELECT * FROM users WHERE id = ?';

export const FIND_BY_USERNAME = 'SELECT * FROM users WHERE username = ?';

export const CREATE = 'INSERT INTO users (username, password, admin) VALUES (?, ?, ?, ?)';

export const CREATE_WITH_ID = 'INSERT INTO users (id, username, password, admin) VALUES (?, ?, ?, ?, ?)';

export const UPDATE_BY_ID = 'UPDATE users SET username = ?, password = ?, admin = ? WHERE id = ?';

export const DELETE_BY_ID = 'DELETE FROM users WHERE id = ?';
