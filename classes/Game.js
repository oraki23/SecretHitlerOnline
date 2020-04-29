module.exports = class Game{
    constructor(numberOfPlayers){
        this.cards = [];

        this.numberOfPlayers = numberOfPlayers;

        this.numbreOfHitler = 1;

        if(numberOfPlayers == 5){
            this.numbrerOfFacists = 1;
            this.numberOfLiberals = 3;
        } else if(numberOfPlayers == 6){
            this.numbrerOfFacists = 1;
            this.numberOfLiberals = 4;
        } else if(numberOfPlayers == 7){
            this.numbrerOfFacists = 2;
            this.numberOfLiberals = 4;
        } else if(numberOfPlayers == 8){
            this.numbrerOfFacists = 2;
            this.numberOfLiberals = 5;
        } else if(numberOfPlayers == 9){
            this.numbrerOfFacists = 3;
            this.numberOfLiberals = 5;
        } else if(numberOfPlayers == 10){
            this.numbrerOfFacists = 3;
            this.numberOfLiberals = 6;
        }

        this.generateHitlerCard();
        this.generateFacistCards();
        this.generateLiberalCards();

        this.cards = this.shuffle(this.cards);

        this.president = '';
        this.chancelor = '';

        this.policiesNotDrawn = [
            'Facist',
            'Facist',
            'Facist',
            'Facist',
            'Facist',
            'Facist',
            'Facist',
            'Facist',
            'Facist',
            'Facist',
            'Facist',
            'Liberal',
            'Liberal',
            'Liberal',
            'Liberal',
            'Liberal',
            'Liberal'
        ];
        this.policiesDrawn = [];
        this.policiesPlayed = [];

        this.policiesInHand = [];

        this.shuffleDeck();
    }

    printCardStatus(){
        console.log('Number of card in deck: ' + this.policiesNotDrawn.length);
        console.log('Number of card in discard: ' + this.policiesDrawn.length);
        console.log('Number of card in game: ' + this.policiesPlayed.length);
        console.log('Number of card that players hold: ' + this.policiesInHand.length);

        console.log('Total number of cards (should be 17): ' + (this.policiesNotDrawn.length + this.policiesDrawn.length + this.policiesPlayed.length + this.policiesInHand.length));
    }

    /**
     * Reput all the policies drawn into the deck and shuffle everything
     */
    shuffleDeck(){
        for(var i = 0; i < this.policiesDrawn.length; i++){
            this.policiesNotDrawn.push(this.policiesDrawn[i]);
        }
        this.policiesDrawn = [];

        this.policiesNotDrawn = this.shuffle(this.policiesNotDrawn);

        console.log('The deck has been shuffled.');
        this.printCardStatus();
    }

    playPolicy(policy){
        this.policiesPlayed.push(policy);

        var index = this.policiesInHand.indexOf(policy);
        this.policiesInHand.splice(index, 1);
    }

    /**
     * Choose a random policy from deck to play it, removes it from the deck, add it to the played area, and then returns it.
     */
    playRandomPolicy(){
        var randomPolicy = this.policiesNotDrawn.pop();

        this.policiesPlayed.push(randomPolicy);

        return randomPolicy;
    }

    putPolicyBack(policy){
        this.policiesDrawn.push(policy);

        var index = this.policiesInHand.indexOf(policy);
        this.policiesInHand.splice(index, 1);
    }

    drawThreePolicy(){
        this.policiesInHand = [this.policiesNotDrawn.pop(), this.policiesNotDrawn.pop(), this.policiesNotDrawn.pop()];
        return this.policiesInHand;
    }

    getThreeTopPolicyValues(){
        var l = this.policiesNotDrawn.length;
        var topThree = [this.policiesNotDrawn[l-1], this.policiesNotDrawn[l-2], this.policiesNotDrawn[l-3]];

        return topThree;
    }

    isPresidentChoosen(){
        console.log('President: ' + this.president);
        if(this.president != ''){
            return true;
        }
        return false
    }
    isChancelorChoosen(){
        console.log('Chancelor: ' + this.chancelor);
        if(this.chancelor != ''){
            return true;
        }
        return false
    }

    //Return the democrative session we are currently in.
    whichStepAreWeIn(){
        if(this.isChancelorChoosen() && this.isPresidentChoosen()){
            if(this.policiesInHand.length == 3){
                return 1; //Democrative session 1
            } else if (this.policiesInHand.length == 2){
                return 2; //Democrative session 2
            }
        } else{
            return 0;
        }
    }

    resetTurn(){
        this.president = '';
        this.chancelor = '';
    }

    generateHitlerCard(){
        for(var i = 0; i < this.numbreOfHitler; i++){
            this.cards.push('Hitler');
        }
    }

    generateFacistCards(){
        for(var i = 0; i < this.numbrerOfFacists; i++){
            this.cards.push('Facist');
        }
    }
    generateLiberalCards(){
        for(var i = 0; i < this.numberOfLiberals; i++){
            this.cards.push('Liberal');
        }
    }

    getNumberOfFacistPlayed(){
        var facistPlayed = this.policiesPlayed.filter(po => po == 'Facist')
        if(facistPlayed !== undefined){
            return facistPlayed.length;
        }
        return 0;
    }

    getNumberOfLiberalPlayed(){
        var liberalPlayed = this.policiesPlayed.filter(po => po == 'Liberal');
        if(liberalPlayed !== undefined){
            return liberalPlayed.length;
        }
        return 0;
    }

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
}
