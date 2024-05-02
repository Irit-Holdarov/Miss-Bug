async function onGetCars() {
    const elPre = document.querySelector('pre')
    const res = await fetch('api/bug')
    const bugs = await res.json()

    elPre.innerText = JSON.stringify(bugs, null, 2)
}