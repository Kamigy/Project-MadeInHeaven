import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Table, Button } from 'semantic-ui-react'
import './Filmport.css';  // importez votre fichier CSS ici

const GENRE_MAP = {
  "Biography": 1,
"Film Noir": 2,
"Game Show": 3,
"Musical": 4,
"Sport": 5,
"Short": 6,
"Adult": 7,
"Adventure": 12,
"Fantasy": 14,
"Animation": 16,
"Drama": 18,
"Horror": 27,
"Action": 28,
"Comedy": 35,
"History": 36,
"Western": 37,
"Thriller": 53,
"Crime": 80,
"Documentary": 99,
"Science Fiction": 878,
"Mystery": 9648,
"Music": 10402,
"Romance": 10749,
"Family": 10751,
"War": 10752,
"News": 10763,
"Reality": 10764,
"Talk Show": 10767,
  // ajoutez d'autres genres ici
};

export default function Filmport() {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f8a48c6a6dmshd37f4a75bd82332p1188c9jsn2ebc1d4c172c',
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
  };
  
  const [film,setfilm] = useState([]);
  const [searchText,setsearchText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState();

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);  // Déplacez cette ligne ici
  
    if (genre === "") {
      loadAllFilms();
    } else {
      loadPlaylistByGenre(GENRE_MAP[genre]);
    }
  }
  
  
  
  async function loadAllFilms() {
    const response = await fetch(`https://streaming-availability.p.rapidapi.com/v2/search/title?title=Spider-man&country=us&show_type=movie`, options);
    const result = await response.json();
    setfilm(result.result);
  }

  async function loadPlaylist(playlist) {
    const response = await fetch(`https://streaming-availability.p.rapidapi.com/v2/search/title?title=${playlist}&country=us&show_type=movie`, options);
    const result = await response.json();
    setfilm(result.result);
  }

  async function loadPlaylistByGenre(genreId) {
    const response = await fetch(`https://streaming-availability.p.rapidapi.com/v2/search/basic?country=us&services=netflix%2Cprime.buy%2Chulu.addon.hbo%2Cpeacock.free&show_type=movie&genre=${genreId}`, options);
    const result = await response.json();
    setfilm(result.result);
  }

  useEffect(()=> {
    loadPlaylist('Spider-man')
  },[])
  console.log(Object.keys(GENRE_MAP))
  return (
    <>
      <br></br>
      <br></br>
      <br></br>
      <Input id="search" type="text" class="input" placeholder="search..." value={searchText} onChange={event=>setsearchText(event.target.value)} />
      <Button onClick={()=>loadPlaylist(searchText)} >Search</Button>
      <select value={selectedGenre} onChange={handleGenreChange}>
        <option value="">Select Genre</option>
        {Object.keys(GENRE_MAP).map((genre, index) => (
          <option key={index} value={genre}>{genre}</option>
        ))}
      </select>
      <Table celled inverted selectable id="myTable" className="dark-div">
        <Table.Header>
          <Table.Row>
            <th>Film</th>
            <th>Director</th>
            <th>Cover Art</th>
          </Table.Row>
        </Table.Header>
        <Table.Body className="dark-div">
            {film.sort((a, b) => b.imdbRating - a.imdbRating).map(f => (
            <Table.Row key={f.imdbId} >
              <Table.Cell>
                <Link to={`/filmdetail/${f.imdbId}`}>{f.title}</Link>
              </Table.Cell>
              <Table.Cell>{f.directors[0]}</Table.Cell>
              <Table.Cell>
                <img src={f.posterURLs[185]} style={{ width: '200px' }}/>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
