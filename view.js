export default class View{
    $ = {};
    $$ = {};

    constructor(){
        //Query Selectors go here
        this.$.menu = this.#qs('[data-id="menu"]')
        this.$.menuBtn = this.#qs('[data-id="menu-btn"]')
        this.$.menuItems = this.#qs('[data-id="menu-items"]')
        this.$.resetBtn = this.#qs('[data-id="reset-btn"]')
        this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]')
        this.$.modal = this.#qs('[data-id="modal"]')
        this.$.modalText = this.#qs('[data-id="modal-text"]')
        this.$.modalBtn = this.#qs('[data-id="modal-btn"]')
        this.$.turn = this.#qs('[data-id="turn"]')

        this.$$.squares = this.#qsAll('[data-id="squares"]')

        //UI only event listeners
        this.$.menu.addEventListener("click", event => {
            this.#toggleMenu()
        });
        
    }
    
    /**
     * Register Event listeners 
     */

    //binding for event listeners
    bindGameResetEvent(handler){
        this.$.resetBtn.addEventListener("click", handler);
    }

    bindNewRoundEvent(handler){
        this.$.newRoundBtn.addEventListener("click", handler);
    }

    bindPlayerMove(handler){
        this.$$.squares.forEach(square => {
            square.addEventListener("click", () => handler(square));
        });
    }


    /**
     * DOM Utiliy methods
     *  #: defines method as private
     */

    #toggleMenu(){
        this.$.menuItems.classList.toggle("hidden");
        this.$.menuItems.classList.toggle("border");
        
        const icon = this.$.menuBtn.querySelector('i');

        icon.classList.toggle("fa-chevron-up");
        icon.classList.toggle("fa-chevron-down");
    }

        //QuerySelector heleper methods to help verify elements exist
        #qs(selector, parent){
            const el = parent ? parent.querySelector(selector) : document.querySelector(selector)

            if(!el) throw new Error("could not find elemment");

            return el;
        }
        
        #qsAll(selector){
            const elList = document.querySelectorAll(selector);

            if(!elList) throw new Error("could not find elemments");

            return elList;
        }

        //Set player turn | player = 1 or 2
        setTurnIndicator(player){
            const icon = document.createElement("i");
            const label = document.createElement('p');

            icon.classList.add("fa-solid", player.colorClass, player.iconClass);
            label.classList.add(player.colorClass);
        
            label.innerText = player.name + ", you're up";

            this.$.turn.replaceChildren(icon, label);
        }

        handlePlayerMove(squareEl, player){
            const icon = document.createElement('i');

            icon.classList.add("fa-solid", player.colorClass, player.iconClass);
            
            squareEl.replaceChildren(icon);
        }


}