import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc, getDocs, deleteDoc,updateDoc, getFirestore, collection, addDoc,Timestamp, serverTimestamp, query, where, onSnapshot, setDoc, collectionGroup } from 'firebase/firestore';
import app from '../firebase';
import "firebase/database";
import "firebase/auth";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Button, Header, Label,Comment, Icon, Segment, Grid,Input, Divider } from 'semantic-ui-react';
import { useOutletContext,useNavigate } from "react-router-dom";
const db = getFirestore(app);

export default function DetailEvent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEventUpdated, setIsEventUpdated] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState({ title: '', genre: '', type: '', description: '', date: '' });
    const user = useOutletContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
      const fetchEvent = async () => {
        try {
          const eventDoc = await getDoc(doc(db, 'event', id));
          if (eventDoc.exists()) {
            setEvent(eventDoc.data());
          } else {
            console.log('Aucun événement trouvé avec cet ID');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des détails de l\'événement :', error);
        }
      };
  
      fetchEvent();
    }, [id, isEventUpdated]);

    const handleDeleteComment = async (commentId) => {
      try {
        if (comments && comments.length > 0 && commentId) {
          const commentIndex = comments.findIndex((commentItem) => {
            return commentItem && commentItem.id === commentId;
          });
          if (commentIndex !== -1) {
            await deleteDoc(doc(db, 'comments', commentId));
            console.log('Commentaire supprimé avec succès');
          } else {
            console.log('Commentaire introuvable');
          }
        } else {
          console.log('Aucun commentaire trouvé ou ID de commentaire indéfini');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du commentaire :', error);
      }
    };
    const handleDeleteEvent = async () => {
      try {
        await deleteDoc(doc(db, 'event', id));
        console.log('Évènement supprimé avec succès');
        navigate(-1);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'évènement :', error);
      }
    };
    
    const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'event', id), updatedEvent);
      console.log('Événement mis à jour avec succès');
      setIsEventUpdated(true);  
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement :', error);
    }
  };
    

    useEffect(() => {
      const fetchComments = async () => {
        const commentsRef = collection(db, 'comments');
        const eventCommentsQuery = query(commentsRef, where('eventId', '==', id));
        const snapshot = await getDocs(eventCommentsQuery);
        const commentsData = [];
        for (const doc of snapshot.docs) {
          const comment = doc.data();
          const userDoc = await getDoc(doc(db, 'users', comment.userId));
          const userData = userDoc.data();
          const commentWithUserData = {
            ...comment,
            userData: userData,
            id: doc.id, // Ajouter l'ID du commentaire
          };
          commentsData.push(commentWithUserData);
        }
    
        setComments(commentsData);
      };
    
      fetchComments();
    }, [id]);
  
    useEffect(() => {
      const commentsRef = collection(db, 'comments');
      const eventCommentsQuery = query(commentsRef, where('eventId', '==', id));

      const unsubscribe = onSnapshot(eventCommentsQuery, (snapshot) => {
        const commentsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setComments(commentsData);
      });

      return () => unsubscribe();
    }, [id]);

    // useEffect(() => {
    //   const fetchComments = async () => {
    //     const commentsRef = collection(db, 'comments');
    //     const eventCommentsQuery = query(commentsRef, where('eventId', '==', id));
    //     const snapshot = await getDocs(eventCommentsQuery);
    //     const commentsData = [];
    //     for (const doc of snapshot.docs) {
    //       const comment = doc.data();
    //       const userDoc = await getDoc(doc(db, 'users', comment.userId));
    //       const userData = userDoc.data();
    //       const commentWithUserData = {
    //         ...comment,
    //         userData: userData,
    //       };
    //       commentsData.push(commentWithUserData);
    //     }
    
    //     setComments(commentsData);
    //   };
    
    //   fetchComments();
    // }, [id]);
    
    useEffect(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
    }, []);
    
    const handleSubmitComment = async (e) => {
      e.preventDefault();
      if (!comment) {}
      else{
  
      
      try {
        const newComment = {
          userId: user?.uid,
          eventId: id,
          content: comment,
          timestamp: serverTimestamp(),
          userData: { email: user?.email }, // Ajouter les informations utilisateur
        };
    
        const docRef = await addDoc(collection(db, 'comments'), newComment);
        console.log('Commentaire ajouté avec succès');
    
        const commentWithUserData = {
          ...newComment,
          id: docRef.id,
        };
    
        setComments((prevComments) => [...prevComments, commentWithUserData]);
    
        setComment('');
      } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire :', error);
      }}
    };
         function addLike(id, liked, event){
           console.log('user in function', user)
          const ref= doc(db, 'user',  user.uid,'likes_event', id); 
          setDoc(ref,{id, isLiked:liked, title:event?.title?? ""})
          // TODO add title
              
      }
        const [isLiked, setIsLiked]= useState (false)
        useEffect(()=> {
          async function getLike (){
            const ref= doc(db, 'user', user.uid,'likes_event', id);       
            const snapshot = await getDoc(ref)
            setIsLiked(snapshot.exists && snapshot.data().isLiked)

          }
          if(user){
            getLike()
          }
        
        },[user])
        
        const [numberOfLikes, setNumberOfLikes] = useState(0)
        async function countLikes() {
          const allLikes = query(collectionGroup(db, 'likes_event'), where('id', '==', id),where('isLiked', '==', true ));
          const querySnapshot = await getDocs(allLikes);

          console.log ('query', querySnapshot.size)
          setNumberOfLikes(querySnapshot.size)
      
        }
        useEffect(()=>{    
          countLikes()
        }, []

        )


  
  
    return (
      <div class="wrapper">

        <Segment>
          <Grid columns={2}  >
            <Grid.Column>
            <Header as='h1' dividing> {event?.title}
  {event && (user?.uid === event.createdBy.id || user?.data?.isModerator) && (
    <>
      <Button onClick={handleDeleteEvent}>Supprimer l'événement</Button>
      <Button onClick={() => { setShowUpdateForm(!showUpdateForm); setUpdatedEvent(event); }}>Modifier l'événement</Button>
    </>
  )}</Header>
          <p><label basic color='black'><Icon name='ticket'/>Type d'évènement</label> <br/><br/> <span style={{fontSize: "20px"}}>{event?.type}</span></p>
          <br/><br/>
          <p><label basic color='black'><Icon name='info circle'/>Description</label> <br/><br/> <span style={{fontSize: "20px"}}>{event?.description}</span></p>
          <br/><br/>
          <p><label basic color='black'><Icon name='calendar alternate'/> Date</label> <br/><br/> <span style={{fontSize: "20px"}}>{event?.date}</span></p>

          <br/><br/>

      {user &&
      <div>
      <Button as='div' labelPosition='right'>
        <Button onClick={async ()=>{
          setIsLiked(!isLiked)
          addLike(id, !isLiked, event)
          setNumberOfLikes((currentLikes)=>{
            if (isLiked){
              return currentLikes -1
            }   
           return currentLikes +1
           })
         
        }} color={isLiked? 'grey':'red'}>
          <Icon name='add' />         
          {isLiked ? "Unlike": "Like"}
        </Button>
        <Label as='a' basic color='red' pointing='left'>
          {numberOfLikes}
        </Label>
      </Button>
  
    </div>
}
{showUpdateForm && (
  <form onSubmit={handleUpdateEvent}>
    <Label>
      Titre:
      <Input type="text" value={updatedEvent.title} onChange={(e) => setUpdatedEvent({...updatedEvent, title: e.target.value})} />
    </Label>
    <Label>
      Genre:
      <Input type="text" value={updatedEvent.genre} onChange={(e) => setUpdatedEvent({...updatedEvent, genre: e.target.value})} />
    </Label>
    <Label>
      Type:
      <Input type="text" value={updatedEvent.type} onChange={(e) => setUpdatedEvent({...updatedEvent, type: e.target.value})} />
    </Label>
    <Label>
      Description:
      <Input type="text" value={updatedEvent.description} onChange={(e) => setUpdatedEvent({...updatedEvent, description: e.target.value})} />
    </Label>
    <Label>
      Date:
      <Input type="date" value={updatedEvent.date} onChange={(e) => setUpdatedEvent({...updatedEvent, date: e.target.value})} />
    </Label>
    <Button type="submit">Mettre à jour l'événement</Button>
    <Button type="button" onClick={() => setShowUpdateForm(false)}>Annuler</Button>
  </form>
)}

      </Grid.Column>
      <Grid.Column>
                <div >
                  <Header as='h3' dividing>
                Commentaires
              </Header>
              
                    
                {comments.map((comment) => (
                  <Comment.Group minimal key={comment.id}>
                    <Comment>
                      <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                      <Comment.Content>
                        <Comment.Author as='a'>{comment.userData?.email}</Comment.Author>
                        {comment.timestamp && comment.timestamp instanceof Timestamp && (
                          <Comment.Metadata>
                            <span>Date : {comment.timestamp.toDate().toLocaleString()}</span>
                          </Comment.Metadata>
                        )}
                        <Comment.Text>{comment.content}</Comment.Text>
                        {user?.data?.isModerator == true | user?.data?.email== comment.userData?.email ?
                      <Button onClick={() => handleDeleteComment(comment.id)}>Supprimer</Button>:null
                       }
                        
                      </Comment.Content>
                    </Comment>
                  </Comment.Group>
                ))}
                </div>
        
                {user | !user?.data?.islimited ?
                  <form class="ui reply form" onSubmit={handleSubmitComment}>
                    <div class="field">
                    <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                    <button class="ui icon primary left labeled button" type="submit">Ajouter un commentaire</button>
                  </form> : null}
               
            </Grid.Column>
          </Grid>

          
        </Segment>

   


             </div>
    );
  }