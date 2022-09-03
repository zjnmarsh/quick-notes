import React, { useState, useEffect } from "react";
import "./App.css";
import "@fontsource/roboto/300.css";
//
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import NoteCard from "./NoteCard";
import MenuBar from "./MenuBar";

// firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

const App = () => {
  // ---FIREBASE---
  const firebaseConfig = {
    apiKey: "AIzaSyD3iHeLpBRskx9FoCw4D7aG1BUfMdEfiHU",
    authDomain: "quick-notes-f1608.firebaseapp.com",
    projectId: "quick-notes-f1608",
    storageBucket: "quick-notes-f1608.appspot.com",
    messagingSenderId: "540150685168",
    appId: "1:540150685168:web:1588e3f170a2a6bb63d135",
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);

  // ---authentication---
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const user = auth.currentUser;
  const [authFlag, setAuthFlag] = useState(false);

  const signInGoogle = () => {
    console.log("Authenticating with Google");
    signInWithRedirect(auth, provider)
      .then((result) => {
        // google access token
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // the signed-in user info
        const user = result.user;
        console.log(user);
        console.log(credential);
        console.log(token);
        setUserId(user.uid);
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  };

  const signOutGoogle = () => {
    console.log("Signing out with Google");
    signOut(auth)
      .then(() => {
        console.log("Sign out successful");
        setAuthFlag(false);
        setFSNotes([]);
      })
      .catch((error) => {
        console.log("Error " + error);
      });
  };

  // changes userId to get right notes
  onAuthStateChanged(auth, (user) => {
    if (!authFlag) {
      if (user) {
        setAuthFlag(true);
        console.log("Auth state changed");
        setUserId(user.uid);
      }
    }
  });

  const [userId, setUserId] = useState(null);

  const [fsNotes, setFSNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const fsListenToData = async () => {
    console.log("Listening to data");
    const qu = query(collection(db, "users", userId ? userId : "x", "notes"));
    onSnapshot(qu, (querySnapshot) => {
      let tmpFSNotes = [];
      querySnapshot.forEach((snap) => {
        tmpFSNotes.push({ key: snap.id, text: snap.data()["note"] });
      });
      setFSNotes(tmpFSNotes);
    });
  };

  const fsAddData = async () => {
    try {
      console.log("Trying to add data");
      const noteID = Date.now().toString();
      await setDoc(doc(db, "users", userId, "notes", noteID), {
        note: newNote,
        date: Date(),
      });
      setNewNote("");
    } catch (e) {
      console.error("Error adding document: " + e);
    }
  };

  const fsDeleteData = async (key) => {
    console.log("Deleting data");
    try {
      console.log("Trying to delete data");
      await deleteDoc(doc(db, "users", userId, "notes", key));
    } catch (e) {
      console.error("Error deleting data: " + e);
    }
  };

  useEffect(() => {
    console.log("use effect");
    // signInGoogle();
    fsListenToData();
  }, [userId]);

  return user === null ? (
    <div className="App">
      <Box>
        <Box className={"Navbar"}>
          {/* <Box width={"82%"}> */}
          <Typography variant={"h2"} component={"div"} gutterBottom>
            Quick notes
          </Typography>
          {/* </Box> */}
        </Box>
      </Box>

      <Box
        display={"flex"}
        // justifyContent={"center"}
        // alignItems={"center"}
        height={"100%"}
        paddingTop={"5rem"}
        paddingBottom={"5rem"}
      >
        <Button variant={"contained"} onClick={() => signInGoogle()}>
          Sign In With Google
        </Button>
      </Box>

      {/*<div>{userId}</div>*/}
      {/*<div>Hello</div>*/}
    </div>
  ) : (
    <div className="App">
      <Box>
        <Box className={"Navbar"}>
          <Box width={"82%"}>
            <Typography variant={"h2"} component={"div"} gutterBottom>
              Quick notes
            </Typography>
          </Box>
          <Box position={"fixed"} right={0}>
            <MenuBar signOut={signOutGoogle} />
          </Box>
        </Box>

        <Grid container spacing={2} className={"NoteList"}>
          {/* <NoteCard
            data={{ text: user.uid }}
            key={0}
            deletefunc={fsDeleteData}
          /> */}
          {fsNotes.map((note) => (
            <NoteCard data={note} key={note.key} deletefunc={fsDeleteData} />
          ))}
        </Grid>

        <Box className={"InputArea"}>
          <Box width={"70%"} margin={"auto"}>
            <TextField
              id={"input-box"}
              label={"quick note"}
              multiline
              rows={1}
              fullWidth
              value={newNote}
              variant={"filled"}
              onChange={(e) => {
                setNewNote(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  fsAddData();
                }
              }}
            />
          </Box>
          <Box
            id={"add-note-button"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"30%"}
          >
            <Button variant={"contained"} onClick={() => fsAddData()}>
              Enter
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default App;
