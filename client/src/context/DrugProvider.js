import { useDebounce } from "../hooks/debounceHook"
import React, { useEffect, useState } from "react"
import axios from "axios"

export const DrugContext = React.createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  config.headers.Authorization = `Bearer ${token}`
  return config
})

function DrugProvider(props) {
  const initState = {
    user: JSON.parse(localStorage.getItem("user")) || {},
    token: localStorage.getItem("token") || "",
    notes: [],
    errMsg: "",
  }
  // console.log("initstate: ", selectedMeds)

  const [userState, setUserState] = useState(initState)
  const [searchQuery, setSearchQuery] = useState("")
  const [rxcuiQuery, setRxcuiQuery] = useState("")
  const [noMedNames, setNoMedNames] = useState(false)
  const [medNames, setMedNames] = useState([])
  const [selectedMeds, setSelectedMeds] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [interactions, setInteractions] = useState([])
  const [noRxcuis, setNoRxcuis] = useState(false)

  const prepareSearchQuery = (query) => {
    const url = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${query}`
    return encodeURI(url)
  }

  const prepareCrossInteraction = (query) => {
    const url = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${query}`
    return encodeURI(url)
  }

  const searchMedName = async () => {
    if (!searchQuery || searchQuery.trim() === "") return

    setLoading(true)
    setNoMedNames(false)

    const URL = prepareSearchQuery(searchQuery)

    const res = await axios.get(URL).catch((err) => {
      console.log("Error: ", err)
    })

    if (res) {
      // console.log("Response: res.data", res.data)
      console.log("object length: ", Object.keys(res.data.drugGroup).length)
      // console.log("object: ", Object.keys(res.data.drugGroup))
      // console.log("drugGroup: ", res.data.drugGroup.conceptGroup[res.data.drugGroup.conceptGroup.length-1].conceptProperties)
      const medData = res.data.drugGroup.conceptGroup
      Object.keys(res.data.drugGroup).length >= 2
        ? setMedNames(medData[medData.length - 1].conceptProperties)
        : setNoMedNames(true)
    }
    setLoading(false)
  }

  const searchCrossInteraction = async () => {
    if (!rxcuiQuery || rxcuiQuery.trim() === "") return
    setLoading(true)
    setNoRxcuis(false)

    const URL = prepareCrossInteraction(rxcuiQuery)
    const res = await axios.get(URL).catch((err) => {
      console.log("Error: ", err)
    })

    if (res) {
      console.log(res.data.nlmDisclaimer)
      try {
        const rxcuiData =
          res.data?.fullInteractionTypeGroup[0]?.fullInteractionType[0]
            ?.interactionPair[0]
        const interactionData = rxcuiData.description
        console.log(Object.keys(res.data).length)
        // console.log("rxcuiData: ", rxcuiData)
        // console.log("Interaction: ", interactionData)
        if (!res.data.fullInteractionTypeGroup) {
          setNoRxcuis(true)
        } else {
          setInteractions(interactionData)
        }
      } catch {
        setInteractions("")
      }
    }
    setLoading(false)
  }

  const signup = (credentials) => {
    axios
      .post("/auth/signup", credentials)
      .then((res) => {
        const { user, token } = res.data
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        setUserState((prevUserState) => ({
          ...prevUserState,
          user,
          token,
        }))
      })
      .catch((err) => handleAuthErr(err.response.data.errMsg))
  }

  const login = (credentials) => {
    axios
      .post("/auth/login", credentials)
      .then((res) => {
        const { user, token } = res.data
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.removeItem("selectedMeds")
        getUserNotes()
        getMedList()
        setUserState((prevUserState) => ({
          ...prevUserState,
          user,
          token,
        }))
      })
      .catch((err) => handleAuthErr(err.response.data.errMsg))
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("selectedMeds")
    setUserState({
      user: {},
      token: "",
      notes: [],
    })
    setSelectedMeds([])
    setInteractions([])
  }

  const handleAuthErr = (errMsg) => {
    setUserState((prevState) => ({
      ...prevState,
      errMsg,
    }))
  }

  const resetAuthErr = () => {
    setUserState((prevState) => ({
      ...prevState,
      errMsg: "",
    }))
  }

  const addMedList = (newMeds) => {
    axios
      .post("/rxlist", newMeds)
      .then((res) => {
        console.log("i am res.data:", res.data)
        // const myMedList = [...selectedMeds, newMeds]
        setSelectedMeds((prevState) => {
          console.log("Saved into setSelectedMeds", res.data)
          return [...prevState, newMeds]
        })
        //if res.data in put in, the data delay of 1 is visible for selectedMeds; newMeds is direct
      })
      .catch((err) => console.log(err.response.data.errMsg))
    console.log("context line 93:", selectedMeds)
  }

  //this prevents the each keystroke of every keyword in the search
  useDebounce(searchQuery, 750, searchMedName)
  useDebounce(rxcuiQuery, 750, searchCrossInteraction)

  //trial useraxios user token route
  const addMedListLocalStorage = (newMeds) => {
    if (initState.token) {
      userAxios
        .post("/api/rxlist", newMeds)
        .then((res) => {
          console.log("addMedListLocalStorage function :", res.data)
          // const myMedList = [...selectedMeds, newMeds]
          setSelectedMeds((prevState) => {
            return [...prevState, newMeds]
          })
        })
        .catch((err) => console.log(err.response.data.errMsg))
    } else {
      const newSelected = [...selectedMeds, newMeds]
      localStorage.setItem("selectedMeds", JSON.stringify(newSelected))
      setSelectedMeds(newSelected)
    }
  }

  //trial getmedlist from localStorage
  const getMedList = () => {
    //    localStorage.getItem("selectedMeds")
    if (initState.token) {
      userAxios
        .get("api/rxlist/user")
        .then((res) => {
          setSelectedMeds(res.data)
        })
        .catch((err) => console.log(err.response.data.errMsg))
    } else {
      JSON.parse(localStorage.getItem("selectedMeds"))
    }
  }

  const deleteMedList = (medId, rxcui) => {
    if (initState.token) {
      userAxios
        .delete(`/api/rxlist/${medId}`)
        .then((res) => {
          console.log(medId)
          console.log(selectedMeds.filter((med) => med._id !== medId))
          setSelectedMeds((prevState) =>
            prevState.filter((med) => med._id !== medId)
          )
        })
        .catch((err) => console.log(err.response.data.errMsg))
    } else {
      const deletedList = [
        selectedMeds.filter((rxcui) => rxcui.rxcui !== rxcui.rxcui),
      ]
      localStorage.removeItem("selectedMeds", JSON.stringify(deletedList))
      setSelectedMeds(deletedList)
    }
  }

  const getUserNotes = () => {
    userAxios
      .get("/api/notes/user")
      .then((res) =>
        setUserState((prevState) => ({
          ...prevState,
          notes: res.data,
        }))
      )
      .catch((err) => console.log(err.response.data.errMsg))
  }

  const addNote = (newNote) => {
    userAxios
      .post("api/notes", newNote)
      .then((res) => {
        setUserState((prevState) => ({
          ...prevState,
          notes: [...prevState.notes, res.data],
        }))
      })
      .catch((err) => console.log(err.response.data.errMsg))
  }

  const deleteNote = (noteId) => {
    userAxios
      .delete(`/api/notes/${noteId}`)
      .then((res) => {
        console.log(noteId)
        return setUserState((prevState) => ({
          ...prevState,
          notes: [
            ...prevState.notes.filter((note) => {
              console.log("remaining issue: ", note._id)
              return note._id !== noteId
            }),
          ],
        }))
      })
      .catch((err) => console.log(err.response.data.errMsg))
  }

  useEffect(() => {
    JSON.parse(localStorage.getItem("selectedMeds"))
  }, [selectedMeds])
  console.log(selectedMeds.map((el) => el.rxcui))

  return (
    <DrugContext.Provider
      value={{
        setSearchQuery,
        searchQuery,
        setRxcuiQuery,
        rxcuiQuery,
        noMedNames,
        setNoMedNames,
        medNames,
        setMedNames,
        setSelectedMeds,
        selectedMeds,
        isLoading,
        setLoading,
        addMedList,
        getMedList,
        setInteractions,
        interactions,
        deleteMedList,
        searchCrossInteraction,
        noRxcuis,
        setNoRxcuis,
        addMedListLocalStorage,
        ...userState,
        signup,
        login,
        logout,
        addNote,
        getUserNotes,
        resetAuthErr,
        deleteNote,
        userAxios,
      }}
    >
      {props.children}
    </DrugContext.Provider>
  )
}

export default DrugProvider
