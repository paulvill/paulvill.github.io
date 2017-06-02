window.addEventListener("DOMContentLoaded", function() {
  // as soon as the HTML is ready...

  console.log(datasets)

  makedivs()
})


function makedivs() {

  var saranwrap = document.querySelector(".data-gallery-wrapper")

  _(datasets).each((d, i) => {
    var tinfoil = make("div", "dataset-tile", "dataset_" + i)
    var preview = make("div", "preview")
    preview.style.backgroundImage = "url(" + d.preview + ")"

    var title = make("h1")
    title.innerHTML = d.name

    var dl = make("dl")

    var keys = ["developmental period", "dimensions", "microscope"]

    _(keys).each((key_name) => {
      var dt = make("dt")
      dt.innerHTML = key_name

      _.each(_.get(d, key_name), (value_of_key) => {
        var dd = make("dd")
        dd.innerHTML = value_of_key
        dt.append(dd)
      })

      dl.append(dt)
    })



    tinfoil.append(preview)
    tinfoil.append(title)
    tinfoil.append(dl)

    saranwrap.append(tinfoil)

  })

}


function make(what, a_class, an_id) {
  var thing = document.createElement(what)
  if (a_class) thing.classList.add(a_class)
  if (an_id) thing.id = an_id

  return thing
}
