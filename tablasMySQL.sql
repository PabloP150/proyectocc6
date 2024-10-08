#CREATE DATABASE proyectocc6;
#USE proyectocc6;

#DROP TABLE Orden;
#DROP TABLE Producto;
#DROP TABLE Cliente;
#DROP TABLE Tarjeta;
#DROP TABLE Courier;

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

CREATE TABLE Tarjeta(
tid CHAR(15) PRIMARY KEY,
nombre VARCHAR(30),
ip VARCHAR(20),
carpeta VARCHAR(255),
extension VARCHAR(5)
);

CREATE TABLE Courier(
coid CHAR(15) PRIMARY KEY,
nombre VARCHAR(30),
ip VARCHAR(20),
carpeta VARCHAR(255),
extension VARCHAR(5)
);

CREATE TABLE Orden(
oid INTEGER PRIMARY KEY AUTO_INCREMENT,
pid INTEGER,
cid INTEGER,
tid CHAR(15),
coid CHAR(15), 
estado VARCHAR(15),
precioTotal DECIMAL(10,2),
cantidad INTEGER,
FOREIGN KEY (pid) REFERENCES Producto(pid),
FOREIGN KEY (cid) REFERENCES Cliente(cid),
FOREIGN KEY (tid) REFERENCES Tarjeta(tid),
FOREIGN KEY (coid) REFERENCES Courier(coid)
);
