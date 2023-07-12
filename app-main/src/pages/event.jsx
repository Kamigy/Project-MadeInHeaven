import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import { Button, Form, Grid, Header, Card } from 'semantic-ui-react';
import app from '../firebase';
import { getFirestore, doc, deleteDoc, setDoc, getDocs, collection } from "firebase/firestore";
import "firebase/database";
import "firebase/auth";
;
import { Link } from 'react-router-dom';

const db = getFirestore(app);

export default function Event() {
  const user = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [MessageConfirmed, setMessage] = useState("");
  const [title, setTitle] = useState("");  
  const [type, setType] = useState("");
  const [description, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);

  async function fetchEvent() {
    const querySnapshot = await getDocs(collection(db, "event"));
    const allEvent = querySnapshot.docs.map(doc => {
      const newEvent = doc.data()
      newEvent.id = doc.id
      return newEvent
    })
    setEvents(allEvent)
  }

  useEffect(() => {
    fetchEvent()
  }, [])

  const deleteEvent = async (eventId) => {
    await deleteDoc(doc(db, `event/${eventId}`));
    fetchEvent(); // rafraîchir la liste après la suppression
  };

  const HandleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !type || !description || !date) {
      console.log("Veuillez remplir tous les champs avant d'enregistrer");
      setMessage("Veuillez remplir tous les champs avant d'enregistrer");
    }  else if (date.length !== 10 || parseInt(date.substring(0, 4), 10) > new Date().getFullYear() + 5) {
      console.log("Veuillez entrer une date valide (format : JJ/MM/AAAA) et jusqu'à 5 ans dans le futur");
      setMessage("Veuillez entrer une date valide (format : JJ/MM/AAAA) et jusqu'à 5 ans dans le futur");
    } else {
      const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);

      await setDoc(doc(db, `event/${uid}`), {
        title: title,
        type: type,
        description: description,
        date: date,
        createdBy: {
          id: user.uid, 
          name: user.displayName, 
        }
      }, { merge: true })

            .then(() => {
          console.log("Informations enregistrées avec succès dans la base de données");
          setMessage("Vous avez bien enregistré un nouvel événement");
          fetchEvent(); // Rafraîchir la liste des événements après l'ajout
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement des informations dans la base de données :", error);
          setMessage("Erreur enregistrement des informations dans la base de données");
        });
      setTitle("");
      setDesc("");  
      setType("");
      setDate("");
    }
  };

  if (!user) {
    return (
      <>
        <br></br>
        <br></br>
        <br></br>
        <div className='flex flex-col items-center text-xl font-sans'> Vous n'avez pas accès à cette page, veuillez vous connecter</div>
      </>
    )
  }

  return (

    <Grid divided="vertically" textAlign='right' style={{ height: '80vh' }} verticalAlign='middle'>
      <Grid.Row columns={user?.data?.isAnnonceur ? 2 : 1}>
        {user?.data?.isAnnonceur && (
          <Grid.Column style={{ maxWidth: 500 }}>
            <Header as='h2' color='black' textAlign='center'>

              <div className="container">
                <Button className='button-left' onClick={() => setShowForm(!showForm)}>Création Evènement</Button>
                {showForm && (
                  
                  <Form onSubmit={HandleSubmit}>
                    <br></br>
                    <label>
                      Titre:
                      <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <br></br>                    
                    <label>
                      Type d'évènement:
                      <input id="type" type="text" value={type} onChange={(e) => setType(e.target.value)} />
                    </label>
                    <br></br>
                    <label>
                      Description:
                      <input id="description" type="text" value={description} onChange={(e) => setDesc(e.target.value)} />
                    </label>
                    <br></br>
                    <label>
                      Date:
                      <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} max={new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split("T")[0]} />
                    </label>
                    <br></br>
                    <br></br>
                    <Button type="submit">Enregistrer</Button>
                    <div>
                      <p onChange={(e) => setMessage(e.target.value)}>{MessageConfirmed}</p>
                    </div>
                  </Form>
                )}

              </div>
            </Header>
          </Grid.Column>
        )}
        <Grid.Column floated={user?.data?.isAnnonceur ? 'right' : null} style={{ maxWidth: user?.data?.isAnnonceur ? 1100 : '100%' }}>
          <Header as='h2' color='black' textAlign='center'>

            Liste des événements
          </Header>
          <div >
            <Card.Group itemsPerRow={3}>
              {events.map((eventrow) => (
                <Card key={eventrow.id}>
                  <Card.Content>
                    <Card.Header>
                      <Link to={`/DetailEvent/${eventrow.id}`}>{eventrow.title}</Link>
                    </Card.Header>
                    <Card.Meta>{eventrow.date}</Card.Meta>
                    <Card.Description>{eventrow.description}</Card.Description>
                  </Card.Content>
                  {user?.data?.isModerator &&
                    <Card.Content extra>
                      <Button basic color='red' onClick={() => deleteEvent(eventrow.id)}>Supprimer</Button>
                    </Card.Content>
                  }
                </Card>
              ))}
            </Card.Group>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
