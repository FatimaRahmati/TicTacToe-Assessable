import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './list.css';
import '../common/common.css';


const _BASE_URL = 'https://dwec-tres-en-raya.herokuapp.com'
let params = new URLSearchParams(location.search);
const idPage = params.get('player');
const token = sessionStorage.getItem("authorization");
const urlName = `${_BASE_URL}/player/${idPage}`;
const urlIdGame = `${_BASE_URL}/player/${idPage}/games`;


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
        if (response.status != 200 || !response.ok) throw new Error(response.status);

        return response.json();
    } catch (error) {
        console.log(error.message);
    }
}


async function resolveGames(url) {
    const idGame = await doFetch(url);
    let responseGames = [];
    for (let i = 0; i < idGame.length; i++) {
        responseGames[i] = doFetch(`${_BASE_URL}/game/${idGame[i]}`);
    }
    return Promise.all(responseGames);
}


async function init(urlGames, urlNames) {
    document.getElementById('loader').classList.add('active');
    const game = resolveGames(urlGames);
    const user = doFetch(urlNames);
    return await Promise.all([game, user]);
}


function createTable(partida, line, i) {

    for (let j = 0; j < partida[i].length; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        line.appendChild(cell);

        let valor = JSON.stringify(partida[i][j]);
        switch (valor) {
            case '1':
                cell.innerHTML = "x";
                break;
            case '2':
                cell.innerHTML = "o";
                break;
            case '0':
                cell.innerHTML = "";
                break;
        }
    }
}


function formatoFecha(fecha) {
    const options = new Intl.DateTimeFormat("es-ES", {
        timeStyle: 'short',
        dateStyle: 'short'
    });
    return options.format(fecha);
}

init(urlIdGame, urlName).then(function (data) {
    document.getElementById('loader').classList.add('active');
    const datos = data.flat();
    const h1 = document.getElementById('player-name');

    datos.forEach((elemento) => {
        Object.entries(elemento).forEach(([key, value]) => {
            if (key === 'name') h1.innerHTML = value;
        })
    });

    let i = 0;
    do {
        const { id, date, result: partida, first_movement: mov } = datos[i];

        const gameList = document.getElementById('game-list');
        const ol = document.createElement('ol');
        ol.classList.add("game", "m-3");
        gameList.appendChild(ol);

        const divCard = document.createElement('div');
        divCard.classList.add("card", "p-1");
        ol.appendChild(divCard);

        const gameInfo = document.createElement('h5');
        gameInfo.classList.add("game-info");
        divCard.appendChild(gameInfo);
        if (!date) {
            gameInfo.innerHTML = "No games";
            document.getElementById('loader').classList.remove('active');
            return;
        } else {
            let fecha = new Date(date);
            fecha = formatoFecha(fecha);

            gameInfo.innerHTML = `Game #${id}`;
            const dateGame = document.createElement('div');
            dateGame.classList.add("date");
            divCard.appendChild(dateGame);
            dateGame.innerHTML = (fecha);
            const generalTable = document.createElement('div');
            generalTable.classList.add("card", "mt-1", "p-2", "align-items-center");
            ol.appendChild(generalTable);

            const preview = document.createElement('div');
            preview.classList.add('preview');
            generalTable.appendChild(preview);

            for (let i = 0; i < partida.length; i++) {
                const line = document.createElement('div');
                line.classList.add('line');
                preview.appendChild(line);
                createTable(partida, line, i);
            }

            const viewGame = document.createElement('button');
            viewGame.classList.add("btn", "btn-smttt", "btn-primary", "view-button");
            viewGame.setAttribute("data-game", id);
            viewGame.textContent = "View Game";
            viewGame.addEventListener("click", () => {
                window.location.href = `/game.html?game=${id}&movement=${mov}`;
            });
            generalTable.appendChild(viewGame);
        }
        i++;
    } while (i < (datos.length - 1));
    document.getElementById('loader').classList.remove('active');
})
    .catch((error) => {
        console.log(error);
    })






