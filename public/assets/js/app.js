// grab articles and display info in a card... try handlebars later
$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    var totalArticles = data.length;
    $("#numScraped").text(totalArticles);
    scrapeNum = $("#numScraped").val();

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
    button.text("Save ");
    button.attr("id", data[i]._id);

    // var button1 = $("<div>");
    // button1.addClass("button delete-article");
    // button1.text("Delete");
    // button1.attr("id", data[i]._id);

    // var button2 = $("<div>");
    // button2.addClass("button comment-article");
    // button2.html("<div id='noteBtn'data-open='insertNote'>Comment</div>");
    // button2.attr("id", data[i]._id);

    link.append(body);
    cardTitle.append(title);
    cardBody.append(img);
    cardBody.append(link);
    cardBody.append(button);
    // cardBody.append(button1);
    // cardBody.append(button2);
    newCardDiv.append(cardTitle);
    newCardDiv.append(cardBody);
    $("#cardContainer").append(newCardDiv);
  };
});

// saved
$.getJSON("/savedarticles", function (data) {
  for (var i = 0; i < data.length; i++) {
    var totalArticles = data.length;
    $("#numScraped").text(totalArticles);
    scrapeNum = $("#numScraped").val();

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

    // var button = $("<div>");
    // button.addClass("button save-article");
    // button.text("Save ");
    // button.attr("id", data[i]._id);

    var button1 = $("<div>");
    button1.addClass("button delete-article");
    button1.text("Delete");
    button1.attr("id", data[i]._id);

    var button2 = $("<div>");
    button2.addClass("button comment-article");
    button2.html("<div id='noteBtn'data-open='insertNote'>Comment</div>");
    button2.attr("id", data[i]._id);

    link.append(body);
    cardTitle.append(title);
    cardBody.append(img);
    cardBody.append(link);
    // cardBody.append(button);
    cardBody.append(button1);
    cardBody.append(button2);
    newCardDiv.append(cardTitle);
    newCardDiv.append(cardBody);
    $("#savedarticles").append(newCardDiv);
  };
});

// clicking on add comment
$(document).on("click", ".comment-article", function () {
  // Empty notes
  $("#notes").empty();
  // Save the id
  var thisId = $(this).attr("id");
  console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      // The title of the article
      $("#noteModal").text(data.title);
      // An input to enter a new title
      $("#noteModal").append("<label>Comment Title</label><input type='text' id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#noteModal").append("<label>Add Comment Below</label><input type='text' id='bodyinput' name='body'>");
      // A button to submit a new note, with the id of the article saved to it
      $("#noteModal").append("<button data-id='" + data._id + "' id='savenote'type='button' data-close>Save Note</button></p>");
      // If there's a comment in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// to save comments
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// saved articles
$(document).on("click", ".save-article", function () {
  // Save the id
  var thisId = $(this).attr("id");
  console.log(thisId);
  console.log
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId,
    data: {

    }
  })
    .done(function (data) {
      location.reload();
    });
});

//Click to view saved article
$(document).on("click", "#savedArts", function () {
  $.get("/saved", function (req, res) {
    console.log(res);
  }).then(function (data) {
    window.location.href = "/saved";
  }).catch(function (err) {
    res.json(err);
  });

});

// delete articles
$(document).on("click", ".delete-article", function () {
  // Save the id
  var thisId = $(this).attr("id");
  console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/articles/delete/" + thisId,
    data: {
    }
  }).done(function (data) {
    console.log(data)
    location.reload();
  });
});


// foundation modal calls
$(scrapeNew).foundation();
$(insertNote).foundation();