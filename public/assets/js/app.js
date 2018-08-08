
// articles
$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
      $("#title").append("<h3>" + data[i].title + "</h3>");
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + "<br />" + data[i].summary + "<br />" + "<a href=" + data[i].link + ">link<a>" + "<br />" + "<img src=" + data[i].img + ">" + "</p>");
      $("#articles").append("<button>Save Article</button>" + "<button>Delete Article</button>" + "<button id='note'>Leave Comment</button>")
      var numScraped = data.length;

      $("#numScraped").text(numScraped);
      console.log(numScraped);
    };
});
