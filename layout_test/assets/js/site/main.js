var ellipsis, count = 1, dir = 1

window.addEventListener("DOMContentLoaded", function() {
  ellipsis = document.querySelector("#dots")
  // console.log(ellipsis)
  if (ellipsis) window.setInterval(dots, 100)
})

// v  loading demo dot animation  v

function dots() {
  if (count == 5 || count == 0) dir *= -1
  count += dir
  console.log(count, dir)

  var s = []
  _(count).times((i) => {
    s.push(".")
  })
  var t = _(s).join("")
  ellipsis.innerHTML = t
}
