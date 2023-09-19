const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const recipes = require('./models/recipes');
const recipesRoutes = require('./routes/recipeApis');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client'))); // Serve static files from the 'client' directory
app.use(bodyParser.json());

app.use('/api/recipes', recipesRoutes);


// Serves the HTML file with the list of recipes
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '..', '/client', 'index.html');
    res.sendFile(filePath);
});


const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to db")
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
})
.catch((error) => console.log(`${error} did not connect`));