const mongoose = require("mongoose")
const Schema = mongoose.Schema

const rxListSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  tty: {
    type: String,
    required: true,
  },
  rxcui: {
    type: Number,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

module.exports = mongoose.model("RxList", rxListSchema)
