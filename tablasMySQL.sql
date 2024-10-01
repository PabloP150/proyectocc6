CREATE DATABASE proyectocc6;
USE proyectocc6;

DROP TABLE Orden;
DROP TABLE Producto;
DROP TABLE Cliente;

CREATE TABLE Producto(
pid INTEGER PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(50),
precio DECIMAL(10,2),
existencia INTEGER,
categoria VARCHAR(25),
descripcion VARCHAR(255),
imagen VARCHAR(255)
);

CREATE TABLE Cliente(
cid INTEGER PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(30),
usuario VARCHAR(25) UNIQUE,
contraseña VARCHAR(255)
);

CREATE TABLE Orden(
oid INTEGER PRIMARY KEY AUTO_INCREMENT,
pid INTEGER,
cid INTEGER,
estado VARCHAR(15),
precioTotal DECIMAL(10,2),
cantidad INTEGER,
FOREIGN KEY (pid) REFERENCES Producto(pid),
FOREIGN KEY (cid) REFERENCES Cliente(cid)
);