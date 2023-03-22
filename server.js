const express = require('express');
const server = express();
const port = process.env.PORT || 5050;

// configure the back end to accept incoming json data
// either as a JSON payload or as form data (encoded url strings)
// 5000 is for backend  or try 5050

server.use(express.json());
server.use(express.urlencoded({extended: true})); // url?key=value&&key=value // php style
// this route manages user data
server.use('/ums', require('./routes/api'));

server.listen(port, () => {
    console.log(`server is running on ${port}`);
})