export const FIND = `SELECT
games.id,
games.name,
games.stock,
games.price,
GROUP_CONCAT(DISTINCT consoles.id) AS consolesIds,
GROUP_CONCAT(DISTINCT categories.id) AS categoriesIds,
games.imageUrl
FROM games
LEFT JOIN game_consoles ON games.id = game_consoles.game_id
LEFT JOIN consoles ON game_consoles.console_id = consoles.id
LEFT JOIN game_categories ON games.id = game_categories.game_id
LEFT JOIN categories ON game_categories.category_id = categories.id
GROUP BY games.id
`;

export const FIND_BY_ID = `SELECT
games.id,
games.name,
games.stock,
games.price,
GROUP_CONCAT(DISTINCT consoles.id) AS consolesIds,
GROUP_CONCAT(DISTINCT categories.id) AS categoriesIds,
games.imageUrl
FROM games
LEFT JOIN game_consoles ON games.id = game_consoles.game_id
LEFT JOIN consoles ON game_consoles.console_id = consoles.id
LEFT JOIN game_categories ON games.id = game_categories.game_id
LEFT JOIN categories ON game_categories.category_id = categories.id
WHERE games.id = ?
GROUP BY games.id
`;