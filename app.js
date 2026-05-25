/* =========================
app.js
UPDATED SINGLE-POPUP
BIOMETRIC LOGIN LOGIC
========================= */

import { initializeApp }
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';

import {
getAuth,
signInAnonymously
}
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

/* =========================
FIREBASE CONFIG
========================= */

const firebaseConfig = {
apiKey: "AIzaSyAAYEUsRtSQb-D-xLf-NNEzlP4Ft4fUNzI",
authDomain: "ihmp-47147.firebaseapp.com",
projectId: "ihmp-47147",
storageBucket: "ihmp-47147.firebasestorage.app",
messagingSenderId: "671219535341",
appId: "1:671219535341:web:03d277fb02808515cc2be4"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/* =========================
ELEMENTS
========================= */

const loginBtn =
document.getElementById('loginBtn');

/* =========================
UTILITY
========================= */

function randomBuffer(length){

const buffer = new Uint8Array(length);

crypto.getRandomValues(buffer);

return buffer;
}

/* =========================
MAIN LOGIN FLOW
========================= */

async function biometricLogin(){

try{

/* =========================
CHECK SUPPORT
========================= */

if(!window.PublicKeyCredential){

alert(
'WebAuthn / Passkeys not supported'
);

return;
}

/* =========================
CHECK SAVED PASSKEY
========================= */

let savedId =
localStorage.getItem('credentialId');

/* =========================
FIRST TIME LOGIN
CREATE PASSKEY
ONLY ONE POPUP
========================= */

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

/* =========================
SAVE PASSKEY ID
========================= */

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

/* =========================
DIRECT LOGIN
NO SECOND PROMPT
========================= */

await signInAnonymously(auth);

/* =========================
REDIRECT
========================= */

window.location.href =
'chat.html';

return;
}

/* =========================
NORMAL LOGIN
ONLY ONE VERIFY POPUP
========================= */

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

/* =========================
FIREBASE LOGIN
========================= */

await signInAnonymously(auth);

/* =========================
REDIRECT
========================= */

window.location.href =
'chat.html';

}catch(err){

console.error(err);

alert(
'Biometric Authentication Failed'
);
}
}

/* =========================
BUTTON EVENT
========================= */

loginBtn.addEventListener(
'click',
biometricLogin
);
