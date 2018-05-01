window.onload = addScore;


function addScore() {
    // get results from localstorage
    let score = JSON.parse(localStorage.getItem('score')),
        table = document.getElementById('scoreboard');
    // add results to the table
    for (let i = 0, length = score.length; i < length; i++) {
        table.rows[i].cells[0].innerHTML = score[i][0].join(" ");
        score[i][1].splice(1, 0, ":");
        score[i][1].splice(3, 0, ".");
        table.rows[i].cells[1].innerHTML = score[i][1].join("");
    }
}
