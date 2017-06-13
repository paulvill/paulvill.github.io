var app = app || {}

app.load = {
  count: 1,
  dir: 1,
  dots: function() {
    //   loading demo dot animation
    if (app.load.count == 5 || app.load.count == 0) app.load.dir *= -1
    app.load.count += app.load.dir
    console.log(app.load.count, app.load.dir)

    var s = []
    _(app.load.count).times((i) => {
      s.push(".")
    })
    var t = _(s).join("")
    ellipsis.innerHTML = t
  }
}

window.addEventListener("DOMContentLoaded", function() {
  // app.load.ellipsis = document.querySelector("#dots")
  // console.log(ellipsis)
  // if (app.load.ellipsis) window.setInterval(app.load.dots, 100)
})
