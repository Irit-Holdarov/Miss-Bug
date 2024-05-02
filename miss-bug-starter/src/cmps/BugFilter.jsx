import { useEffect, useState } from "react"

export function BugFilter({ filterBy, onSetFilterBy }) {

  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    onSetFilterBy(filterByToEdit)
  }, [filterByToEdit])


  function handleChange({ target }) {
    const field = target.name
    let type = target.type
    let value = target.value
  
    if (type === 'number') {
      value = +value || ''
    }
  
    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }
  

  const { txt, severity } = filterByToEdit

  return (
    <section>
      <h2>Filter Our Bugs</h2>

        <label htmlFor="txt">Title: </label>
        <input value={txt} onChange={handleChange} type="text" placeholder="By title" id="txt" name="txt" />

        <label htmlFor="severity">Severity: </label>
        <input value={severity} onChange={handleChange} type="number" placeholder="By severity" id="severity" name="severity" />

    </section>
  )
}