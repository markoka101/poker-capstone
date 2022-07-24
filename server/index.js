const express = require('express');
const path =  require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//controller fuinctions
const {call, deal, name, reset, getTable, getHand, dealTable, getBot, getUser, winlose, getStats} = require('./controller.js');

//middleware setup
app.get('/js', (req,res) => {
    res.sendFile(path.join(__dirname, '../frontend.js'));
})
app.get('/styles', (req,res) => {
    res.sendFile(path.join(__dirname, '../index.css'));
})
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../index.HTML'));
})
app.use(express.static(__dirname+'/cardImage'));

//display cards
app.get('/api/getTable', getTable);
app.get('/api/getHand', getHand);
app.get('/api/getBot', getBot);

//display user
app.get('/api/getUser', getUser);

//display stats
app.get('/api/getStats', getStats);

//create user
app.post('/api/user', name);

//call
app.put('/api/call',  call);

//edit wins and losses
app.put('/api/winlose/:result', winlose);

//dealing cards
app.post('/api/deal', deal);
app.post('/api/dealTable', dealTable);

//reset game
app.delete('/api/reset', reset);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});