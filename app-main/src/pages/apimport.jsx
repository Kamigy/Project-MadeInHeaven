import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Input, Table, Button } from 'semantic-ui-react'
import TableExamplePagination from "./admin";



export default function Apimport() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'bf1139e579msh792969bd579ef9ap1d1fb4jsn9b449b77b700',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };
    const [music,setmusic] = useState([])
    const [searchText,setsearchText] = useState('')
    //useEffect(()=>{
    async function loadPlaylist (playlist)
    {
        const response = await fetch(`https://spotify23.p.rapidapi.com/search/?q=%3C${playlist}%3E&type=multi&offset=0&limit=15&numberOfTopResults=5`, options)
	    const data= await response.json()
        setmusic(data.tracks.items)
        console.log(data.tracks.items)
    }
    useEffect(()=> {
        loadPlaylist('Lil')
    },[])
    //loadPlaylist()
    //},[])
        return (
           <>
        <Table celled inverted selectable id="myTable" className="dark-div">
        <Table.Header>
        <Input id="search" type="text" class="input" placeholder="search..." value={searchText} onChange={event=>setsearchText(event.target.value)} />
        <Button onClick={()=>loadPlaylist(searchText)} >Search</Button>
        <Table.Row>
                <th>Tracks</th>
                <th>Artists</th>
                <th>Cover Art</th>
            </Table.Row>
        </Table.Header>
        <Table.Body className="dark-div">
            {music.map(m=>(
            <Table.Row key={m.data.uri} >
            <Table.Cell>
                <Link to={`/albumdetail/${m.data.uri.split(':').pop()}`}>{m.data.name}</Link>
            </Table.Cell>
            <Table.Cell>{m.data.artists.items[0].profile.name}</Table.Cell>
            <img src={m.data.albumOfTrack.coverArt.sources[0].url}></img>
        </Table.Row>
            ))
            }
        </Table.Body>
      </Table></> )
}
