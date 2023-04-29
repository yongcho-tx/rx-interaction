import React, { useContext } from "react"
import { DrugContext } from "../context/DrugProvider.js"

function Note(props) {
  const { notes, _id } = props
  const { deleteNote } = useContext(DrugContext)

  return (
    <div className="user-notes">
      <p> {notes} </p>
      <button onClick={() => deleteNote(_id)}>remove</button>
    </div>
  )
}

export default Note
