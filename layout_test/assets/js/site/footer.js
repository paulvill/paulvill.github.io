var app = app || {}

app.footer = {
  $el: $("footer"),
  init: function() {
    var ft = app.footer
    ft.$el.find(".titlebar").click(footer_hs)
    ft.$el.find(".dataset-info-button").click(dsinfo_hs)
    $(".ds-info-panel .close").click(dsinfo_hs)
    ft.$el.find(".titlebar:not(.expanded)").mouseover(footer_swell)
    ft.$el.find(".titlebar:not(.expanded)").mouseleave(footer_shrink)


    $.ajax({
      url: "assets/js/site/dataset_list.json",
      dataType: "json",
      timeout: 0,
      success: (returned_data) => {
        app.dataset_list = returned_data

        // start off by rendering the default scene
        app.initializeScene();
        app.animateScene();

        var base_dataset = app.dataset_list[0]
        ft.update_labels(base_dataset);

        makedivs(returned_data, (wrapper) => {
          // callback for when the tiles are all appended


          _.each($(wrapper).children(), (tile) => {
            tile.addEventListener("click", () => {

              var corresponding_dataset = app.dataset_list[tile.dataset.id]

              ft.update_labels(corresponding_dataset);

              app.i = tile.dataset.id;
              // Initialize the scene
              app.initializeScene();

              // Animate the scene
              app.animateScene();

              ft.$el.toggleClass("expanded")
              $(".ds-info-panel").removeClass("visible high");
            })
          })
        })
      },
      error: (xhr, text, err) => {
        console.log(err)
      }
    })
  },
  update_labels: function (data) {
    $("footer .titlebar .dataset-name").text(data.name)
    $(".ds-info-panel h1").text(data.name)
    $(".ds-info-panel .desc").text(data.description)
  }

}

document.addEventListener("DOMContentLoaded", app.footer.init)


// $(tile).click(function() {
//   var x = ...


//   viewport.initialize(x);


// })

function footer_swell(e) {
  if (!e.target.classList.contains("no-expand")) $(this).parents("footer").addClass("swollen")
  else $(this).parents("footer").removeClass("swollen")
}
function footer_shrink(e) {
  if (!e.target.classList.contains("no-expand")) $(this).parents("footer").removeClass("swollen")
}


function footer_hs(e) {
  // console.log(e.target.classList)
  if (!e.target.classList.contains("no-expand")) {
    $(this).parents("footer").toggleClass("expanded")
    $(".ds-info-panel").toggleClass("high");
  }
}

function dsinfo_hs(e) {
  console.log("dsinfo")
  $(".ds-info-panel").toggleClass("visible");
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
