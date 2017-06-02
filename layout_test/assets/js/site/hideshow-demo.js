var buttons // empty variable to hold element references

window.addEventListener("DOMContentLoaded", function() {
  // as soon as the HTML is ready...

  buttons = document.querySelectorAll(".switcher button") //get references to all the buttons

  _(buttons).each(el => { // for each one,
    el.addEventListener("click", revealviewport) // add an event listener to a click event
  })
})

function revealviewport(e) {
  var viewports = document.querySelectorAll(".viewport") //get references to all the viewports

  console.log("this button's value is", e.target.value)

  var selected = _(viewports) // find the one that matches this button's value
      .filter(v => v.id === "v" + e.target.value)
      .first()

  var others = _(viewports) // and then get all the others
      .filter(v => v.id !== "v" + e.target.value)

  if (selected.classList.contains("hidden")) selected.classList.remove("hidden") // show the one we want

  _(others).each(o => {
    if (!o.classList.contains("hidden")) o.classList.add("hidden") // hide the ones we don't
  })

  initializeViewport(selected) // call the initializer function for that viewport

}


function initializeViewport(which) {

  var title = which.querySelector("h1") // find the h1 tag
  var body = which.querySelector("p") // find the p tag

  title.innerHTML = which.id + " is ready!" // change the h1 text
  body.innerHTML = "here's a new random number: " + _.random(0, 500) // change the p text

}
