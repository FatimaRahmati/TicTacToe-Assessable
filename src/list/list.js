import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './list.css';
import '../common/common.css';
import { _BASE_URL, doFetch } from '../common/common';


let params = new URLSearchParams(location.search);
const idPage = params.get('player');
const urlName = `${_BASE_URL}/player/${idPage}`;
const urlIdGame = `${_BASE_URL}/player/${idPage}/games`;
sessionStorage.setItem('previousPage', window.location.href);


/*ASYNCRONOUS CALLING*/
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


/*AUXILIAR FUNCTIONS TO CREATE HTML CODE FOR SHOWING GAMES*/

/*Create principal <ol> element*/
function createOl() {
    const ol = document.createElement('ol');
    ol.classList.add("game", "m-3");
    document.getElementById('game-list').appendChild(ol);
    return ol;
}

/* Create <div> container for title of each game */
function createDivCard(ol) {
    const divCard = document.createElement('div');
    divCard.classList.add("card", "p-1");
    ol.appendChild(divCard);
    return divCard;
}

function createGameInfo(divCard) {
    const gameInfo = document.createElement('h5');
    gameInfo.classList.add("game-info");
    divCard.appendChild(gameInfo);
    return gameInfo;
}

function dateFormat(dateConst) {
    const options = new Intl.DateTimeFormat("es-ES", {
        timeStyle: 'short',
        dateStyle: 'short'
    });
    return options.format(dateConst);
}

function setDate(date, divCard) {
    let dateConst = new Date(date);
    dateConst = dateFormat(dateConst);
    const dateGame = document.createElement('div');
    dateGame.classList.add("date");
    dateGame.innerHTML = dateConst;
    divCard.appendChild(dateGame);
    return dateGame;
}


/* Create board-card for each game */
function createGeneralTable(ol) {
    const generalTable = document.createElement('div');
    generalTable.classList.add("card", "mt-1", "p-2", "align-items-center");
    ol.appendChild(generalTable);
    return generalTable;
}

function createPreview(generalTable) {
    const preview = document.createElement('div');
    preview.classList.add('preview');
    generalTable.appendChild(preview);
    return preview;
}

function createLine(preview) {
    const line = document.createElement('div');
    line.classList.add('line');
    preview.appendChild(line);
    return line;
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

function viewGameButton(id, mov, generalTable) {
    const viewGame = document.createElement('button');
    viewGame.classList.add("btn", "btn-smttt", "btn-primary", "view-button");
    viewGame.setAttribute("data-game", id);
    viewGame.textContent = "View Game";
    viewGame.addEventListener("click", () => {
        window.location.href = `/game.html?game=${id}&movement=${mov}`;
    });
    generalTable.appendChild(viewGame);
    return viewGame;
}

/*When no games exists*/
function noGames() {
    const ol = createOl();
    const divCard = createDivCard(ol);
    const gameInfo = createGameInfo();
    divCard.appendChild(gameInfo);
    return gameInfo;
}

/* INIT CALLING */
init(urlIdGame, urlName)
    .then(function (data) {

        document.getElementById('loader').classList.add('active');
        let [games, user] = data;
        document.getElementById('player-name').innerHTML = user.name;

        if (games.length == 0) {
            const gameInfo = noGames();
            gameInfo.innerHTML = "No games";
            document.getElementById('loader').classList.remove('active');
            return;
        }

        let i = 0;
        while (i < (games.length)) {

            const { id, date, result: partida, first_movement: mov } = games[i];
            const ol = createOl();
            const divCard = createDivCard(ol);
            const gameInfo = createGameInfo(divCard);

            gameInfo.innerHTML = `Game #${id}`;
            setDate(date, divCard);

            const generalTable = createGeneralTable(ol);
            const preview = createPreview(generalTable);

            for (let i = 0; i < partida.length; i++) {
                const line = createLine(preview);
                createTable(partida, line, i);
            }
            viewGameButton(id, mov, generalTable);

            i++;
        }
        document.getElementById('loader').classList.remove('active');
    })
    .catch((error) => {
        console.log(error);
    })