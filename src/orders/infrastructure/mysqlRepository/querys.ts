export const FIND_ALL = 'SELECT * FROM orders WHERE completed = 0';
export const FIND_GAMES_IN_ORDER = 'SELECT game_id, quantity FROM order_games WHERE game_id = ?';
export const FIND_GAME_BY_ID = 'SELECT price, stock FROM games WHERE id = ?';

export const FIND_BY_ID = 'SELECT * FROM games WHERE id = ?';

export const FIND_BY_NAME = 'SELECT * FROM games WHERE name = ?';

export const CREATE = 'INSERT INTO games (name, stock, price, imageUrl) VALUES (?, ?, ?, ?)';

export const CREATE_WITH_ID = 'INSERT INTO games (id, name, stock, price, imageUrl) VALUES (?, ?, ?, ?, ?)';

export const UPDATE_BY_ID = 'UPDATE games SET name = ?, stock = ?, price = ?, imageUrl = ? WHERE id = ?';

export const DELETE_BY_ID = 'DELETE FROM games WHERE id = ?';
