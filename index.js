/**
 * What actions can a user make
 *  1. game move
 *  2. new round
 *  3. reset game
 *  4. toggle menu
 */

/**
 * STATE MANAGMENT
 *  - Client State: State of interface independent on state of data (i.e a menu being open)
 *  - Server State: Changes in of state of an operation | database (i.e a game moves, history of games)
 */

const App = {
    /**
     * Selecting our elements HTMl elements and defining to the $ as our namespace
     *  - Namespaces allow for isolation from other javascript running on a webpage. This secures from collisions.
     */
    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="squares"]'),
        modal: document.querySelector('[data-id="modal"]'),
        modalText: document.querySelector('[data-id="modal-text"]'),
        modalBtn: document.querySelector('[data-id="modal-btn"]'),
        turn: document.querySelector('[data-id="turn"]')
    },

    state: {
        currentPlayer: 1,
        moves: [], // array with nested array tracking squareId and player 
    },

    getGameStatus(moves){
        //filter to grab moves
        const p1Moves = moves.filter(move => move.playerid === 1).map(move => +move.squareid); //filter only moves that have player/playerid of 1. must map squareid to each move
        const p2Moves = moves.filter(move => move.playerid === 2).map(move => +move.squareid);

         //Winning patters
         const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
          ];

         let winner = null

          //for each winning patterns
          winningPatterns.forEach((pattern) => {
            const p1Wins = pattern.every(v => p1Moves.includes(v)) //for every v (value) in pattern that matches to p1 moves.
            const p2Wins = pattern.every(v => p2Moves.includes(v))

            //if p1 or 2 wins set value of winner
            if (p1Wins) winner = 1
            if (p2Wins) winner = 2
          });
         

         //set staus : if moves lentgh = 9 set complete else inprogress
         //winner will be set above
        return{
            status: moves.length === 9 || winner != null ? "complete" : "in Progress",
            winner
        }
    },

    init(){  //Adding an init method allows for us to define when initialization happens

        //Defining click listener for the action menu
        App.$.menu.addEventListener("click", (event) => {
            App.$.menuItems.classList.toggle("hidden"); //Toggling the hidden class
        }); 

        App.$.newRoundBtn.addEventListener("click", (event) => {
            console.log("new round");
        });

        App.$.resetBtn.addEventListener("click", (event) => {
            console.log("reset");
        });

        App.$.modalBtn.addEventListener("click", (event) => {
            App.state.moves = [];
            App.$.squares.forEach(square => square.replaceChildren());
            App.$.modal.classList.add("hidden");
        });

        App.$.squares.forEach((square) => { //Query all on elements returns a node list. You must add event listeners to each square in the list to make them actionable
            square.addEventListener("click", (event) =>{
                console.log(App.state.currentPlayer)

                //checking for current player
                if(App.state.moves.length == 0){
                    currentPlayer = 1;
                }else{
                    currentPlayer = currentPlayer == 1 ? 2 : 1;
                }

                //func to check if sqaure id is in state
                const hasMove = (squareId) => {
                    const existingMove = App.state.moves.find(move => move.squareid == squareId) // checks move array in state for square id
                    return existingMove !== undefined // returns undefined if it doesnt exist
                }

                //Check if square id exist in state. below checks if squareid is undefined, not in moves array
                if(hasMove(+square.id)){ 
                    return;
                }

                //create an icon for X/O depending on gameplay turn
                const icon = document.createElement("i");
                const turnIcon = document.createElement("i");

                //turn label
                let oppPlayer = 1
                if (currentPlayer === 1){
                    oppPlayer = 2;
                }else{
                    oppPlayer = 1;
                }
                const turnLabel = document.createElement('p');
                turnLabel.innerText = 'player ' + oppPlayer + ', you are up';
    
                //Set game move depending on player 
                if(currentPlayer === 1){
                    icon.classList.add("fa-solid", "fa-x", "yellow");
                    turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
                    turnLabel.classList = "turquoise"
                }else{
                    icon.classList.add("fa-solid", "fa-o", "turquoise");
                    turnIcon.classList.add("fa-solid", "fa-x", "yellow");
                    turnLabel.classList = "yellow"
                }
                

                //push square id and player id to state
                App.state.moves.push({
                    squareid: square.id,
                    playerid: currentPlayer,
                });

                //will replace nodes/children in order
                App.$.turn.replaceChildren(turnIcon, turnLabel);

                //add children element to square
                square.replaceChildren(icon);

                //Check if theres a winner or tie
                const gameStatus = App.getGameStatus(App.state.moves);

                if(gameStatus.status === "complete"){
                    App.$.modal.classList.remove("hidden");

                   gameStatus.winner != null ? App.$.modalText.textContent = "Player " + gameStatus.winner + " Wins!" : App.$.modalText.textContent = "Tie";
                }

                
            });
        });


    },

};

//window.addEventListener("load", App.init); //This will initalize the App Object


/**
 * MVC 
 *  APP | View | Store
 * 
 * App/index
 *  - App init
 * 
 * View
 *  - Query Selectors
 *  - register the event listeners
 * 
 * Store
 *  - store/state logic
 */

import View from "./view.js"
import Store from "./store.js"

const players = [
    {
        id: 1,
        name: "Player 1",
        iconClass: "fa-x",
        colorClass: "turquoise",
    },
    {
        id: 2,
        name: "Player 2",
        iconClass: "fa-o",
        colorClass: "yellow",
    },
];


 function init(){
    const view = new View();
    const store = new Store(players);

    //Controller Logic (keep as simple as possible)
    view.bindGameResetEvent(event => {
        console.log("reset");
        console.log(event);
    });

    view.bindNewRoundEvent(event => {
        console.log("new round");
        console.log(event);
    });

    view.bindPlayerMove((square) => {

        const existingMove =  store.game.moves.find((move) => move.squareid === +square.id);

        if(existingMove){
            return;
        }

        //place icon in sqaure
        view.handlePlayerMove(square, store.game.currentPlayer);
        
        //store play
        store.playerMove(+square.id); //State change! | + typecasts to number

        //update indicator
        view.setTurnIndicator(store.game.currentPlayer);

    console.log(view.$.turn)});

 }
 

 window.addEventListener("load", init);