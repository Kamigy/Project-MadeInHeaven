import { Button, Container, Divider,Grid,Header, Icon,Image,List,Menu,Segment,Table,Sidebar,} from 'semantic-ui-react';
import PropTypes from 'prop-types'
import {Outlet, Link} from 'react-router-dom'
import { useEffect } from 'react'
import app from "../firebase"
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, onSnapshot, getCountFromServer, orderBy, limit, collectionGroup } from "firebase/firestore";
import { useState } from 'react';
const db = getFirestore(app);

  const HomepageHeading = ({ mobile }) => (
    
    <Container text>
      <Header
        as='h1'
        content='Made in Heaven'
        inverted
        style={{
          fontSize: mobile ? '2em' : '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: mobile ? '1.5em' : '1.5em',
        }}
      />
      <Header
        as='h2'
        content='Des films, des musiques et des évènements pour vous'
        inverted
        style={{
          fontSize: mobile ? '1.5em' : '1.7em',
          fontWeight: 'normal',
          marginTop: mobile ? '0.5em' : '1.5em',
        }}
      />
      <Button primary size='huge'>

        <Link to={`/apimport`}  class="ui white header">Visiter notre site !</Link>

        <Icon name='right arrow' />
      </Button>
    </Container>
  )
   
  HomepageHeading.propTypes = {
    mobile: PropTypes.bool,
  }
    export default function Home() {
    const fixed = false;
     const [top5, setTop5]= useState([])
     const [top5Events, setTop5Events] = useState([])
     async function allLikes() {
      const likes = query(collectionGroup(db, 'likes'), where('isLiked', '==', true));
      const querySnapshot = await getDocs(likes);
      const songLikes = new Map()
      querySnapshot.forEach((doc) => {
        const song = songLikes.get(doc.id) ?? { count: 0, name: doc.data().name };
        songLikes.set(doc.id, { ...song, count: song.count + 1 })
      });
      const sortedSongs = Array.from(songLikes.entries()).sort((a, b) => {
        const sortResult = b[1].count - a[1].count
        if (sortResult === 0) {
          return a[0].localeCompare(b[0])
        }
        return sortResult
      }).slice(0, 5)
      setTop5(sortedSongs)
      console.log(sortedSongs, 'sorted')
    }

  
    async function topEvents() {
      const eventRef = collection(db, 'events');
      const eventSnapshot = await getDocs(eventRef);
  
      const events = eventSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
  
      const sortedEvents = events.sort((a, b) => b.likes - a.likes).slice(0, 5);
  
      setTop5Events(sortedEvents);
    }
  
    useEffect(() => {
      allLikes();
      topEvents();
    }, []);

    useEffect(()=>{    
        allLikes()
      }, []
      )

      const [top5Film, setTop5Film]= useState([])
      async function allLikesFilm() {

        const likes = query(collectionGroup(db, 'likes_films'), where('isLiked', '==', true));
    
        const querySnapshot = await getDocs(likes);
       

        const filmLikes = new Map()
        querySnapshot.forEach((doc) => {    

          const song = filmLikes.get(doc.id) ?? {count: 0, title: doc.data().title} ;
          filmLikes.set (doc.id, {...song, count: song.count +1 })
          
      
          // console.log(doc, ' => ';
        });
        console.log(filmLikes, "song Likes")
        const sortedFilms = Array.from( filmLikes.entries() ).sort((a,b) => {
        const sortResultF = b[1].count - a [1].count
        if (sortResultF === 0){
          return a[0].localeCompare(b[0])
        }
        return sortResultF
        }).slice(0,5)
        setTop5Film(sortedFilms)
        console.log(sortedFilms, 'sorted')

    }
    useEffect(()=>{    
        allLikesFilm()
      }, []
      )

      const [top3, setTop3]= useState([])
      async function allLikesEv() {

        const likes = query(collectionGroup(db, 'likes_event'), where('isLiked', '==', true));
    
        const querySnapshot = await getDocs(likes);
       

        const eventLikes = new Map()
        querySnapshot.forEach((doc) => {    

          const event = eventLikes.get(doc.id) ?? {count: 0, title: doc.data().title} ;
          eventLikes.set (doc.id, {...event, count: event.count +1 })
          
      
          // console.log(doc, ' => ';
        });
        console.log(eventLikes, "event Likes")
        const sortedEvents = Array.from( eventLikes.entries() ).sort((a,b) => {
        const sortResultE = b[1].count - a [1].count
        if (sortResultE === 0){
          return a[0].localeCompare(b[0])
        }
        return sortResultE
        }).slice(0,3)
        setTop3(sortedEvents)
        console.log(sortedEvents, 'sorted')

    }
    useEffect(()=>{    
        allLikesEv()
      }, []
      )


      
      // async function countTop5Likes() {
      //   const allLikes = query(collectionGroup(db, 'likes'), where('isLiked', '==', true ));
      //   const querySnapshot = await getDocs(allLikes);

      //   console.log ('query', querySnapshot.size)
      //   setNumberOfLikes(querySnapshot.size)
    
      // }
      // useEffect(()=>{    
      //   countTop5Likes()
      // }, []
      // )

      // async function countTop6Likes(){

      //   const coll = collection(db, "likes");
      //   const q = query(coll, where("isLiked", "==", true), limit(5), orderBy (querySnapshot.size) );
      //   const snapshot = await getCountFromServer(q);
      //   console.log('count: ', snapshot.data().count);
        
      // }
      // useEffect(()=>{    
      //   countTop6Likes()
      // }, []
      // )
      

    return ( <>
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 450, padding: '1em 0em' }}
            vertical>
            <HomepageHeading />
          </Segment>
        <Segment style={{ padding: '4em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={7}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              Top 5 Musiques
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Les Musiques préférées sur notre site <Icon name='sound' size='large' />
                <Table celled>
                  <Table.Header>
                    <Table.Row>

                      <Table.HeaderCell>Nom</Table.HeaderCell>
                      <Table.HeaderCell>Likes</Table.HeaderCell>                  

                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                       { top5.map (topSong => (
                         <Table.Row 
                         >
                           <Table.Cell>
                           <Link to={`/albumdetail/${topSong[0]}`}>{topSong[1].name}</Link>
                           </Table.Cell>                        

                           <Table.Cell collapsing>{topSong[1].count}</Table.Cell>    
                         </Table.Row>
                       ))
                        }                                       

                  </Table.Body>
                </Table>
            </p>
          
            
          </Grid.Column>
          <Grid.Column floated='right' width={7}>
          <Header as='h3' style={{ fontSize: '2em' }}>
              Top 5 films
            </Header>
            <p style={{ fontSize: '1.33em' }}>

              
              Le top 5 des films les plus appréciés   

          <Icon name='video' size='large' />
              <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Title</Table.HeaderCell>
                      <Table.HeaderCell>Likes</Table.HeaderCell>                  
                      
                  
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                  
                       { top5Film.map (topFilm => (
                         <Table.Row 
                         //key={userrow.id}
                         >
                           <Table.Cell>
                           <Link to={`/filmdetail/${topFilm[0]}`}>{topFilm[1].title}</Link>
                           </Table.Cell>                        
                           <Table.Cell collapsing>{topFilm[1].count}</Table.Cell>             
                           
                                  
                         </Table.Row>
                        
                       ))
                        }
                  </Table.Body>
                </Table>

            </p>

           
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Button size='huge' as={Link} to='/filmport/'>Aller les voir !</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    <Segment style={{ padding: '4em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              3 Événements 
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Découvrez ces événements intéressants que nous avons sélectionnés pour vous !

              <Table celled basic='very' size='large'>
              <Table.Header>
                <Table.Row>
                  {/* <Table.HeaderCell>Nom de l'événement</Table.HeaderCell> */}
                  
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {top3.map(event => (
                  <Table.Row>
                    <Table.Cell>
                      <Link to={`/DetailEvent/${event[0]}`}>{event[1].title}</Link>
                    </Table.Cell>
               
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            </p>
    
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <Image bordered rounded size='large' src='/logo.png' />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Button size='huge' as={Link} to='/event/'>Voir tous les événements</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    <Segment style={{ padding: '0em' }} vertical>
      <Grid celled='internally' columns='equal' stackable>
        <Grid.Row textAlign='center'>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              "Visiter la page des évènements"
            </Header>
            <p style={{ fontSize: '1.33em' }}>Un utilisateur objectif</p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              "Made in Heaven est fait pour tout le monde"
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              <Image avatar src='/logo.png' />
              <b>Un Admin qui vous veut du bien</b>
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    <Segment style={{ padding: '4em 0em' }} vertical>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' }}>
         Informations concernant le site
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          Les futures améliorations seront bientot terminées
        </p>
        <Divider
          as='h4'
          className='header'
          horizontal
          style={{ margin: '3em 0em', textTransform: 'uppercase' }}
        >
          <a href='#'></a>
        </Divider>
        <Header as='h3' style={{ fontSize: '2em' }}>
          Penser à aller lire les informations du footer
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          Vous pouvez vous renseigner concernant la RGPD et les données à caractère personnel
        </p>
      </Container>
    </Segment>
    </>
    )
}