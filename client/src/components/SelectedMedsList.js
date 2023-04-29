import React, { useContext } from "react"
import { DrugContext } from "../context/DrugProvider"

function SelectedMedsList() {
  const { selectedMeds, deleteMedList } = useContext(DrugContext)

  const uniqueRxcui = []
  const uniqueSelectedMeds = selectedMeds.filter((med) => {
    const isDuplicate = uniqueRxcui.includes(med.rxcui)

    if (!isDuplicate) {
      uniqueRxcui.push(med.rxcui)
      return true
    }
    return false
  })
  console.log("unique selection: ", uniqueSelectedMeds)

  return (
    <>
      {uniqueSelectedMeds.length >= 1 ? (
        <div className='selectedmeds-container'>
          <div className='selectedmedslist-header'>
            {uniqueSelectedMeds.length > 0 && (
              <>
                <h1>Selected Meds List </h1>
                <p>(highlight and click to remove item)</p>
              </>
            )}
          </div>
          {uniqueSelectedMeds.map((med) => {
            return (
              <div className='selectedmeds-layout' key={med.rxcui}>
                <h3
                  className='selectedmeds-item'
                  onClick={() => deleteMedList(med._id)}
                >
                  Name: {med.name} Rxcui: {med.rxcui}
                </h3>
              </div>
            )
          })}
        </div>
      ) : null}
    </>
  )
}

export default SelectedMedsList
