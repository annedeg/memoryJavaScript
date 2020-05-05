/**
 *
 */
var startTijd, totaalTijd = 0, aantalTijden = 0, gameTime = 0;
// StartTijd is de tijd dat het huidige spel begonnen is. 
// Totaaltijd is de som van de tijd van alle gespeelde spelletjes, aantaltijden is het aantal spelletjes 
var firstCard, secondCard = null;
// De eerste en tweede kaart die zijn omgedraaid.
var karakter;
// Het teken dat op de achterkant van de kaart getoond wordt
var intervalID, tijdID;
// De ID's voor de timeouts voor het terugdraaien van de kaarten en het bijwerken van de tijdweergave
var started = false;
var numberOfCards;
// Aantal kaarten op het bord
var numberOfCardsLeft;
var boardSize;
var board = [];
var cardStartTime = 0;
var maxTime = 5;
var done = false;
// Aantal kaarten dat nog op het bord ligt
var topScores = [
    {name: "Barack Obama", time: 200},
    {name: "Bernie Sanders", time: 300},
    {name: "Hillary Clinton", time: 400},
    {name: "Jeb Bush", time: 500},
    {name: "Donald Trump", time: 600}
]


function initGame(size) {
    initVars(size);
    vulSpeelveld(size);
    showScores();
}

function initVars(size) {
    // Initialiseer alle benodigde variabelen en de velden op het scherm
    // moet een karakter toegewezen worden. Hiervoor kan de nextletter functie
    setStartTime();
    done = false;
    numberOfCards = size * size;
    numberOfCardsLeft = numberOfCards
    karakter = $('#character').children("option:selected").val();
    boardSize = size;
    tijdBijhouden();
}

function vulSpeelveld(size) {
    let table = document.getElementById('speelveld');
    let html = '';
    html += '<tbody>'
    let counter = 0;
    for (let i = 0; i < size; i++) {
        html += '<tr>'
        for (let j = 0; j < size; j++) {
            let letter = nextLetter(size)();
            let card = [karakter, letter, 0, counter];
            board[counter] = card;
            html += '<td id="card-' + counter + '" onclick="cardClicked(' + counter + ')"   style="background-color: #' + $("#valueinactive").val() + '" id="card">' + card[0] + '</td>';
            counter++
        }
        html += '</tr>'
    }
    html += '</tbody>'
    table.innerHTML = html;
    setColor("card");
}

function showScores() {
    // Vul het topscore lijstje op het scherm.
}

function setStartTime() {
    const date = new Date();
    startTijd = date.getTime();
}

function setTijden() {
    if (started) {
        // bereken de verlopen tijd, de gemiddlede tijd en het verschil tussen
        // de huidige speeltijd en de gemiddelde tijd en vul de elementen in de HTML.
        // Vul ook het aantal gevonden kaarten
        const date = new Date();
        gameTime = Math.floor((date.getTime() - startTijd) / 1000)
        document.getElementById("tijd").innerHTML = gameTime;
    }
}

function getSeconds() {
    // Een functie om de Systeemtijd in seconden in plaats van miliseconden
    // op te halen. Altijd handig.
}

var nextLetter = function (size) {
    var letterArray = "AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ".substring(0, size * size).split('');
    var idx = 0;
    letterArray = shuffle(letterArray);
    return function () {
        var letter = letterArray[idx++];
        return letter;
    }
}

function cardClicked(cardNumber) {
        if(!started) {
            started = true;
        }
    let card = board[cardNumber]

    if (!(card === firstCard || card === secondCard)) {
        checkDerdeKaart();
    }

    var draaiKaartOm = turnCard(card);

    if (draaiKaartOm == 2) {
        checkKaarten();
    }
    updateCard(card[3]);
    if (!secondCard) {
        updateTimeLeft(true);
        console.log("nice")
    }
}

function updateTimeLeft(first = false) {
    if (!secondCard && done !== true) {
        let date = new Date();
        if (first) {
            setTijden();
            cardStartTime = ((date.getTime() - startTijd) / 1000);
        }
        let currentTime = (date.getTime() - startTijd) / 1000;
        let widthTimeLeft = ((5 - (currentTime - cardStartTime)) * (185 / 5));
        $('#timeLeft').css('width', widthTimeLeft);
        if (widthTimeLeft < 0) {
            if(firstCard) {
                toggleCard(firstCard);
                updateCard(firstCard[3]);
                firstCard = null;
                resetTimeLeft();
                console.log(firstCard + "first")
                console.log(secondCard + "second")
            }
            return
        }
        // if(!firstCard) {
        //     // 2 the same cards found
        //     resetTimeLeft();
        //     console.log("found last")
        //     return
        // }
        setTimeout(updateTimeLeft, 100)

    } else {
        resetTimeLeft();
    }
}

function resetTimeLeft() {
    $('#timeLeft').css('width', 185);
}

