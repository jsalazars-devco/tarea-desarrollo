export const FIND_ALL =
    `SELECT
        orders.id,
        orders.customer, 
        GROUP_CONCAT(DISTINCT games.id, ':', games.price, ':', order_games.quantity) AS games,
        orders.completed
    FROM orders
    LEFT JOIN order_games ON orders.id = order_games.order_id
    LEFT JOIN games ON order_games.game_id = games.id
    WHERE orders.completed = false
    GROUP BY orders.id
    `;

export const FIND_BY_ID =
    `SELECT
        orders.id,
        orders.customer, 
        GROUP_CONCAT(DISTINCT games.id, ':', games.price, ':', order_games.quantity) AS games,
        orders.completed
    FROM orders
    LEFT JOIN order_games ON orders.id = order_games.order_id
    LEFT JOIN games ON order_games.game_id = games.id
    WHERE orders.completed = false AND orders.id = ?
    GROUP BY orders.id
    `;

export const CREATE = 'INSERT INTO orders (customer, completed) VALUES (?, ?)';

export const CREATE_GAMES_IN_ORDER = 'INSERT INTO order_games (order_id, game_id, quantity) VALUES (?, ?, ?)';
export const FIND_GAME_IN_ORDER_BY_ID = 'SELECT * FROM order_games WHERE order_id = ? AND game_id = ?';
export const FIND_GAMES_IN_ORDER = 'SELECT game_id FROM order_games WHERE order_id = ?';
export const UPDATE_GAME_IN_ORDER = 'UPDATE order_games SET quantity = ? WHERE order_id = ? AND game_id = ?';
export const DELETE_GAMES_IN_ORDER = 'DELETE FROM order_games WHERE order_id = ?';
export const DELETE_GAME_IN_ORDER_BY_ID = 'DELETE FROM order_games WHERE order_id = ? AND game_id = ?';

export const CREATE_WITH_ID = 'INSERT INTO orders (id, customer, completed) VALUES (?, ?, ?)';

export const UPDATE_BY_ID = 'UPDATE orders SET customer = ? WHERE id = ?';

export const DELETE_BY_ID = 'DELETE FROM orders WHERE id = ?';

export const PAY_BY_ID = 'UPDATE orders SET completed = true WHERE id = ?';
