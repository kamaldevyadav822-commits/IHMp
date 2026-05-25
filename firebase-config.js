import { initializeApp }
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';

import {
getAuth
}
from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

import {
getFirestore
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

export const auth = getAuth(app);

export const db = getFirestore(app);
