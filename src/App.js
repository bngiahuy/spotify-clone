import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET_ID;
console.log(clientId);
function App() {
  const [searchInput, setSearchInput] = useState("");
  const [token, setToken] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    // Get access token
    var autherization = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", autherization)
      .then((result) => result.json())
      .then((data) => setToken(data.access_token));
  }, []);

  // Search
  async function search() {
    // console.log("Search for " + searchInput);
    // GET Artist ID
    const endpointSearch = "https://api.spotify.com/v1/search";
    const artistParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    var artistId = await fetch(
      endpointSearch + "?q=" + searchInput + "&type=artist",
      artistParameters
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id; // get this by copy propreties path of return data
      });
    console.log(artistId);

    // GET top tracks from that Artist ID in Vietnam
    const endpointSearchArtist =
      "https://api.spotify.com/v1/artists/" +
      artistId +
      "/top-tracks?market=VN";
    const songsParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    var returnedtopTracks = await fetch(endpointSearchArtist, songsParameters)
      .then((result) => result.json())
      .then((data) => {
        console.log(data.tracks);
        setTopTracks(data.tracks); // get this by copy propreties path of return data
      });
  }
  const handleEmptyInput = () => alert("Input something! :<");
  return (
    <div className="App">
      {/* Title */}
      <Container className="m-3 text-center">
        <h2>Search Top Tracks using Spotify API</h2>
      </Container>

      {/* Search bar */}
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for artist"
            type="input"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={searchInput !== "" ? search : handleEmptyInput}>
            Search
          </Button>
        </InputGroup>
      </Container>

      {/* Content */}
      <Container>
        <Row className="mx-2 row row-cols-4">
          {topTracks.map((song, i) => {
            return (
              <Card>
                <Card.Img src={song.album.images[0].url}></Card.Img>
                <Card.Body>
                  <Card.Title>
                    <a
                      href={song.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {song.name}
                    </a>
                  </Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
