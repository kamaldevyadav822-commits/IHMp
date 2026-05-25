const logoutBtn =
document.getElementById('logoutBtn');

window.openRoom = function(user){

window.location.href =
`room.html?user=${user}`;

}

logoutBtn.addEventListener('click',()=>{

localStorage.clear();

window.location.href = 'index.html';

});
