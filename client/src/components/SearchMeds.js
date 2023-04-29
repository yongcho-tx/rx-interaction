import React, { useState, useEffect, useRef, useContext } from "react"
import styled, { keyframes } from "styled-components"
import { IoSearch, IoClose } from "react-icons/io5"
import { motion, AnimatePresence } from "framer-motion"
import { useClickOutside } from "react-click-outside-hook"
import MoonLoader from "react-spinners/MoonLoader"
import MedName from "./MedName"
import SelectedMedsList from "./SelectedMedsList"
import { DrugContext } from "../context/DrugProvider"
import XInteractions from "./XInteractions"

function SearchMeds(props) {
  const {
    searchQuery,
    interactions,
    setRxcuiQuery,
    getMedList,
    setSearchQuery,
    selectedMeds,
    noMedNames,
    setNoMedNames,
    medNames,
    setMedNames,
    isLoading,
    setLoading,
    addMedListLocalStorage,
    errMsg,
    deleteMedList,
  } = useContext(DrugContext)

  const isEmpty = !medNames || medNames.length === 0
  const [parentRef, isClickedOutside] = useClickOutside()
  const [isExpanded, setExpanded] = useState(false)
  const inputRef = useRef()
  const { _id, logout } = props

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.value.trim() === "") setNoMedNames(false)
    setSearchQuery(e.target.value)
  }
  const expandContainer = () => {
    setExpanded(true)
  }

  const collapseContainer = () => {
    setExpanded(false)
    setSearchQuery("")
    setMedNames([])
    setNoMedNames(false)
    if (inputRef.current) inputRef.current.value = ""
    setLoading(false)
  }

  const searchSideEffects = () => {
    setRxcuiQuery(selectedMeds.map((med) => med.rxcui).join("+"))
  }

  useEffect(() => {
    if (isClickedOutside) collapseContainer()
    getMedList()
  }, [isClickedOutside, logout])

  useEffect(() => {
    searchSideEffects()
    console.log("useefect ran")
  }, [selectedMeds, interactions])

  return (
    <div>
      <SearchBarContainer
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        transition={containerTransistion}
        ref={parentRef}
      >
        <SearchInputContainer className='search-input-container'>
          <SearchIcon>
            <IoSearch />
          </SearchIcon>
          <SearchInput
            placeholder='Search Input'
            onFocus={expandContainer}
            ref={inputRef}
            value={searchQuery}
            onChange={handleChange}
            className='search-input'
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
                <MoonLoader loading color='#000' size={20} />
              </LoadingWrapper>
            )}
            {!isLoading && isEmpty && !noMedNames && (
              <LoadingWrapper>
                <WarningMessage>Start typing to search for meds</WarningMessage>
              </LoadingWrapper>
            )}
            {!isLoading && noMedNames && (
              <LoadingWrapper>
                <WarningMessage>No med name found by that name!</WarningMessage>
              </LoadingWrapper>
            )}
            {!isLoading && !isEmpty && (
              <>
                {medNames.map((medName) => (
                  <MedName
                    name={medName.name}
                    rxcui={medName.rxcui}
                    tty={medName.tty}
                    key={medName.rxcui}
                    handleAddMedList={addMedListLocalStorage}
                  />
                ))}
              </>
            )}
          </SearchContent>
        )}
      </SearchBarContainer>
      <>
        <SelectedMedsList id={_id} errMsg={errMsg} />
        <XInteractions />
      </>
    </div>
  )
}

export default SearchMeds

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
 @media (min-width: 768px) {
  width: 720px;
 }
`
const SearchInputContainer = styled.div`
  max-width: 720px;
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
