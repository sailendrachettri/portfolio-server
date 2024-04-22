const express = require('express');
const app = express();
const db = require('./db');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const PORT = 5000 || 8000

app.use('/api/project', require('./routes/project'));
app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, ()=>{
    console.log(`App listing at port ${PORT}`);
})