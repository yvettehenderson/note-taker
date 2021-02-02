const util = require("util");
const fs = require("fs");


const uuid = require("uuid");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Save {
  read() {
    return readFile("db/db.json", "utf8");
  }

  write(note) {
    return writeFile("db/db.json", JSON.stringify(note));
  }

  get() {
    return this.read().then((notes) => {
      let parsedNotes;

    
      try {
        parsedNotes = [].concat(JSON.parse(notes));
      } catch (err) {
        parsedNotes = [];
      }

      return parsedNotes;
    });
  }

  add(note) {
    const { title, text } = note;

    if (!title || !text) {
      throw new Error("enter copy to title and text");
    }

    
    const newNote = { title, text, id: uuid };

   
    return this.get()
      .then((notes) => [...notes, newNote])
      .then((updatedNotes) => this.write(updatedNotes))
      .then(() => newNote);
  }

  delete(id) {
    return this.get()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((filteredNotes) => this.write(filteredNotes));
  }
}

module.exports = new Save();
