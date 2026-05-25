import { initializeApp }
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';

import {
getFirestore,
collection,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp
}
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
apiKey: "AIzaSyAAYEUsRtSQb-D-xLf-NNEzlP4Ft4fUNzI",
authDomain: "ihmp-47147.firebaseapp.com",
projectId: "ihmp-47147",
storageBucket: "ihmp-47147.firebasestorage.app",
messagingSenderId: "671219535341",
appId: "1:671219535341:web:03d277fb02808515cc2be4"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const params =
new URLSearchParams(window.location.search);

const roomUser = params.get('user');

const roomName =
document.getElementById('roomName');

const messagesDiv =
document.getElementById('messages');

const messageInput =
document.getElementById('messageInput');

const sendBtn =
document.getElementById('sendBtn');

const backBtn =
document.getElementById('backBtn');

roomName.innerText = roomUser;

backBtn.addEventListener('click',()=>{
window.history.back();
});

async function sendMessage(){

const text = messageInput.value.trim();

if(text === '') return;

await addDoc(
collection(db,'messages'),
{
room: roomUser,
text,
createdAt: serverTimestamp(),
user:'me'
}
);

messageInput.value = '';
}

const q = query(
collection(db,'messages'),
orderBy('createdAt')
);

onSnapshot(q,(snapshot)=>{

messagesDiv.innerHTML = '';

snapshot.forEach((doc)=>{

const data = doc.data();

if(data.room !== roomUser) return;

const div =
document.createElement('div');

if(data.user === 'me'){
div.className = 'message mine';
}else{
div.className = 'message other';
}

div.innerText = data.text;

messagesDiv.appendChild(div);

});

messagesDiv.scrollTop =
messagesDiv.scrollHeight;

});

sendBtn.addEventListener(
'click',
sendMessage
);

messageInput.addEventListener(
'keypress',
(e)=>{
if(e.key === 'Enter'){
sendMessage();
}
}
);
