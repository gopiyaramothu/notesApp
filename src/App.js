import './App.css';
import { useEffect, useState } from 'react';
import Notes from './components/notes';

function App() {

  const defaultNotes = [{
    id:1,
    name:'Wakeup in the morning'
  },
{
    id:2,
    name:'Go to office by 8am'
  }]

const [notes,setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || defaultNotes);

  return (
    <div className="App">
     <Notes notes={notes} setNotes={setNotes} />
    </div>
  );
}

export default App;
