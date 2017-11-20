const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
	console.log('Conectado a la base de datos ' + config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
	console.log('Error al conectar a MongoDB ' + err);
});

const app = express();

const users = require('./routes/users');

// Numero de puerto
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
	res.send('Entrada invalida');
});

// Routas que no existen
app.get('*', (req, res) => {
	res.send('Esta pagina no existe');
});

// Iniciar servidor
app.listen(port, () => {
	console.log('Corriendo en el puerto ' + port);
});