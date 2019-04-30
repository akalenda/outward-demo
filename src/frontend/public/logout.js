const LOGOUT_URI = '/api/logout';

function logout(){
    return new RequestTo(LOGOUT_URI)
        .POST()
        .redirect();
}