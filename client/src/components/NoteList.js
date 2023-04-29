import React, { useContext, useEffect } from "react"
import Note from "./Note.js"
import { DrugContext } from "../context/DrugProvider.js"

function NoteList(props) {
  const { notes } = props
  const { getUserNotes } = useContext(DrugContext)

  useEffect(() => {
    getUserNotes()
    console.log("fetched user notes")
  }, [])

  return (
    <div>
      {notes.map((note) => (
        <Note {...note} key={note._id} />
      ))}
    </div>
  )
}

export default NoteList
