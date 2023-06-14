CREATE TABLE games (         
	id INT PRIMARY KEY AUTO_INCREMENT,         
	name VARCHAR(255) NOT NULL UNIQUE,        
	stock INT NOT NULL,         
	price INT NOT NULL,         
	imageUrl VARCHAR(255)       
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer JSON,
  completed BOOL
);
CREATE TABLE order_games (
  order_id INT,
  game_id INT,
  quantity INT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE users (         
	id INT PRIMARY KEY AUTO_INCREMENT,         
	username VARCHAR(255) NOT NULL UNIQUE,  
  password VARCHAR(255) NOT NULL,
	admin BOOLEAN NOT NULL
);

INSERT INTO users (username, password, admin) VALUES (
  'admin', 
  '$2y$10$O.PsUZgJnkfW9YIkGuXbvOvtbISjnhCIMezSmFqcNEvdsMBdX2KKK', 
  true
);