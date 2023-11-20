const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {   
    socket.on('checkwho', (user) => {
        console.log(user);
        // const response =  Driver.findOne({ email: user });
        // if (response) {
        //     socket.emit('userIs', 'driver');
        // } else {
        //     const response =  User.findOne({ email: user });
        //     // user is user
        //     if(response){
        //         socket.emit('userIs', 'user');
        //     }


        // }


        // socket.broadcast.emit('message', msg);
        // console.log(msg);
    });


    socket.on('busMove' , (user) => {
        console.log(user);
        io.emit('busMove' , user);
    })

    socket.on('locationChange' , (user)=>{
        console.log(user);
    })

    socket.on('join', (msg) => {
        console.log(msg);
    });

});

server.listen(3001, () => {

});

const parser = require('body-parser');
app.use(cookieParser());

app.use(parser.json());
dotenv.config({ path: './config.env' });

const fs = require('fs');
const Driver = require('./model/driverSchema');
const User = require('./model/userSchema');

// Endpoint to write data to a file
// app.post('/write-to-file', (req, res) => {
//     let dataToWrite = req.body;
//     dataToWrite = JSON.stringify(dataToWrite);
//   fs.appendFile('data.txt', dataToWrite, (err) => {
//     if (err) {
//       console.error('Error writing to file:', err);
//       res.status(500).send('Error writing to file');
//     } else {
//       console.log('Data written to file');
//       res.status(200).send('Data written to file successfully');
//     }
//   });
// });


require('./db/conn');

app.use(express.json());

app.use(cors({ credentials: true, origin: '*' }));


const PORT = process.env.PORT || 3000;

app.use(require('./router/auth'));

// parse JSON bodies
app.use(express.json());


app.listen(PORT);




