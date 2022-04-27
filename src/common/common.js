const _BASE_URL = 'https://dwec-tres-en-raya.herokuapp.com';
const token = sessionStorage.getItem("authorization");

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


export { _BASE_URL, doFetch }