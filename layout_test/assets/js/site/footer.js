var app = app || {}

app.footer = {
  $el: $("footer"),
  init: function() {
    var ft = app.footer
    ft.$el.find(".titlebar").click(footer_hs)
    console.log( ft.$el.find(".titlebar"))

    $.ajax({
      url: "assets/js/site/dataset_list.json",
      dataType: "json",
      timeout: 0,
      success: (returned_data) => {
        app.dataset_list = returned_data

        // start off by rendering the default scene
        app.initializeScene();
        app.animateScene();

        makedivs(returned_data, (wrapper) => {
          // callback for when the tiles are all appended


          _.each($(wrapper).children(), (tile) => {
            tile.addEventListener("click", () => {

              var corresponding_dataset = app.dataset_list[tile.dataset.id]

              ft.$el.find(".dataset-name").text(corresponding_dataset.name)


              app.i = tile.dataset.id;
              // Initialize the scene
              app.initializeScene();

              // Animate the scene
              app.animateScene();

              ft.$el.toggleClass("expanded")
            })
          })
        })
      },
      error: (xhr, text, err) => {
        console.log(err)
      }
    })
  }

}

document.addEventListener("DOMContentLoaded", app.footer.init)


// $(tile).click(function() {
//   var x = ...


//   viewport.initialize(x);


// })


function footer_hs() {
  console.log(this)
  $(this).parents("footer").toggleClass("expanded")
}


function makedivs(data_objects, callback) {

  var saranwrap = document.querySelector(".data-gallery-wrapper")

  _(data_objects).each((d, i) => {
    var ziploc = make("div", "dataset-tile", "dataset_" + i)
    var preview = make("div", "preview")
    var tinfoil = make("div", "description")

    ziploc.dataset.id = i
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

    tinfoil.append(title)
    tinfoil.append(dl)

    ziploc.append(preview)
    ziploc.append(tinfoil)

    saranwrap.append(ziploc)
  })
  callback(saranwrap)

}


function make(what, a_class, an_id) {
  var thing = document.createElement(what)
  if (a_class) thing.classList.add(a_class)
  if (an_id) thing.id = an_id


  return thing
}
