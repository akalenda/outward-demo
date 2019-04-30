const logoutButton = document.getElementById('logout');
const statusField = document.getElementById('status');

try {
    logoutButton.onclick = function logoutButtonClicked(event) {
        logout();
    }
} catch(error) {
    displayErrorsIn(statusField);
}