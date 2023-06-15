# Tienda de videojuegos

## Comenzando

### Pre-requisitos

1. Clone el repositorio e ingresar a la carpeta del proyecto

```
git clone https://github.com/jsalazars-devco/tarea-desarrollo.git
cd tarea-desarrollo/
```

2. Cree el archivo .env y agregue las variables. Mire el archivo [.env.example](https://github.com/jsalazars-devco/tarea-desarrollo/blob/main/.env.example) para más detalles:

```
# Server Configuration
PORT=your_port

## CORS whitelist URLs
URL_WHITELIST=your_url_1,your_url_2 #NOTE: The URLS must be separated by commas, without spaces.

## Token secret for JWT
JWT_SECRET_KEY=your_token_secret_key
JWT_EXPIRATION_TIME=your_toke_expiration_time

# MySQL Connection Parameters
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database

# Adminer Parameters
ADMINER_PORT=your_adminer_port
```

- PORT=El puerto en el que se quiere lanzar el servicio

- URL_WHITELIST=Lista de URLs que pueden realizar peticiones POST, PUT, DELETE al servicio

- JWT_SECRET_KEY=Llave secreta para la creación de los JWTs
- JWT_EXPIRATION_TIME=Tiempo en el que se desea que expiren los JWTs

- DB_HOST=El host en el cual se encuentra la base de datos
- DB_USER=Usuario de la base de datos
- DB_PASSWORD=Contraseña de la base de datos
- DB_DATABASE=Base de datos a la cual te se quiere conectar

- ADMINER_PORT=Puerto con el cual conectarse a Adminer

3. Crear una base de datos MySQL con el nombre puesto en la variable de entorno `DB_DATABASE` con las siguientes tablas:

```sql
CREATE TABLE games (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL UNIQUE,
	stock INT NOT NULL,
	price INT NOT NULL,
	imageUrl VARCHAR(255)
)

CREATE TABLE users (
	id INT PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
	admin BOOLEAN NOT NULL
)

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
```

Y en la tabla `users` cree un usuario Administrador con una contraseña de su elección y admin=1. Para esto, puede utilizar [bcrypt.online](https://bcrypt.online) y obtener una contraseña hash.

## Instalación

Instalar dependencias

```
npm install
```

Ejecutar en modo desarrollo

```
npm run dev
```

Por defecto el servicio se ejecutará en el puerto 3000 en la url http://localhost:3000/
Ya se podrá realizar los cambios que se consideren pertinentes.

## Despliegue

Compilar el programa

```
npm run build
```

Este comando generará una carpeta /dist con todos los archivos necesarios para su despliegue. Una vez compilado se corre con el siguiente comando

```
npm start
```

# Contenedores

Si desea realizar el despliegue en contenedores, después de realizar el comando `npm run build` corra los siguientes comandos:

```
docker-compose build
docker-compose up -d
```

Al utilizar estos comandos, se crearán automáticamente las tablas necesarias para su funcionamiento y un usuario **admin** con contraseña **admin** que será el administrador por defecto. Se recomienda cambiar la contraseña.

El despliegue viene con Adminer, una aplicación con la cuál podrá ver la base de datos que está utilizando el servidor.
