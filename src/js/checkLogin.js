/**
 * Created by newhuan on 2017/5/20.
 */
$('window').ready(function () {
    isLogin(function(msg_id){
        if(msg_id === 1){
            showUserName();
        }
    });

    let $signOut = $('#sign-out');
    $signOut.on('click', function () {
        setSignOut();
    });


});
function setSignOut() {
    let $userName = $('#user-name-header');
    let $signOut = $('#sign-out');
//sign in up out button
    let $signIn = $('#sign-in');
    let $signUp = $('#sign-up');
    setLocalStorageSignOut();
    $userName.html(' ');
    $userName.hide();
    $signOut.hide();
    $signIn.show();
    $signUp.show();
}

function showUserName() {
    let user = localStorage.getItem('dem2p5_user');
    let $userName = $('#user-name-header');
    let $signOut = $('#sign-out');
//sign in up out button
    let $signIn = $('#sign-in');
    let $signUp = $('#sign-up');
    $signIn.hide();
    $signUp.hide();
    $userName.html(user);
    $userName.show();
    $signOut.show();
}