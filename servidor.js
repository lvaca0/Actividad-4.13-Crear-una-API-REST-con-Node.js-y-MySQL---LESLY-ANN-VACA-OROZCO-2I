const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Conectar a la base de datos (se crea automáticamente)
const db = new sqlite3.Database('usuarios.db');

// Crear la tabla necesaria
db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, usuario TEXT, contrasena TEXT)");

// Ruta para agregar usuarios
app.get('/agregar', (req, res) => {
    const { nombre, usuario, contrasena } = req.query;
    db.run("INSERT INTO usuarios (nombre, usuario, contrasena) VALUES (?, ?, ?)", [nombre, usuario, contrasena], (err) => {
        if (err) res.status(500).send('Error al agregar');
        else res.send('Usuario agregado exitosamente');
    });
});

// Ruta para listar usuarios
app.get('/listar', (req, res) => {
    db.all("SELECT nombre, usuario, contrasena FROM usuarios", (err, rows) => {
        if (err) res.status(500).send('Error');
        else res.json(rows);
    });
});

// Ruta para autenticar
app.get('/autenticar', (req, res) => {
    const { usuario, contrasena } = req.query;
    db.get("SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?", [usuario, contrasena], (err, row) => {
        if (row) res.send('Autenticación exitosa');
        else res.send('Usuario no encontrado');
    });
});

app.listen(port, () => {
    console.log(`Servidor API escuchando en http://localhost:${port}`);
});