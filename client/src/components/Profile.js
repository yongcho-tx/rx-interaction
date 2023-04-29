import { DrugContext } from "../context/DrugProvider.js"
import SelectedMedsList from "./SelectedMedsList.js"
import React, { useState, useEffect, useRef, useContext } from "react"
import styled, { keyframes } from "styled-components"
import { IoSearch, IoClose } from "react-icons/io5"
import { motion, AnimatePresence } from "framer-motion"
import { useClickOutside } from "react-click-outside-hook"
import MoonLoader from "react-spinners/MoonLoader"
import XInteractions from "./XInteractions.js"
import Notesform from "./NotesForm.js"
import NoteList from "./NoteList.js"

export default function Profile(props) {
  const {
    rxcuiQuery,
    setRxcuiQuery,
    noRxcuis,
    setNoRxcuis,
    setInteractions,
    interactions,
    getMedList,
    selectedMeds,
    isLoading,
    setLoading,
  } = useContext(DrugContext)
  const {
    user: { username },
    addNote,
    notes,
  } = useContext(DrugContext)

  const isEmpty = !interactions || interactions.length === 0
  const [parentRef, isClickedOutside] = useClickOutside()
  const [isExpanded, setExpanded] = useState(false)
  const inputRef = useRef()

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.value.trim() === "") noRxcuis(false)
    setRxcuiQuery(e.target.value)
  }

  const expandContainer = () => {
    setExpanded(true)
  }

  const collapseContainer = () => {
    setExpanded(false)
    setRxcuiQuery("")
    setInteractions([])
    setNoRxcuis(false)
    if (inputRef.current) inputRef.current.value = ""
    setLoading(false)
  }

  const insertRxcui = () => {
    inputRef.current.value = selectedMeds.map((med) => med.rxcui).join("+")
    setRxcuiQuery(inputRef.current.value)
  }

  useEffect(() => {
    if (isClickedOutside) collapseContainer()
  }, [isClickedOutside])

  useEffect(() => {
    console.log("useeffect ran")
    getMedList()
  }, [])

  return (
    <div>
      <h1 className='welcome-header'>Welcome @{username}!</h1>
      <SearchBarContainer
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        transition={containerTransistion}
        ref={parentRef}
      >
        <SearchInputContainer>
          <SearchIcon>
            <IoSearch />
          </SearchIcon>
          <SearchInput
            placeholder='Type Rxcui to Check Drug-Drug Interactions'
            onFocus={expandContainer}
            ref={inputRef}
            value={rxcuiQuery}
            onChange={handleChange}
          />
          <AnimatePresence>
            {isExpanded && (
              <CloseIcon
                key='close-icon'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={collapseContainer}
              >
                <IoClose />
              </CloseIcon>
            )}
          </AnimatePresence>
        </SearchInputContainer>
        {isExpanded && <LineSeparator />}
        {isExpanded && (
          <SearchContent>
            {isLoading && (
              <LoadingWrapper>
                <MoonLoader loading color='#000' size={70} />
              </LoadingWrapper>
            )}
            {!isLoading && isEmpty && !noRxcuis && (
              <LoadingWrapper>
                <WarningMessage>
                  Type or paste in Rxcuis to check cross interactions
                </WarningMessage>
              </LoadingWrapper>
            )}
            {!isLoading && noRxcuis && (
              <LoadingWrapper>
                <WarningMessage>No cross interactions found!</WarningMessage>
              </LoadingWrapper>
            )}
            {!isLoading && !isEmpty && (
              <>
                <XInteractions />
              </>
            )}
          </SearchContent>
        )}
      </SearchBarContainer>
      <div>
        <SelectedMedsList />
        <div className='check-interaction'>
          <br />
          <h2>
            Check X-Interaction:{" "}
            <span>
              <button onClick={insertRxcui}>Check</button>
            </span>
          </h2>
          <br />
        </div>
        <div className='my-interaction-list'>
          {interactions.length > 0 ? (
            <h2>My Interaction List: {interactions}</h2>
          ) : (
            <h2>
              You do not have any drug-drug interaction based on your medication
              list
            </h2>
          )}
        </div>
        <div className='user-notes-container'>
          <Notesform addNote={addNote} />
          <h2 className='notes-header'>Your Notes</h2>
          <NoteList notes={notes} />
        </div>
      </div>
    </div>
  )
}

const SearchBarContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  max-width: 720px;
  height: 3.8em
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.14);
  overflow-y: auto;
  margin-bottom: 2em;
  @media (max-width: 640px) {
    width: auto;
    margin: 2em;
  }
`
const SearchInputContainer = styled.div`
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px 15px;
`
const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 21px;
  color: #12112e;
  border-radius: 6px;
  background-color: transparent;

  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }

  &::placeholder {
    color: #bebebe;
    transition: all 250ms ease-in-out;
  }
`
const SearchIcon = styled.span`
  color: #bebebe;
  font-size: 27px;
  margin-right: 10px;
  margin-top: 6px;
  vertical-align: middle;
`
const CloseIcon = styled(motion.span)`
  color: #bebebe;
  font-size: 23px;
  margin-right: 30px;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    color: #dfdfdf;
  }
`
const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  overflow-y: auto;
`
const LineSeparator = styled.span`
  display: flex;
  min-width: 100%;
  min-height: 2px;
  background-color: #d8d8d878;
`

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const WarningMessage = styled.span`
    color: #a1a1a1;
    font-size: 14px;
    display: flex;
    align-self; center;
    justify-self: center;
`
const containerVariants = {
  expanded: {
    height: "30em",
  },
  collapsed: {
    height: "3.8em",
  },
}

const containerTransistion = {
  type: "spring",
  damping: 22,
  stiffness: 150,
}
