import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { BugFilter } from '../cmps/BugFilter.jsx'


export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

  useEffect(() => {
    loadBugs()
  }, [filterBy])

  async function loadBugs() {
    const bugs = await bugService.query(filterBy)
    setBugs(bugs)
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Succesfully!')
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
    const title = prompt('Bug title?')
    const severity = +prompt('Bug severity?')
    const description = prompt('Bug description?')
    const labelsInput = prompt('Enter up to 3 labels (comma-separated):')
  
    const labels = labelsInput.split(',').map(label => label.trim()).filter(label => label !== '').slice(0, 3)
  
    const bug = {
      title,
      severity,
      description,
      labels
    }
    try {
      const savedBug = await bugService.save(bug)
      console.log('Added Bug', savedBug)
      setBugs(prevBugs => [...prevBugs, savedBug])
      showSuccessMsg('Bug added')
    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    const title = prompt('New title?') || bug.title
    const severity = +prompt('New severity?') || bug.severity
    const description = prompt('New description?') || bug.description
    const bugToSave = { ...bug, severity, description, title }
    try {

      const savedBug = await bugService.save(bugToSave)
      console.log('Updated Bug:', savedBug)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }


  return (
    <main className="bug-index">
      <h3>Bugs App</h3>
      <main>
        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        <button className='add-btn' onClick={onAddBug}>Add Bug ⛐</button>
      </main>
    </main>
  )
}
