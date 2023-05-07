//Redux state managment docs best practices
    //--Do not mutate state--
    // State can only be written to from this class

const initalValue = {
    moves: []
}

export default class Store{
    #state = initalValue;

    constructor(players){
        this.players = players
    }

    //getter
    get game(){
        const state = this.#getState();
        const currentPlayer = this.players[state.moves.length % 2];

        return{
            moves: state.moves,
            currentPlayer,
        }
    }

    playerMove(squareId){

        //not directly changinging/mutateing state
        const state = this.#getState()
        const stateClone = structuredClone(state); //structuredClone also you clone an object

        stateClone.moves.push({
            squareId,
            player: this.game.currentPlayer
        });

        this.#saveState(stateClone);//Using define save state function
    }

    #getState(){
        return this.#state
    }

    #saveState(stateOrFunc){ // you can pass a raw state or callback function that has previous val of state
        const prevState = this.#getState;

        let newState

        //switch on type of value being passed
        switch(typeof stateOrFunc){
            case 'function':
                newState = stateOrFunc(prevState);
                break;
            case 'object':
                newState = stateOrFunc;
                break;
            default:
                throw new Error("Invalid arg passed to saveState");
        }

        this.#state = newState
    }
}