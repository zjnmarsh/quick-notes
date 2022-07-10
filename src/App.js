import React, {useState} from 'react';
import './App.css';
import '@fontsource/roboto/300.css'
//
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import NoteCard from './NoteCard'


const App = () => {

    const deleteNote = (key) => {
        console.log(key);
        let noteIndex = notes.findIndex(note => note.key === key);
        let newArr1 = notes.slice(0, noteIndex);
        let newArr2 = notes.slice(noteIndex+1, notes.length);
        newArr1.concat(newArr2);
        setNotes(newArr1);
    }

    // const [notes, setNotes] = useState([{text: "This is the first note", date: "", key: 0}, {text: "This is a second note", date: "", key: 1}, {text: "This is a third note", date: "", key: 2}])
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    const addNewNote = () => {
        setNotes(notes.concat([{text: newNote, date:"", key: Date()}]));
        setNewNote("");
    }

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
                    notes.map((note) => (
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