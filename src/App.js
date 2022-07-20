import React, {useState, useEffect } from 'react';
import './App.css';
import '@fontsource/roboto/300.css'
//
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import NoteCard from './NoteCard'

import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { collection, doc, addDoc, getDoc, onSnapshot, query, where, getDocs, limit, setDoc } from "firebase/firestore"


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

    // const fsReadData = async () => {
    //     const notesQuery = query(
    //         collection(db, 'notes')
    //     )
    //     const querySnapshot = await getDocs(notesQuery);
    //     let tmpFSNotes = []
    //     querySnapshot.forEach((snap) => {
    //         tmpFSNotes.push({key: snap.id, text: snap.data()["note"]})
    //     })
    //     setFSNotes(tmpFSNotes);
    // }

    const fsListenToData = () => {
        const qu = query(collection(db, "notes"));
        const unsubscribe = onSnapshot(qu, (querySnapshot) => {
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
            const docRef = await addDoc(collection(db, "notes"), {
                note: newNote
            })
            console.log("Document written with ID: " + docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    const addNewNote = () => {
        fsAddData();
        setNotes(notes.concat([{text: newNote, date:"", key: Date.now()}]));
        setNewNote("");
    }

    const deleteNote = (key) => {
        console.log(key);
        let noteIndex = notes.findIndex(note => note.key === key);
        let newArr1 = notes.slice(0, noteIndex);
        let newArr2 = notes.slice(noteIndex+1, notes.length);
        newArr1 = newArr1.concat(newArr2);
        setNotes(newArr1);
    }

    // const tmpFunc = async () => {
    //     await fsReadData()
    // }

    useEffect(() => {
        // fsReadData();
        fsListenToData();
    }, [])

    return (<div className="App">
        <Box>
            <Box>
                <Typography variant={"h2"} component={"div"} gutterBottom>
                    Quick notes
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {/*<NoteCard data={{text: "Hello", date: "14-01-2022"}} />*/}
                {
                    fsNotes.map((note) => (
                        <NoteCard data={note} key={note.key} deletefunc={deleteNote}/>
                    ))
                }
            </Grid>

            <Box
                sx={{
                    display: 'flex',
                    height: '5rem',
                    width: '100%',
                    position: 'fixed',
                    bottom: '0px',
                }}>
                <Box
                    sx={{
                        // border: '3px solid #8AC007',
                        width: '70%',
                        margin: 'auto'
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
                                addNewNote()
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
                        onClick={() => addNewNote()}
                    >
                        Enter</Button>
                </Box>
            </Box>
        </Box>


    </div>)
}

export default App;