let hard = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L'],
    med = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'],
    low = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'],
    memory_array = [],
    cards_flipped = 0,
    card_shirt,
    card_face;

window.onload = newBoard;

//array shuffle function
Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};

//create new game board with cards
function newBoard() {
    let output = '',
        firstFlippedCard,
        secondFlippedCard,
        count = 0;

    //flag which shows how many cards are flipped
    cards_flipped = 0;

    //choose cards quantity
    switch (localStorage.getItem('difficult')) {
        case 'low':
            memory_array = low.shuffle();
            break;
        case 'med':
            memory_array = med.shuffle();
            break;
        case 'hard':
            memory_array = hard.shuffle();
            break;
        case null:
            memory_array = med.shuffle();
            break;
    }

    //choose cards shirts
    switch (localStorage.getItem('card_shirt')) {
        case 'first':
            break;
        case 'second':
            card_shirt = 'style="background-position: 548px"';
            card_face = 'style="background-position: 548px"';
            break;
        case 'third':
            card_shirt = 'style="background-position: -549px"';
            card_face = 'style="background-position: -549px"';
            break;
        case null:
            card_shirt = '';
            break;
    }
    //create every card
    (function (array) {
        for (let i = 0, length = array.length; i < length; i++) {
            output += `<div id="card_${i} ${array[i]}" class="cards" ${card_shirt}><div class="card-face" ${card_face}>${array[i]}</div></div>`;
        };
    })(memory_array);

    //fill the game board with cards
    document.getElementById('card-container').innerHTML = output;

    //add events on click
    document.getElementById('card-container').addEventListener("click", timer);
    document.getElementById('card-container').addEventListener("click", flipCard);

    function timer() {
        let target = event.target,
            milliseconds = 0,
            seconds = 0,
            minutes = 0;
        if (target.className != 'cards') {
            return;
        }
        document.getElementById('card-container').removeEventListener("click", timer);
        let timerStart = setInterval(counter, 100);
        timer.stop = () => {
            clearInterval(timerStart);
            return [minutes, seconds, milliseconds];
        };

        function counter() {
            document.getElementById('milliseconds').innerHTML = milliseconds;
            if (seconds < 10) {
                document.getElementById('seconds').innerHTML = '0' + seconds;
            } else {
                document.getElementById('seconds').innerHTML = seconds;
            }
            if (minutes < 10) {
                document.getElementById('minutes').innerHTML = '0' + minutes;
            } else {
                document.getElementById('minutes').innerHTML = minutes;
            }
            milliseconds++;
            if (milliseconds > 9) {
                seconds++;
                milliseconds = 0;
            }
            if (seconds > 59) {
                minutes++;
                seconds = 0;
            }
            if (minutes < 10) {
                document.getElementById('minutes').innerHTML = '0' + minutes;
            }
        }
    }

    function flipCard() {

        switch (cards_flipped) {
            case 0:
                //prevent false triggering on an already open card
                if (event.target.id == "card-container") {
                    break;
                } else {
                    //rotate back previous cards
                    if (firstFlippedCard !== undefined) {
                        firstFlippedCard.classList.remove("rotate");
                        secondFlippedCard.classList.remove("rotate");
                    }
                }
                //rotate clicked card
                firstFlippedCard = document.getElementById(event.target.id);
                firstFlippedCard.classList.add("rotate");
                cards_flipped++;
                break;

            case 1:
                if (event.target.id == "card-container") {
                    break;
                }

                secondFlippedCard = document.getElementById(event.target.id);
                secondFlippedCard.classList.add("rotate");
                //if the same cards are selected
                if (firstFlippedCard.id.split(' ')[1] == secondFlippedCard.id.split(' ')[1]) {
                    (() => {
                        const firstCard = firstFlippedCard,
                            secondCard = secondFlippedCard;
                        setTimeout(() => {
                            //rotate back
                            firstCard.classList.remove("rotate");
                            secondCard.classList.remove("rotate");
                            setTimeout(() => {
                                //hidden it
                                firstCard.classList.add("hidden");
                                secondCard.classList.add("hidden");
                            }, 500);
                        }, 1000);
                    })();
                    count++;
                }
                //if player end the game
                if (count == (memory_array.length / 2)) {
                    endGame();
                }
                cards_flipped = 0;
                break;
        }
    }

    function endGame() {
        let currentTime = timer.stop(),
            fullName = [localStorage.getItem('name'), localStorage.getItem('surname'), localStorage.getItem('email')],
            currentScore = [],
            score = []

        fullName.forEach((item, i, array) => {
            //if player don't fill his name, etc.
            if (i == 0 && item === null) {
                array[i] = 'Unnamed';
            }
            if (i == 1 && item === null) {
                array[i] = 'Hero';
            }
            if (i == 2 && item === null) {
                array[i] = '';
            }
        });
        // if this isn't a first game and we have some results in localstorage
        if (localStorage.getItem('score') != null) {
            score = JSON.parse(localStorage.getItem('score'));
            currentScore.push(fullName);
            currentScore.push(currentTime);
            score.push(currentScore);
            //sort results by the time
            score.sort(sortArray);
            //save only first 10 results
            if (score.length > 10) {
                score.length = 10;
            }
        } else {
            //if this is the first game and we don't have results in localstorage
            currentScore.push(fullName);
            currentScore.push(currentTime);
            score.push(currentScore);
        }
        localStorage.setItem('score', JSON.stringify(score));
        //load scoreboard page
        setTimeout(() => {
            document.location.href = "scoreboard.html"
        }, 2000);

        //multidimensional array sorting function
        function sortArray(a, b) {
            if (a[1][0] < b[1][0]) {
                return -1;
            }

            if (a[1][0] > b[1][0]) {
                return 1;
            }

            if (a[1][1] < b[1][1]) {
                return -1;
            }

            if (a[1][1] > b[1][1]) {
                return 1;
            }

            if (a[1][2] < b[1][2]) {
                return -1;
            }

            if (a[1][2] > b[1][2]) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}
