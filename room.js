import {
onAuthStateChanged
}
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

import {
collection,
query,
orderBy,
onSnapshot,
addDoc,
doc,
updateDoc,
serverTimestamp,
setDoc,
getDoc
}
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import {
auth,
db
}
from './firebase-config.js';

const params =
new URLSearchParams(
window.location.search
);

const roomId =
params.get('id');

const messagesDiv =
document.getElementById('messages');

const messageInput =
document.getElementById('messageInput');

const sendBtn =
document.getElementById('sendBtn');

const roomName =
document.getElementById('roomName');

const backBtn =
document.getElementById('backBtn');

const textarea =
document.getElementById('messageInput');

let currentUser = null;

/* AUTO GROW */

textarea.addEventListener('input',()=>{

textarea.style.height = 'auto';

textarea.style.height =
textarea.scrollHeight + 'px';

});

/* BACK */

backBtn.addEventListener(
'click',
()=>{

window.history.back();

}
);

/* AUTH */

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location.href =
'index.html';

return;
}

currentUser = user;

/* ENSURE ROOM EXISTS */

const roomRef =
doc(db,'rooms',roomId);

const roomSnap =
await getDoc(roomRef);

if(!roomSnap.exists()){

await setDoc(roomRef,{
name:'Conversation',
lastMessage:'',
updatedAt:serverTimestamp()
});

}

listenMessages();

});

/* SEND MESSAGE */

async function sendMessage(){

const text =
messageInput.value.trim();

if(text === '') return;

await addDoc(
collection(
db,
'rooms',
roomId,
'messages'
),
{
senderId:currentUser.uid,
text,
type:'text',
seen:false,
createdAt:serverTimestamp()
}
);

/* UPDATE ROOM */

await updateDoc(
doc(db,'rooms',roomId),
{
lastMessage:text,
updatedAt:serverTimestamp()
}
);

messageInput.value = '';

textarea.style.height = '44px';

}

/* LISTEN */

function listenMessages(){

const q = query(
collection(
db,
'rooms',
roomId,
'messages'
),
orderBy('createdAt')
);

onSnapshot(q,(snapshot)=>{

messagesDiv.innerHTML = '';

snapshot.forEach((docSnap)=>{

const msg =
docSnap.data();

const div =
document.createElement('div');

div.className =
msg.senderId === currentUser.uid
? 'message mine'
: 'message other';

div.innerHTML = `
${msg.text}
`;

messagesDiv.appendChild(div);

});

messagesDiv.scrollTop =
messagesDiv.scrollHeight;

});

}

/* EVENTS */

sendBtn.addEventListener(
'click',
sendMessage
);

messageInput.addEventListener(
'keypress',
(e)=>{

if(e.key === 'Enter'){

e.preventDefault();

sendMessage();

}
}
);
