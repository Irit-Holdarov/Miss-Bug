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


  const { txt, severity, label } = filterByToEdit

  return (
    <section className="bug-filter">
      <h2>Filter Our Bugs</h2>

      <div className="filters">
        <label htmlFor="txt">Title: </label>
        <input value={txt} onChange={handleChange} type="text" placeholder="By title" id="txt" name="txt" />

        <label htmlFor="severity">Severity: </label>
        <input value={severity} onChange={handleChange} type="number" placeholder="By severity" id="severity" name="severity" />

        <label htmlFor="label">Label: </label>
        <select value={label} onChange={handleChange} id="label" name="label">
          <option value="">Choose a label</option>
          <option value="critical">critical</option>
          <option value="need-CR">need-CR</option>
          <option value="backend-error">backend-error</option>
          <option value="data-loss">data-loss</option>
          <option value="loading-time">loading-time</option>
          <option value="user-input">user-input</option>
          <option value="delete-operation">delete-operation</option>
        </select>
      </div>

    </section>
  )
}