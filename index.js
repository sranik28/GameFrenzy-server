const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('assignment is running...... life is fata fata');
})

app.listen(port)