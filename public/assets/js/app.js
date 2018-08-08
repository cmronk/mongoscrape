// grab articles and display info in a card... try handlebars later
$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    console.log("link" + data[i].link);
      $("#title").append("<h3>" + data[i].title + "</h3>");
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + "<br />" + data[i].summary + "<br />" + "<a href=" + data[i].link + ">link<a>" + "<br />" + "<img src=" + data[i].img + ">" + "</p>");
      $("#articles").append("<button>Save Article</button>" + "<button>Delete Article</button>" + "<button id='note'>Leave Comment</button>")
      var numScraped = data.length;

      $("#numScraped").text(numScraped);
      console.log(numScraped);

      var newCardDiv = $("<div>");
      newCardDiv.addClass("card");
      newCardDiv.attr("id", data[i]._id);

      var cardTitle = $("<div>");
      cardTitle.addClass("card-title");

      var cardBody = $("<div>");
      cardBody.addClass("card-body");

      var title = $("<h3>");
      title.text(data[i].title);

      var img = $("<img src=" + data[i].img + ">");

      var link = $("<a>");
      link.addClass("card-body");
      link.attr("href", data[i].link);
      link.attr("target", "_blank");

      var body = $("<p>");
      body.text(data[i].summary + "..");

      var button = $("<div>");
      button.addClass("button save-article");
      button.text("Save Article");

      var button1 = $("<div>");
      button1.addClass("button delete-article");
      button1.text("Delete");
      
      var button2 = $("<div>");
      button2.addClass("button comment-article");
      button2.text("Leave Comment");

      link.append(body);
      cardTitle.append(title);
      cardBody.append(img);
      cardBody.append(link);
      cardBody.append(button);
      cardBody.append(button1);
      cardBody.append(button2);
      newCardDiv.append(cardTitle);
      newCardDiv.append(cardBody);
      $("#cardContainer").append(newCardDiv);
    };
});

  // ajax call for article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  .then(function(data) {
    console.log(data);
    // toggle modal?
  })


//   TODO
//   modals for buttons :(
// routing for delete & comment
// notes 
// styling


