import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../common/common.css';
import './game.css';
import { _BASE_URL, doFetch } from '../common/common';

const params = new URLSearchParams(location.search);
const idGame = params.get('game');
const next = params.get('movement');
const urlMov1 = `${_BASE_URL}/game/${idGame}/movements/${next}`;
let movs = [];
const nextButton = document.querySelector('#next');
const backButton = document.querySelector('#back');
sessionStorage.setItem('previousPage', window.location.href);

document.getElementById('game-id').innerHTML = idGame;
document.getElementById('return').addEventListener('click', () => {
    window.history.back();
}, false);


/*DRAWING GAME MOVEMENTS*/
function dibujaNext(arrayMovs, iterator) {
    let dibujo;
    (iterator % 2 === 0) ? dibujo = 'x' : dibujo = 'o';
    const [row, column] = arrayMovs[iterator];
    document.querySelector(`[data-row='${row}'][data-column='${column}']`).innerHTML = dibujo;
}

function dibujaBack(arrayMovs, iterator) {
    const [row, column] = arrayMovs[iterator];
    const fila = document.querySelector(`[data-row='${row}'][data-column='${column}']`);
    fila.innerHTML = '';
}

function buttonsFuncionality() {
    let i = 1;
    nextButton.addEventListener('click', () => {
        dibujaNext(movs, i++);
        if (i >= movs.length) nextButton.disabled = true;
        backButton.disabled = false;
    })

    backButton.addEventListener('click', () => {
        i--;
        dibujaBack(movs, i);
        if (i < 2) backButton.disabled = true;
        nextButton.disabled = false;
    })
}


/* ASYNCRONOUS CALLING */
async function resolveGame(url) {
    document.getElementById('loader').classList.add('active');
    const response = await doFetch(url);
    let { movement, next } = response;
    const [row, column] = movement;
    const fila = document.querySelector(`[data-row='${row}'][data-column='${column}']`);
    fila.innerHTML = 'x';

    movs.push(movement);

    document.getElementById('loader').classList.remove('active');

    while (next != null) {
        const urlMov = `${_BASE_URL}/game/${idGame}/movements/${next}`;
        const response = await doFetch(urlMov);
        ({ movement, next } = response);
        movs.push(movement);
        nextButton.disabled = false;
    }
}

buttonsFuncionality();
resolveGame(urlMov1);