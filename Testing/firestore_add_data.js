import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, addDoc, getDoc, onSnapshot, query, where, getDocs, limit } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyD3iHeLpBRskx9FoCw4D7aG1BUfMdEfiHU",
    authDomain: "quick-notes-f1608.firebaseapp.com",
    projectId: "quick-notes-f1608",
    storageBucket: "quick-notes-f1608.appspot.com",
    messagingSenderId: "540150685168",
    appId: "1:540150685168:web:1588e3f170a2a6bb63d135"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const fsAddData = async () => {
    try {
        console.log("Trying to add data");
        const docRef = await addDoc(collection(db, "users"), {
            first: "Ada",
            last: "Lovelace",
            born: 1815
        })
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

const fsReadData = async () => {
    const mySnapshot = await getDoc(doc(db, 'users/sXSdc4YhHrtEdC3iWXQn'));
    if (mySnapshot.exists()) {
        const docData = mySnapshot.data();
        console.log(`My data is ${JSON.stringify(docData)}`);
    }
}

// ---

let listenDocUnsubscribe;

const listenToDocument = () => {
    listenDocUnsubscribe = onSnapshot(doc(db, 'users/sXSdc4YhHrtEdC3iWXQn'), docSnapshot => {
        if (docSnapshot.exists()) {
            const docData = docSnapshot.data();
            console.log(`In realtime, docData is ${JSON.stringify(docData)}`);
        }
    })
}

const cancelDocListener = () => {
    listenDocUnsubscribe();
}

// ---

const queryForDocuments = async () => {
    const nameQuery = query(
        collection(db, 'users'),
        where('first', '==', 'AdaX'),
        limit(10)
    );

    const querySnapshot = await getDocs(nameQuery);
    // const allDocs = querySnapshot.docs;

    // onSnapshot(nameQuery, (querySnapshot) = > {...})

    querySnapshot.forEach((snap) => {
        console.log(`Document ${snap.id} contains ${JSON.stringify(snap.data()["born"])}`)
    });

    // console.log(`Document query returned ${allDocs}`);
}



// fsAddData();
// fsReadData();
// listenToDocument();
queryForDocuments()