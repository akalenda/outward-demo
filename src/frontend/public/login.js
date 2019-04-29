const LOGIN_URI = '/api/login';
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login');
const statusField = document.getElementById('status');

try{
    loginButton.onclick = function submitButtonClicked(ignored) {
        processLoginCredentials();
    };
    usernameInput.addEventListener('keyup', function(event){
        if (event.key === 'Enter') {
            processLoginCredentials();
        }
    });
    passwordInput.addEventListener('keyup', function(event){
        if (event.key === "Enter"){
            processLoginCredentials();
        } else {
            // TODO: We can provide a small amount of protection against DOM inspection
            // by retrieving characters as they're typed, and replacing them with random characters
        }
    });
} catch(error) {
    displayErrorsIn(statusField)(error);
}

function processLoginCredentials() {
    let username = usernameInput.value;
    let password = passwordInput.value;
    // We explicitly do not check if a password is valid, because allowing it may waste a malefactor's time
    logInto(username, password).catch(displayErrorsIn(statusField));
}

function logInto(username, password) {
    return new RequestTo(LOGIN_URI)
        .sendingJson({
            username: username,
            password: password
        }).POST()
        .redirect();
}

/**
 * @param {HTMLElement} htmlElement
 * @returns {(function(String): PromiseLike)}
 */
function displayErrorsIn(htmlElement) {
    return error => {
        htmlElement.innerText = error;
        htmlElement.style.color = 'darkred';
    };
}