const express = require('express');
const app = express();
const db = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const CLIENT_URL = 'http://localhost:3000'

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: CLIENT_URL}));
app.use('/uploads', express.static(__dirname + '/uploads'))

const PORT = 5000 || 8000

app.use('/api/project', require('./routes/project'));
app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, ()=>{
    console.log(`App listing at port ${PORT}`);
})