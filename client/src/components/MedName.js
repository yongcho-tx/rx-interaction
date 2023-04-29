import React from "react"
import styled from "styled-components"

const MedNameContainer = styled.div`
  width: 100%;
  height: 8em;
  display: flex;
  border-bottom: 1px solid #d8d8d878;
  padding: 6px 8px;

  &:hover {
    background-color: gray;
  }
`
const TTY = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  flex: 1;
  margin: 1em;
`

const Name = styled.h3`
  font-size: 20px;
  color: #000;
  margin: 1em;
  display: flex;
  flex: 2;
  @media (max-width: 640px) {
    font-size: 14px;
  }
`
const Rxcui = styled.span`
  color: #a1a1a1;
  font-size: 16px;
  display: flex;
  flex: 1;
  margin: 1em 2.5em 1em 1em;
`
function MedName(props) {
  const { tty, name, rxcui, handleAddMedList } = props

  return (
    <div>
      <MedNameContainer onClick={() => handleAddMedList({ name, rxcui, tty })}>
        <TTY>
          {tty === "SCD"
            ? "Semantic Clinical Drug"
            : tty === "SBD"
            ? "Semantic Branded Drug"
            : "Other"}{" "}
          {tty}
        </TTY>
        <Name> {name} </Name>
        <Rxcui> {`Rxcui: ${rxcui}`} </Rxcui>
      </MedNameContainer>
    </div>
  )
}

export default MedName
