import {
onAuthStateChanged,
signOut
}
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

import {
collection,
query,
orderBy,
onSnapshot
}
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import {
auth,
db
}
from './firebase-config.js';

const username =
document.getElementById('username');

const chatList =
document.querySelector('.chat-list');

const logoutBtn =
document.getElementById('logoutBtn');

/* AUTH */

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href =
'index.html';

return;
}

username.innerText =
'User-' + user.uid.slice(0,5);

/* LOAD ROOMS */

const q = query(
collection(db,'rooms'),
orderBy('updatedAt','desc')
);

onSnapshot(q,(snapshot)=>{

chatList.innerHTML = '';

snapshot.forEach((docSnap)=>{

const room = docSnap.data();

const div =
document.createElement('div');

div.className = 'chat-item';

div.innerHTML = `
<img src="https://i.pravatar.cc/150?u=${docSnap.id}">

<div class="chat-info">
<h4>${room.name || 'Chat Room'}</h4>
<p>${room.lastMessage || 'Start chatting...'}</p>
</div>

<div class="online-dot"></div>
`;

div.onclick = ()=>{

window.location.href =
\`room.html?id=\${docSnap.id}\`;

};

chatList.appendChild(div);

});

});

});

/* LOGOUT */

logoutBtn.addEventListener(
'click',
async ()=>{

await signOut(auth);

localStorage.clear();

window.location.href =
'index.html';

}
);
