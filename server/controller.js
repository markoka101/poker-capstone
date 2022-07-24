let {deck} = require('./deckData')

let user = {};

//card arrays
let hand = [];
let botHand = [];
let table = [];

//swap between card back and front
let swap = ['cardback.png', 'cardback.png'];

//trackers
let counter = 0;

//wins, losses
let statsArr = [0,0];
let pot = 0;

//shuffles the deck
//using the Fisher-Yates shuffle
const shuffle = (arr) => {
    let curr = arr.length;
    let rand, temp;

    while (curr != 0) {
        rand = Math.floor(Math.random() * curr);
        curr--;

        temp = arr[curr];
        arr[curr] = arr[rand];
        arr[rand] = temp;
    }
    return arr;
}

//set name and credits of user
const name = (req,res) => {
    user = req.body;
    console.log(user);
    res.sendStatus(200);
};

//display user
const getUser = (req, res) => {
    res.status(200).send(user);
};

//display stats
const getStats = (req,res) => {
    console.log(statsArr);
    res.status(200).send(statsArr);
};

//display cards
const getHand = (req,res) => {
    res.status(200).send(hand);
};
const getBot = (req,res) => {
    //if the game completes show bot's hand
    if (counter === 4) {
        cardSwap();
    }
    res.status(200).send(botHand);
};
const getTable = (req,res) => {
    res.status(200).send(table);
};

//hide the bot's hand by swapping card images
const cardSwap = () => {
    for (let i = 0; i < swap.length; i++) {
        let temp = botHand[i].imageURL;
        botHand[i].imageURL = swap[i];
        swap[i] = temp;
    }
    console.log(swap, botHand);
};

//deal hands
const deal = (req,res) => {
    //shuffle the deck
    shuffle(deck);
    hand.push(deck.pop(), deck.pop());
    botHand.push(deck.pop(), deck.pop());

    cardSwap();
    res.sendStatus(200);
};

//call
const call = (req,res) => {
    user.credits -= 4;
    pot = 8;
    res.sendStatus(200);
}

//deal to table
const dealTable = (req,res) => {
    if (counter === 0) {
        table.push(deck.pop(), deck.pop(), deck.pop());
    } else if (counter < 3){
        table.push(deck.pop());
    }
    counter++;
    res.sendStatus(200);
};

//incremenet wins and losses
const winlose = (req,res) => {
    const {result} = req.params;
    if (result === 'win') {
        statsArr[0] += 1;
        user.credits += pot;
    } else {
        statsArr[1] += 1;
    }
    res.sendStatus(200);
}

//reset the table
const reset = (res,req) => {
    //transfer cards back to deck array
    deck.push(hand.pop(), hand.pop());

    //make sure the card back doesnt get shuffled back into the deck
    if (swap[0] === 'cardback.png') {
        deck.push(botHand.pop(), botHand.pop());
    } else {
        cardSwap();
        deck.push(botHand.pop(), botHand.pop());
    }

    //transfer the amount of cards on the table back
    while(table.length != 0) {
        deck.push(table.pop());
    }

    counter = 0;
    console.log(botHand.length, hand.length, deck.length, table.length);
};

module.exports = {
    deal, 
    dealTable, 
    name, 
    reset, 
    getHand, 
    getTable, 
    getBot, 
    getUser, 
    winlose,
    getStats,
    call
};