require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
app.get("/", (req, res, next) => {
  res.render("index");
  console.log("We are on!");
});

app.get("/artist-search", (req, res, next) => {
  console.log("Gotcha!");
  spotifyApi
    .searchArtists(req.query.name)
    .then((data) => {
      const artistData = data.body.artists.items;
      console.log("The received data from the API: ", artistData);
      res.render("artist-search-results", { artistData });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then((data) => {
    const artistAlbums = data.body.items;
    console.log(artistAlbums);
    res.render("albums", { artistAlbums });
  });
});

app.get("/previews/:albumId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then((data) => {
    const albumsIds = data.body.items;
    console.log(albumsIds.name);
    res.render("previews", { albumsIds });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
