const express = require("express")
const noteRouter = express.Router()
const Notes = require("../models/notes.js")

// Get all Notes
noteRouter.get("/", (req, res, next) => {
  Notes.find((err, notes) => {
    if (err) {
      res.status(500)
      return next(err)
    }
    return res.status(200).send(notes)
  })
})

// Get Notes by User Id
noteRouter.get("/user", (req, res, next) => {
  Notes.find({ user: req.auth._id }, (err, notes) => {
    if (err) {
      res.status(500)
      return next(err)
    }
    return res.status(200).send(notes)
  })
})
// Post new Note
noteRouter.post("/", (req, res, next) => {
  req.body.user = req.auth._id
  const newNote = new Notes(req.body)
  newNote.save((err, savedNote) => {
    if (err) {
      res.status(500)
      return next(err)
    }
    return res.status(201).send(savedNote)
  })
})

// Delete Note
noteRouter.delete("/:noteId", (req, res, next) => {
  Notes.findOneAndDelete(
    { _id: req.params.noteId, user: req.auth._id },
    (err, deletedNote) => {
      if (err) {
        res.status(500)
        return next(err)
      }
      return res
        .status(200)
        .send(`Successfully deleted note ${deletedNote.notes}`)
    }
  )
})

// Update Note
noteRouter.put("/:noteId", (req, res, next) => {
  Notes.findOneAndUpdate(
    { _id: req.params.noteId, user: req.auth._id },
    req.body,
    { new: true },
    (err, updatedNote) => {
      if (err) {
        res.status(500)
        return next(err)
      }
      return res.status(201).send(updatedNote)
    }
  )
})

module.exports = noteRouter
