import { Container } from 'react-bootstrap'
import {Routes,Route,Navigate} from 'react-router-dom'
import{v4 as uuidV4} from 'uuid'

import NewNote from './components/NewNote'
import useLocalStorage from './hooks/LocalStorageHooks'
import { useMemo } from 'react'
import NoteList from './components/NoteList'
import {NoteLayout} from './components/NoteLayout'
import Note from './components/Note'
import EditNote from './components/EditNote'
export type Note = {
  id:string,
}& NoteData

export type RawNote = {
  id: string
} & RawNoteData
export type RawNoteData = {
  title:string,
  markdown: string,
  tagIds: string[]
}
export type NoteData = {
  title: string,
  markdown:string,
  tags: Tag[]
}
export type Tag = {
  id: string,
  label:string
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(()=>{
    return notes.map(note =>{
      return {...note, tags:tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  },[notes,tags])

  const onCreateNote = ({tags,...data}:NoteData)=>{
    setNotes(prev => {
      return [...prev, {...data, id:uuidV4(), tagIds:tags.map(tag => tag.id)}]
    })
  }
  const onUpdateNote = (id:string,{tags,...data}:NoteData)=>{
    setNotes(prev=>{
      return prev.map(note => {
        if(note.id===id){
          return {...note, ...data, tagIds:tags.map(tag=>tag.id)
          } 
        }else{ 
          return note
        }
      })
    })

  }

  const onAddTag = (tag:Tag) => {
    setTags(prev => [...prev,tag])
  }
  return (
    <Container className='my-4'>
      <Routes>
        <Route path='/' element={<NoteList availableTags={tags} notes={notesWithTags}/>} />
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={onAddTag} availableTags={tags}/>} />
        <Route path='/:id' element={<NoteLayout notes={notesWithTags}/>}>
          <Route index element={<Note/>} />
          <Route path='edit' element={<EditNote onSubmit={onUpdateNote} onAddTag={onAddTag} availableTags={tags}/>} />
        </Route>
        <Route path='*' element={<Navigate to="/"/>} />
      </Routes>
    </Container>
  )
}

export default App
