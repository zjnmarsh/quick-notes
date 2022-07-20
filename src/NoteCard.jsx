import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    Grid,
    Typography
} from "@mui/material";
import React, {useState} from 'react';

const NoteCard = ({data, deletefunc}) => {

    const [alertOpen, setAlertOpen] = useState(false);

    const handleOpen = () => {
        setAlertOpen(true);
    }

    const handleClose = () => {
        setAlertOpen(false);
    }

    const deleteMessage = () => {
        // delete the message
        deletefunc(data.key)
    }

    return (
        <Grid item xs={12} sm={6} md={4} >
            <Card>
                <CardActionArea onClick={handleOpen}>
                    <CardContent>
                        <Typography variant={"body1"}>
                            {data.text}
                            {data.key}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <Dialog
                    open={alertOpen}
                    onClose={handleClose}
                >
                    <DialogContent>
                        <DialogContentText>
                            Delete Note?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={deleteMessage}>
                           Delete
                        </Button>
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </Grid>
    )
}

export default NoteCard