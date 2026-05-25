import {
signInAnonymously
}
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

import {
doc,
setDoc,
serverTimestamp
}
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import {
auth,
db
}
from './firebase-config.js';

const loginBtn =
document.getElementById('loginBtn');

function randomBuffer(length){

const buffer = new Uint8Array(length);

crypto.getRandomValues(buffer);

return buffer;
}

async function biometricLogin(){

try{

let savedId =
localStorage.getItem('credentialId');

/* FIRST LOGIN */

if(!savedId){

const credential =
await navigator.credentials.create({

publicKey:{

challenge: randomBuffer(32),

rp:{
name:'BioChat'
},

user:{
id: randomBuffer(16),
name:'biochat@user.com',
displayName:'BioChat User'
},

pubKeyCredParams:[
{
type:'public-key',
alg:-7
}
],

authenticatorSelection:{
authenticatorAttachment:'platform',
residentKey:'required',
userVerification:'required'
},

timeout:60000,

attestation:'none'
}

});

savedId = btoa(
String.fromCharCode(
...new Uint8Array(
credential.rawId
)
)
);

localStorage.setItem(
'credentialId',
savedId
);

}

/* NORMAL LOGIN */

const rawId = Uint8Array.from(
atob(savedId),
c => c.charCodeAt(0)
);

await navigator.credentials.get({

publicKey:{

challenge: randomBuffer(32),

allowCredentials:[
{
id:rawId,
type:'public-key'
}
],

userVerification:'required',

timeout:60000
}

});

/* FIREBASE LOGIN */

const result =
await signInAnonymously(auth);

const user = result.user;

/* CREATE REAL USER */

await setDoc(
doc(db,'users',user.uid),
{
uid:user.uid,
name:'User-' + user.uid.slice(0,5),
avatar:`https://i.pravatar.cc/150?u=${user.uid}`,
online:true,
createdAt:serverTimestamp(),
lastSeen:serverTimestamp()
},
{merge:true}
);

window.location.href =
'chat.html';

}catch(err){

console.error(err);

alert('Authentication Failed');
}
}

loginBtn.addEventListener(
'click',
biometricLogin
);
