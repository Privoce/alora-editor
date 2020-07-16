import React, { useState, useEffect, useRef } from 'react';
import AloraEditor from './components/Editor';
import { fetchLastEditorId, setLastEditorId, resetLastEditorId } from './Storage';
import NotesManager from './NotesManager';
import { v1 as uuidv1 } from 'uuid';  
import { hijackSave } from './utils';


function Editor() {
  hijackSave();
  const [dark, setDark] = useState(false);
  // TODO: Paging
  const [notes, setNotes] = useState([]);
  const [id, setId] = useState(fetchLastEditorId());

  const updateNotes = (handler) => noteManager.getNotes().then((notes) => {
    if (handler) handler(notes);
    setNotes(notes);
  });

  const noteManager = new NotesManager();

  const handleDelete = async (id) => {
    resetLastEditorId();
    await noteManager.deleteOne(id);
    updateNotes((notes) => {
      if (notes.length === 0) {
        const tempId = uuidv1();
        setId(tempId);
        noteManager.addOne(tempId).then(() => updateNotes());  
        setLastEditorId(tempId);
      }
      else {
        setId(notes[0]);
        setLastEditorId(notes[0]);
      }
    });
  }


  const handleAdd = async () => {
    const tempId = uuidv1();
    await noteManager.addOne(tempId);
    setId(tempId);
    updateNotes((notes) => {
      setId(notes[notes.length - 1]);
      setLastEditorId(notes[notes.length - 1]);
    });
  }

  const handleSwitch = (id) => {
    setId(id);
    setLastEditorId(id);
  }

  useEffect(() => {
    updateNotes();
  }, [id])

  return (
    <div>
      <div>
        <h1>Tittle: {id}</h1>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection:'row'}}>
          <button onClick={() => setDark(!dark)}>Dark Mode</button>
          <button onClick={() => handleDelete(id)}>Delete</button>
          <button onClick={handleAdd}>Add</button>
        </div>
        <div>
          {
              notes.map((it) => <button value={it} onClick={(e) => {handleSwitch(e.target.value)}} >{it}</button>)
          }
        </div>
      </div>

      <AloraEditor noteManager={noteManager} dark={dark} id={id}/>
    </div>
  );
}

export default Editor;
