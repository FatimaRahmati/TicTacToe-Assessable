import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../common/common.css';
import './game.css';


const params = new URLSearchParams(location.search);
const idGame = params.get('game');
const next = params.get('movement');
const _BASE_URL = 'https://dwec-tres-en-raya.herokuapp.com'
const token = sessionStorage.getItem("authorization");
const urlMov1 = `${_BASE_URL}/game/${idGame}/movements/${next}`;

const nextButton = document.querySelector('#next');
const backButton = document.querySelector('#back');


document.getElementById('game-id').innerHTML = idGame;
document.getElementById('return').addEventListener('click', () => {
    window.history.back();
}, false);


async function doFetch(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
        })
        if (response.status == 401) window.location.href = `/index.html`;
        if (response.status != 200 || !response.ok) throw (response.status);
        return response.json();
    } catch (error) {
        console.log(error);
    }
}


function dibujaNext(arrayMovimientos, iterador) {
    let dibujo;
    (iterador % 2 === 0) ? dibujo = 'x' : dibujo = 'o';
    const [row, column] = arrayMovimientos[iterador];
    document.querySelector(`[data-row='${row}'][data-column='${column}']`).innerHTML = dibujo;
}


function dibujaBack(arrayMovimientos, iterador) {
    const [row, column] = arrayMovimientos[iterador];
    const fila = document.querySelector(`[data-row='${row}'][data-column='${column}']`);
    fila.innerHTML = '';
}


async function resolveGame(url) {
    document.getElementById('loader').classList.add('active');
    const response = await doFetch(url);
    let { movement, next } = response;
    const [row, column] = movement;
    const fila = document.querySelector(`[data-row='${row}'][data-column='${column}']`);
    fila.innerHTML = 'x';

    let movimientos = [];
    movimientos.push(movement);

    document.getElementById('loader').classList.remove('active');

    while (next != null) {
        const urlMov = `${_BASE_URL}/game/${idGame}/movements/${next}`;
        const response = await doFetch(urlMov);
        ({ movement, next } = response);
        movimientos.push(movement);
    }
    let i = 1;
    nextButton.disabled = false;
    nextButton.addEventListener('click', () => {
        dibujaNext(movimientos, i++);
        if (i >= movimientos.length) nextButton.disabled = true;
        backButton.disabled = false;
    })

    backButton.addEventListener('click', () => {
        i--;
        dibujaBack(movimientos, i);
        if (i < 2) backButton.disabled = true;
    })
}

resolveGame(urlMov1);




