import React, { useContext } from "react"
import { DrugContext } from "../context/DrugProvider.js"
import { NavLink } from "react-router-dom"

function XInteractions() {
  const { interactions, selectedMeds } = useContext(DrugContext)

  return (
    <>
      {selectedMeds.length < 2 ? (
        <div className='interactions-container'>
          <h2>Select two or more meds</h2>
        </div>
      ) : interactions.length < 1 ? (
        <div className='interactions-container'>
          <h2>There is no interaction between the selected meds</h2>
        </div>
      ) : (
        <div className='interactions-container'>
          <h2>
            Interaction Description: {interactions}
            <span>
              <p>
                No account? <NavLink to='/login'>Save to profile</NavLink>
              </p>
            </span>
          </h2>
        </div>
      )}
    </>
  )
}

export default XInteractions
