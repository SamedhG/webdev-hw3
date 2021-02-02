import { useState } from 'react';
import { generateSecret, score } from './game';

import './App.css';
import { Table, TableHead, 
    TableBody, TableRow, TableCell, 
    Button, Paper, TableContainer, 
    TextField, Grid, Typography} from "@material-ui/core";


// Return the reset screen
function Finished({message, reset}) {
    return (
        <div className="App" style={{padding: 20}}>
            <Typography variant="h3">{message}</Typography>
            <p>
                <Button onClick={reset} variant="contained" color="primary">
                    Reset
                </Button>
            </p>
        </div>
    );
}


function Display({guesses}) {
    return (<Grid item xs={12}> <TableContainer component={Paper}> <Table>
        <TableHead color="primary">
            <TableRow>
                <TableCell width="60%"> 
                    <Typography variant="h6"> Guess </Typography> 
                </TableCell>
                <TableCell align="center"> 
                    <Typography variant="h6"> Bulls </Typography> 
                </TableCell>
                <TableCell align="center"> 
                    <Typography variant="h6"> Cows </Typography> 
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {guesses.map(guess =>
            <TableRow>
                <TableCell>{guess.guess}</TableCell>
                <TableCell align="center">{guess.bulls}</TableCell>
                <TableCell align="center">{guess.cows}</TableCell>
            </TableRow>)}
        </TableBody>
    </Table> </TableContainer> </Grid>)
}

function Controls({guess, error, setError, reset}) {
    // The text in the guess field
    const [text, setText] = useState("");
    // Updates the text with the new value, and does some validation
    function updateText(ev) {
        setError({error: false, message:""});
        let val = ev.target.value;
        if (val.length < text.length) {
            setText(val);
            return;
        }
        if (text.length >= 4) {
            setError({ error: true, message: "Only 4 chars allowed" });
        } else if (val[val.length - 1] < '0' || val[val.length - 1] > '9') {
            setError({ error: true, message: "Only digits allowed" });
        }
        else if (text.includes(val[val.length - 1])) {
            setError({ error: true, message: "All digits must be unique" });
        } else {
            setText(val);
        }
    }
    function myGuess() {
        guess(text);
        setText("");
    }
    // Handles the enter keypress to guess
    function keyPress(ev) {
        if (ev.key === "Enter") {
            myGuess()
        }
    }
    return(<Grid container alignItems="flex-start" >
        <Grid item xs={8}>
            <TextField id="outlined-basic" 
                label="Guess" 
                size="small"
                variant="outlined" 
                value={text}
                onChange={updateText}
                onKeyPress={keyPress} 
                error={error.error}
                helperText={error.message} />
            <Button onClick={myGuess} variant="contained" color="primary">
                Guess
            </Button>
        </Grid>
        <Grid item xs={4}>
            <Button onClick={reset} variant="contained" color="primary">
                Reset
            </Button>
        </Grid>
    </Grid>)


}

function App() {
    // The game state: contains the secret and the guesses
    const [state, setState] = useState(generateState());
    // The error object
    const [error, setError] = useState({error: false, message: "" });

    // Generate a new game state
    function generateState() {
        return { 
            secret: generateSecret(),
            guesses: [],
        };
    }

    // Make a guess, this does some error checking and then evaluates the guess
    function guess(text) {
        if(text.length !== 4) {
            setError({error: true, message: "Guess should be of length 4" });
        } else if (state.guesses.filter((g) => g.guess === text).length > 0) {
            setError({error: true, message: "Only unique guesses allowed" });
        } else {
            let evaluated = score(text, state.secret); 
            let s = { ...state }
            s.guesses.push(evaluated);
            setState(s);
        }
    }



    // Reset the entire game with a new state
    function reset() {
        setState(generateState());
        setError({ error: false, message: "" });
    }

    // The 2 possible game over conditions
    let num_guesses = state.guesses.length;
    if (num_guesses >= 8) {
        return <Finished message="Game Over!" reset={reset} />;
    }

    if (num_guesses > 0 && state.guesses[num_guesses - 1].bulls === 4) {
        return <Finished message="You Win!" reset={reset} />;
    }

    // The standard game screen
    return (
        <div className="App" style={{ padding: 20 }}>
            <Grid container spacing={2} alignItems="flex-start">
                <Grid item style={{paddingBottom: 40}} xs={12}>
                    <Typography variant="h3"> Bulls&Cows </Typography>
                </Grid>
                <Controls error={error} setError={setError} guess={guess} reset={reset} />
                <Display guesses={state.guesses} />

            </Grid>
        </div>
    );
}

export default App;
