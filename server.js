const express = require('express');
const path = require('path');
const termData = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
// const { getNotes } = require('./public/assets/js/index.js');
// const { getNotes } = require();



// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json'));
  res.json(notes);
});
// _____________________________________________________________

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    newNote.id = uuidv4();
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
  });
// _____________________________________________________________

  // app.delete('/api/notes/:id', (req, res) => {
  //   const noteId = req.params.id;
  //   const notes = getNotes();
  //   const filteredNotes = notes.filter(note => note.id !== noteId);
  //   fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) => {
  //     if (err) throw err;
  //     res.json({ message: `Note with id ${noteId} has been deleted.` });
  //   });
  // });





// _____________________________________________________________

app.delete("/api/notes/:id", function (req, res) {
  const idToDelete = req.params.id;
  fs.readFile("./db/db.json", function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send("Unable to read file");
    }

    const allNotes = JSON.parse(data);
    const notesToKeep = allNotes.filter(note => note.id !== idToDelete);

    fs.writeFile("./db/db.json", JSON.stringify(notesToKeep, null, 2), (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Unable to write file");
      }
      
      return res.sendStatus(200);
    });
  });
});


// _____________________________________________________________


// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

