const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const express = require('express');
// const gm = require('gm').subClass({ imageMagick: true });

const imageService = require('./services/image-service');
const readFile = promisify(fs.readFile);
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.locals.basedir = path.join(__dirname, '.');

app.use(express.static('static'));

app.get('/', function(req, res) {
    imageService
        .getAll()
        .then(files => res.render('index', { files }))
        .catch(console.error.bind(console))
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
