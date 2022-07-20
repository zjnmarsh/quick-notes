import React, {useState, useEffect } from 'react';
import './App.css';
import '@fontsource/roboto/300.css'
//
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import NoteCard from './NoteCard'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, onSnapshot, query, setDoc, deleteDoc } from "firebase/firestore"


const App = () => {

    // ---FIREBASE---
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

    const [fsNotes, setFSNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    const fsListenToData = () => {
        const qu = query(collection(db, "notes"));
        onSnapshot(qu, (querySnapshot) => {
            let tmpFSNotes = [];
            querySnapshot.forEach((snap) => {
                tmpFSNotes.push({key: snap.id, text: snap.data()["note"]})
            });
            setFSNotes(tmpFSNotes);
        })
    }

    const fsAddData = async () => {
        try {
            console.log("Trying to add data");
            const noteID = Date.now().toString();
            await setDoc(doc(db, "notes", noteID), {
                note: newNote,
                date: Date()
            });
            setNewNote("");
        } catch (e) {
            console.error("Error adding document: " + e);
        }
    }

    const fsDeleteData = async (key) => {
        try {
            console.log("Trying to delete data");
            await deleteDoc(doc(db, "notes", key));
        } catch (e) {
            console.error("Error deleting data: " + e);
        }
    }

    useEffect(() => {
        fsListenToData();
    }, [])

    return (<div className="App">
        <Box>
            <Box className={"Navbar"}>
                <Typography variant={"h2"} component={"div"} gutterBottom>
                    Quick notes
                </Typography>
            </Box>

            <Grid container spacing={2} className={"NoteList"}>
                {/*<NoteCard data={{text: "Hello", date: "14-01-2022"}} />*/}
                {
                    fsNotes.map((note) => (
                        <NoteCard data={note} key={note.key} deletefunc={fsDeleteData}/>
                    ))
                }
            </Grid>

            <Box
                className={"InputArea"}
                >
                <Box
                    sx={{
                        // border: '3px solid #8AC007',
                        width: '70%',
                        margin: 'auto',
                    }}>
                    <TextField
                        id={"input-box"}
                        label={"quick note"}
                        multiline
                        rows={1}
                        fullWidth
                        value={newNote}
                        variant={"filled"}
                        onChange={(e) => {setNewNote(e.target.value)}}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter'){
                                fsAddData()
                            }
                        }}
                    />
                </Box>
                <Box
                    id={"add-note-button"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"30%"}>
                    <Button
                        variant={"contained"}
                        onClick={() => fsAddData()}
                    >
                        Enter</Button>
                </Box>
            </Box>
        </Box>


    </div>)
}

export default App;