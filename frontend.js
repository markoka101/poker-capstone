//buttons and inputs
const dealBtn = document.getElementById('deal');
const checkBtn = document.getElementById('check');
const foldBtn = document.getElementById('fold');
const callBtn = document.getElementById('call');
const winBtn = document.getElementById('win');
const loseBtn = document.getElementById('lose');

//form and details
let form = document.querySelector('form');
let details = document.querySelector('details');

//for inner html
const displayHand = document.getElementById('hand');
const displayBot = document.getElementById('bot-hand');
const displayTable = document.getElementById('table');
const displayUser = document.getElementById('user');
const displayStats = document.getElementById('stats');

//tracker
let gameProgress = 0;

//create the user
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.querySelectorAll('input');
    const [ name,  credits ]  = user;

    const body = {
        name: name.value,
        credits: credits.value
    };

    axios.post('/api/user/', body)
    .then(() => {
        //remove form so table isnt covered
        form.remove();

        //enable deal button
        dealBtn.disabled = false;

        getUser();
    })
    .catch(err => console.log(err));
});

//show stats when user clicks stats drop down
details.addEventListener('click', () => {
    getStats();
});

//display user
const getUser = () => {
    axios.get('/api/getUser')
    .then(res => {
        displayUser.innerHTML = 
        `User: ${res.data.name} <br>
        Credits: ${res.data.credits}`;
    })
    .catch(err => console.log(err));
}

//display cards
//hand
const getHand = () => {
    displayHand.innerHTML ='';

    axios.get('/api/getHand')
    .then(res => {
        res.data.forEach(card => {
            let image = `<img src=${card.imageURL} alt='hand'/>`;
            displayHand.innerHTML += image;
        })
    })
    .catch(err => console.log(err));
}
//bot's hand
const getBot = () => {
    displayBot.innerHTML ='';

    axios.get('/api/getBot')
    .then(res => {
        res.data.forEach(card => {
            let image = `<img src=${card.imageURL} alt='bot hand'/>`
            displayBot.innerHTML += image;
        })
    })
    .catch(err => console.log(err));
}

//table
const getTable = () => {
    displayTable.innerHTML ='';

    axios.get('/api/getTable')
    .then(res => {
        res.data.forEach(card => {
            let image = `<img src=${card.imageURL} alt='table'/>`;
            displayTable.innerHTML += image;
        })
    })
    .catch(err => console.log(err));
}

//display stats
const getStats = () => {
    displayStats.innerHTML ='';

    axios.get('/api/getStats')
    .then(res => {
        displayStats.textContent = 
        `Wins: ${res.data[0]}
        Losses: ${res.data[1]}`;
    })
    .catch(err => console.log(err));
}

//deal
const deal = () => {
    axios.post('/api/deal')
    .then(() => {
        //disable deal
        dealBtn.disabled = true;

        //enable call and fold button
        callBtn.disabled = false;
        foldBtn.disabled = false;

        getHand();
        getBot();
    })
    .catch(err => console.log(err));
}

//call
const call = () => {
    axios.put('/api/call')
    .then(() => {
        //disable call button and enable check
        callBtn.disabled = true;
        checkBtn.disabled = false;

        dealTable();
        getUser();
    })
    .catch(err => console.log(err));
}

//deal to table
const dealTable= () => {
    gameProgress++;
    axios.post('/api/dealTable')
    .then(() => {
        if (gameProgress === 4) {
            alert('Hand complete: please press the win or lose button');
            winBtn.disabled = false;
            loseBtn.disabled = false;

            foldBtn.disabled = true;
            checkBtn.disabled = true;
        }
    })
    .catch(err => console.log(err));
    getTable();
    getBot();
}

//fold
const fold = () => {
    if (confirm('Are you sure you want to fold?')) {
        winlose('lose');
    }
}

//result
const winlose = result =>  {
    axios.put(`/api/winlose/${result}`)
    .then(reset)
    .catch(err => console.log(err));
}

//reset
const reset = () => {
    axios.delete('/api/reset')
    .then(console.log('reseting page'))
    .catch(err => console.log(err));
    gameProgress = 0;
    getHand();
    getUser();
    getStats();
    getTable();
    getBot();

    foldBtn.disabled = true;
    checkBtn.disabled = true;
    winBtn.disabled = true;
    loseBtn.disabled = true;

    dealBtn.disabled = false;
}

//deal hand
dealBtn.addEventListener('click', deal);

//check and deal to table
checkBtn.addEventListener('click', dealTable);

//fold
foldBtn.addEventListener('click', fold);

//call
callBtn.addEventListener('click', call);

//win and lose
winBtn.addEventListener('click', () => winlose('win'));
loseBtn.addEventListener('click', () => winlose('lose'));
