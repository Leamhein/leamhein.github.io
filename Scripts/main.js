window.onload = function () {
    // if player add some text - save it to localStorage
    document.getElementById('name').onchange = () => {
        localStorage.setItem('name', document.getElementById('name').value);
    };
    document.getElementById('surname').onchange = () => {
        localStorage.setItem('surname', document.getElementById('surname').value);
    };
    document.getElementById('email').onchange = () => {
        localStorage.setItem('email', document.getElementById('email').value);
    };
};
