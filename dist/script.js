const WIN_COLOR = "bg-emerald-500";
const LOSE_COLOR = "bg-red-500";
let points = 0;
let winner;

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArtists(artists, n) {
  return artists.sort(() => 0.5 - Math.random()).slice(0, n);
}

async function retrieveArtists(n) {
  let response = await fetch("./artists.json");
  let artists = await response.json();
  return getRandomArtists(artists, n);
}

function win(el) {
  if (!$(el).data().clicked) {
    points += 1;
    $("#points").text(points);
    $(el).addClass(WIN_COLOR);
    if (el.id === "btn_1") {
      $("#btn_2").addClass(LOSE_COLOR);
    } else {
      $("#btn_1").addClass(LOSE_COLOR);
    }
    $("#btn_1").data().clicked = true;
    $("#btn_2").data().clicked = true;
    $("#continue_btn").show().addClass(WIN_COLOR).text("Continua");
  }
}

function lose(el) {
  if (!$(el).data().clicked) {
    $(el).addClass(LOSE_COLOR);
    if (el.id === "btn_1") {
      $("#btn_2").addClass(WIN_COLOR);
    } else {
      $("#btn_1").addClass(WIN_COLOR);
    }
    $("#btn_1").data().clicked = true;
    $("#btn_2").data().clicked = true;
    $("#continue_btn").show().addClass(LOSE_COLOR).text("Hai perso");
  }
}

function buttonClicked(el) {
  $("#album_1").text($("#btn_1").data().albums);
  $("#album_2").text($("#btn_2").data().albums);
  if (winner.id == $(el).data().id) {
    win(el);
  } else {
    lose(el);
  }
}

function prepareBoard(a1, a2) {
  $("#name_1").text(a1.name);
  $("#img_1").attr("src", a1.image);
  $("#name_2").text(a2.name);
  $("#img_2").attr("src", a2.image);
  $("#btn_1").data(a1).removeClass(WIN_COLOR).removeClass(LOSE_COLOR);
  $("#btn_2").data(a2).removeClass(WIN_COLOR).removeClass(LOSE_COLOR);
  $("#btn_1").data().clicked = false;
  $("#btn_2").data().clicked = false;
  $("#album_1").text("");
  $("#album_2").text("");
  $("#continue_btn").hide().removeClass(WIN_COLOR).removeClass(LOSE_COLOR);
}

function restartGame() {
  retrieveArtists(1)
    .then((artists) => {
      const artist1 = winner;
      const artist2 = artists[0];
      artist1.albums >= artist2.albums
        ? (winner = artist1)
        : (winner = artist2);
      $("#points").text(points);
      prepareBoard(artist1, artist2);
    })
    .catch((err) => {
      console.error(err);
    });
}

function startGame() {
  points = 0;
  retrieveArtists(2)
    .then((artists) => {
      const artist1 = artists[0];
      const artist2 = artists[1];
      artist1.albums >= artist2.albums
        ? (winner = artist1)
        : (winner = artist2);
      $("#points").text(points);
      prepareBoard(artist1, artist2);
    })
    .catch((err) => {
      console.error(err);
    });
}

startGame();

$("#btn_1").click(function () {
  buttonClicked(this);
});

$("#btn_2").click(function () {
  buttonClicked(this);
});

$("#continue_btn").click(function () {
  const string = $(this).text();
  string === "Continua" ? restartGame() : startGame();
});
