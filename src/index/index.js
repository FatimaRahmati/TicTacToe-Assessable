import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import '../common/common.css';
import { _BASE_URL } from '../common/common.js';


function manejoError(mensaje) {
    const campoError = document.getElementById('error')
    campoError.classList.add('show');
    campoError.innerHTML = mensaje;
}

async function peticion(user, pass) {
    try {
        document.getElementById('loader').classList.add('active');

        const response = await fetch(`${_BASE_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user, password: pass })
        })

        if (response.status != 200 || !response.ok) throw response.statusText;

        document.getElementById('loader').classList.remove('active');
        const result = await response.json();
        const { access_token, player_id } = result;
        sessionStorage.setItem("authorization", `Bearer ${access_token}`);

        if (!sessionStorage.getItem("previousPage")) {
            window.location.href = `/list.html?player=${player_id}`;
        } else {
            window.location.href = sessionStorage.getItem("previousPage");
        }

    }
    catch (error) {
        document.getElementById('loader').classList.remove('active');
        manejoError(error);
    }
}

function onClickSign(event) {
    event.preventDefault();
    let user = document.getElementById('username');
    let pass = document.getElementById('password');
    document.querySelector("form").classList.add('was-validated');
    if (user.checkValidity() && pass.checkValidity()) {
        user = user.value;
        pass = pass.value;
        peticion(user, pass);
    }
}

document.getElementById('submit').addEventListener("click", onClickSign);