function checkDerdeKaart() {
    // Controleer of het de derde kaart is die wordt aangeklikt.
    // Als dit zo is kunnen de geopende kaarten gedeactiveerd (gesloten) worden.
    if (firstCard !== null && secondCard !== null) {
        let firstCardNumber = firstCard[3];
        let secondCardNumber = secondCard[3];
        board[firstCardNumber][2] = 0;
        board[secondCardNumber][2] = 0;
        firstCard = null;
        secondCard = null;
        updateCard(firstCardNumber)
        updateCard(secondCardNumber)
        console.log("oefefff")
    }
}

function turnCard(card) {
    // Draai de kaart om. Dit kan alleen als de kaart nog niet geopend of gevonden is.
    // Geef ook aan hoeveel kaarten er nu zijn omgedraaid en return dit zodat in de
    // cardClicked functie de checkKaarten functie kan worden aangeroepen als dat nodig is.
    if (card[2] === 0) {
        if (firstCard == null) {
            firstCard = card;
            toggleCard(card);
            return 1;
        } else {
            secondCard = card;
            toggleCard(card)
            return 2;
        }
    } else {
        return false;
    }
}

function deactivateCards() {
    // Functie om de twee omgedraaide kaarten weer terug te draaien
    if (firstCard[2] === 1) {
        toggleCard(firstCard);
    }
    if (secondCard[2] === 1) {
        toggleCard(firstCard);
    }
}

function toggleCard(element) {
    // Draai de kaart om, als de letter getoond wordt, toon dan de achterkant en
    // vice versa. switch dus van active naar inactive of omgekeerd.
    if (element[2] === 0) {
        board[element[3]][2] = 1;
    } else {
        board[element[3]][2] = 0;
    }
}

function checkKaarten() {
    // Kijk of de beide kaarten gelijk zijn. Als dit zo is moet het aantal gevonden paren
    // opgehord worden, het aantal resterende kaarten kleiner worden en ervoor
    // gezorgd worden dat er niet meer op de kaarten geklikt kan worden. De kaarten
    // zijn nu found.
    // Als de kaarten niet gelijk zijn moet de timer gaan lopen van de toontijd, en
    // de timeleft geanimeerd worden zodat deze laat zien hoeveel tijd er nog is.
    if (firstCard[1] === secondCard[1] && firstCard != null) {
        console.log(firstCard)
        console.log(secondCard)
        numberOfCardsLeft -= 2;
        //selecteer somehow de gevonden kaarten en wissel ze van kleur
        //haal ook de setonclick actie weg????
        firstCard[2] = 2;
        secondCard[2] = 2;
        updateCard(firstCard[3]);
        updateCard(secondCard[3]);
        board[firstCard[3]] = firstCard;
        board[secondCard[3]] = secondCard;
        firstCard = null;
        secondCard = null;
    }

}

// De functie tijdBijhouden moet elke halve seconde uitgevoerd worden om te controleren of 
// het spel klaar is en de informatie op het scherm te verversen.
function tijdBijhouden() {
    if (numberOfCardsLeft === 0 && gameTime != null) {
        endGame();
        console.log("blah blah blah")
        return
    } else if(gameTime == null && numberOfCardsLeft === 0 && done === true) {

    } else {
        setTijden();
        // Roep hier deze functie over 500 miliseconden opnieuw aan
        setTimeout(tijdBijhouden, 500)
    }

}

function endGame() {
    // Bepaal de speeltijd, chekc topscores en doe de overige
    // administratie.
    done = true;
    updateTopScores(gameTime)
    gameTime = null
}

function updateTopScores(speelTijd) {
    // Voeg de aangeleverde speeltijd toe aal de lijst met topscores
    totaalTijd += speelTijd;
    aantalTijden++;
    document.getElementById('gemiddeld').innerHTML = "" + totaalTijd / aantalTijden;
}

// Deze functie ververst de kleuren van de kaarten van het type dat wordt meegegeven.
function setColor(stylesheetId) {
    var valueLocation = '#value' + stylesheetId.substring(3);
    var color = $(valueLocation).val();
    $(stylesheetId).css('background-color', '#' + color);
}

// knuth array shuffle
// from https://bost.ocks.org/mike/shuffle/ 
function shuffle(array) {
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

function updateCard(cardNumber) {
    //let card = document.getElementById('card-' + cardNumber);
    let card = $('#card-' + cardNumber);
    switch (board[cardNumber][2]) {
        case 0:
            //card.style.backgroundColor = '#' + document.getElementById('valueinactive').valueOf();
            card.css("background-color", '#' + $('#valueinactive').val());

            //card.innerText = board[cardNumber][0];
            card.text(board[cardNumber][0]);
            break;
        case 1:
            card.css("background-color", '#' + $('#valueactive').val());
            card.text(board[cardNumber][1]);
            break;
        case 2:
            card.css("background-color", '#' + $('#valuefound').val());
            card.text(board[cardNumber][1]);
            break;
    }
}


$(document).ready(function () {
    $("#opnieuw").click(function () {
        initGame($("#size").val());
    });
});


