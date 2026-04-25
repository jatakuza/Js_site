console.log("🔥 SERVER VERSION CHECK 1");
const express = require('express');
const cors = require('cors');
require('dotenv').config();
console.log("SERVER LOADED AUTH FROM:", require.resolve('./routes/auth'));

const authRouter = require('./routes/auth');
console.log(require.resolve('./routes/auth'));
const dataRouter = require('./routes/data');



const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', dataRouter);

app.get('/', (req, res) => {
    res.send("Working");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});