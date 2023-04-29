const express = require("express")
const app = express()
const morgan = require("morgan")
const mongoose = require("mongoose")
require("dotenv").config()
const { expressjwt } = require("express-jwt")
const PORT = process.env.PORT || 9000

process.env.SECRET

app.use(express.json())
app.use(morgan("dev"))

// mongoose.connect("mongodb://localhost:27017/rxlookupdatabase", () =>
//   console.log("Connected to the DB")
// )

app.use(express.static(path.join(__dirname, "client", "build")))

mongoose.connect(process.env.MONGODB_URI, () =>
  console.log("Connected to the mongodb")
)

// app.use('/api/', expressjwt({ secret: process.env.SECRET, algorithms: ['HS256']}))

app.use("/auth", require("./routes/authRouter.js"))
//expressjwt will require token before allowing access to '/api' route
app.use(
  "/api",
  expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] })
)
app.use("/api/rxlist", require("./routes/rxListRouter.js"))
// app.use('/rxlist', require('./routes/rxListRouter.js'))
app.use("/api/notes", require("./routes/noteRouter.js"))

app.use((err, req, res, next) => {
  console.log(err)
  if (err.name === "UnauthorizedError") {
    res.status(err.status)
  }
  return res.send({ errMsg: err.message })
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server is connected on ${PORT}`)
})
