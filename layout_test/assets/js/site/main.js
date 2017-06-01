var ellipsis, count = 0

window.addEventListener("DOMContentLoaded", function() {
  ellipsis = document.querySelector("#dots")
  window.setInterval(dots, 300)
})

function dots() {
  var s = []
  _(count%5).times((i) => {
    s.push(".")
  })
  var t = _(s).join("")
  ellipsis.innerHTML = t
  if (count < 1000) count++
  else count = 0
}
