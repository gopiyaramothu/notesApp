import React, { createRef, useEffect, useRef, useState } from 'react'
import Note from './note'
const Notes = ({notes = [], setNotes= () => {}}) => {
    const [counter, setCounter] = useState(localStorage.getItem('counter') ? Number(localStorage.getItem('counter')) : 3);
    useEffect(()=>{

        const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

        const updatedNotes = notes.map((note) => {
            const savedNote = savedNotes.find((n) => n.id == note.id);
            if(savedNote) {
                return {...note, position:savedNote.position}
            }
            else {
                const position = determinaNotsPosition();
                return {...note, position};
            }
        });

        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }, [notes.length]);

    useEffect(() => {
        localStorage.setItem('counter', counter);
    }, [counter])

    const noteRefs = useRef([]);

    const determinaNotsPosition = () => {
        const maxX = window.innerWidth - 250;
        const maxY = window.innerHeight - 250;
        return {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        }
    };

    const handleDragStart = (note, e) => {
        const {id} = note;
        const noteRef = noteRefs.current[id].current;
        const rect = noteRef.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const startPos = note.position;

        const handleMouseUp = (e) => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);

            const finalRect= noteRef.getBoundingClientRect();
            const newPosition = {x: finalRect.left, y:finalRect.top};

            if(checkForOverlap(id)){
                console.log('inside if')
                noteRef.style.left = `${startPos.x}px`;
                noteRef.style.top = `${startPos.y}px`;
            }
            else{
                console.log('iniside else')
                updateNotePosition(id, newPosition);
            }
        };

        const handleMouseMove = (e) => {
                const newX = e.clientX - offsetX;
                const newY = e.clientY - offsetY;

                noteRef.style.left = `${newX}px`;
                noteRef.style.top = `${newY}px`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

};

    const updateNotePosition = (id, newPosition) => {
        const updatedNotes = notes.map(note => note.id === id ? 
            {...note, position:newPosition} : note)

        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const checkForOverlap = (id) => {
        const currentNoteRef = noteRefs.current[id].current;
        const currentRect = currentNoteRef.getBoundingClientRect();

        return notes.some((note) => {
            if(note.id === id){
                return false;
            }

            const otherNoteRef = noteRefs.current[note.id].current;
            const otherRect = otherNoteRef.getBoundingClientRect();

            const overLap = !(
                currentRect.right < otherRect.left ||
                currentRect.left > otherRect.right ||
                currentRect.bottom < otherRect.top ||
                currentRect.top > otherRect.bottom
            );

            return overLap;
        } );
    }

    const addNote = () => {
        const newNote = document.getElementById('newNote').value;
        const updatedNotes = [...notes, {id:counter, name:newNote, position:determinaNotsPosition()}];
        setNotes(updatedNotes);
       localStorage.setItem('notes', JSON.stringify(updatedNotes));
       setCounter(counter+1);
       document.getElementById('newNote').value = "";
    }

    const closeHandler = (id) => {
        var result = window.confirm("Is Task Completed?");
        if (result) {
            const updatedNotes = notes.filter((note) => note.id !== id);
            setNotes(updatedNotes);
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
            setCounter(counter-1);
        }
    }

  return (
    <>
    <div>
        <input type="text" id="newNote" placeholder='Add a New Note'/>
        <input type="submit" value="Add Note" onClick={() => addNote()} />
    </div>
    <div>
        {notes.map((note) => {
            return <Note 
            ref={noteRefs.current[note.id] 
                ? noteRefs.current[note.id] 
                : (noteRefs.current[note.id]= createRef())}
            key={note.id} 
            content={note.name} 
            initialPosition={note.position}
            onMouseDown= {(e) => handleDragStart(note, e)}
            handleClose={() => closeHandler(note.id)}
             />
        })}
    </div>
    </>
  )
}

export default Notes