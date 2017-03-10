import jQuery from 'jquery';

const $ = jQuery;

function buildUrl(path) {
    if(path[0] === '/') {
        path = path.substr(1);
    }
    // WARNING: SWITCH TO HTTPS WHEN USING IN PRODUCTION
    return `http://localhost:3000/${path}`;
}

let jwt = null;
let challenge = null;
let interval = null;

function ajax(url, data) {
    return $.ajax(url, {
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify(data)
    });
}

function apiTest() {
    const text = "Testing API access";
    const element = $('#api-test');
    element.text(text);

    const data = {
        jwt: jwt
    };
    ajax(buildUrl('/apiTest'), data).done(response => {
        if(response.message) {
            element.text(`${text}: ${response.message}`);
        } else {
            element.text(`${text}: uhh, something went wrong`);
        }
    });
}

function pollForLogin() {
    const data = {
        jwt: jwt
    };
    ajax(buildUrl('/finishLogin'), data).done(response => {
        if(response.jwt && response.address) {
            jwt = response.jwt;

            clearInterval(interval);
            interval = null;
            challenge = null;

            $('#login-in-progress').hide();
            $('#logged-in').show();

            $('#logged-in-address').text(`Logged in as ${response.address}`);

            apiTest();
        }
    });
}

$('#login-form').submit(event => {
    event.preventDefault();

    const data = {
        address: $(event.target).children(':text').val()
    };

    ajax(buildUrl('/login'), data).done(response => {
        jwt = response.jwt;
        challenge = response.challenge;

        $(event.target).hide();
        $('#login-in-progress').show();
        $('#login-in-progress p').text(challenge);

        interval = setInterval(pollForLogin, 1000);
    });
});

