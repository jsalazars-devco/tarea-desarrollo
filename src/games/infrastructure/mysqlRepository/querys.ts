export const FIND = 'SELECT * FROM games';

export const FIND_BY_ID = 'SELECT * FROM games WHERE id = ?';

export const FIND_BY_NAME = 'SELECT * FROM games WHERE name = ?';

export const CREATE = 'INSERT INTO games (name, stock, price, imageUrl) VALUES (?, ?, ?, ?)';
