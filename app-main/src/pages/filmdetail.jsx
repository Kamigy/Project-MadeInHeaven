import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Icon, Label, Table,Comment,Header } from 'semantic-ui-react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { deleteDoc, getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, addDoc, collectionGroup,onSnapshot,serverTimestamp,Timestamp } from "firebase/firestore"
import app from "../firebase"
import { useOutletContext } from "react-router-dom"

export default function FilmDetail() {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [filmDetails, setFilmDetails] = useState();
  const db = getFirestore(app);
  const auth = getAuth();
  const user = useOutletContext()

  function addLike(id, liked){
    console.log('user in function', user)
     console.log('title', filmDetails.result.title)
   // console.log(data.result.title)
        const ref= doc(db, 'user',  user.uid,'likes_films', id); 
        setDoc(ref,{id, isLiked:liked, title: filmDetails?.result.title?? "" })           
    }
  const [isLiked, setIsLiked]=useState (false)
  useEffect(()=> {
    async function getLike (){
      const ref= doc(db, 'user', user.uid,'likes_films', id);       
      const snapshot = await getDoc(ref)
      setIsLiked(snapshot.exists && snapshot.data().isLiked)

    }
    if(user){
      getLike()
    }
   
  },[user])
  
  const [numberOfLikes, setNumberOfLikes] = useState(0)
  async function countLikes() {
    const allLikes = query(collectionGroup(db, 'likes_films'), where('id', '==', id),where('isLiked', '==', true ));
    const querySnapshot = await getDocs(allLikes);

    console.log ('query', querySnapshot.size)
    setNumberOfLikes(querySnapshot.size)
 
  }
  useEffect(()=>{    
    countLikes()
  }, []

  )

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


useEffect(() => {
  const fetchComments = async () => {
    const commentsRef = collection(db, 'comments');
    const eventCommentsQuery = query(commentsRef, where('filmId', '==', id));
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
  const eventCommentsQuery = query(commentsRef, where('filmId', '==', id));

  const unsubscribe = onSnapshot(eventCommentsQuery, (snapshot) => {
    const commentsData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setComments(commentsData);
  });

  return () => unsubscribe();
}, [id]);
useEffect(() => {
  const fetchComments = async () => {
    const commentsRef = collection(db, 'comments');
    const eventCommentsQuery = query(commentsRef, where('filmId', '==', id));
    const snapshot = await getDocs(eventCommentsQuery);
    const commentsData = [];
    for (const doc of snapshot.docs) {
      const comment = doc.data();
      const userDoc = await getDoc(doc(db, 'users', comment.userId));
      const userData = userDoc.data();
      const commentWithUserData = {
        ...comment,
        userData: userData,
      };
      commentsData.push(commentWithUserData);
    }

    setComments(commentsData);
  };

  fetchComments();
}, [id]);

const handleSubmitComment = async (e) => {
  e.preventDefault();
  if (!comment) {}
  else{

  
  try {
    const newComment = {
      userId: user?.uid,
      filmId: id,
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

  useEffect(() => {
    async function fetchFilmDetails() {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'f8a48c6a6dmshd37f4a75bd82332p1188c9jsn2ebc1d4c172c',
          'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
      };
      
      //const response = await fetch(`https://spotify23.p.rapidapi.com/albums/?ids=${id}`, options);
      const response = await fetch(`https://streaming-availability.p.rapidapi.com/v2/get/basic?imdb_id=${id}&country=us&output_language=en`, options);
      const data = await response.json();
      setFilmDetails(data);
      console.log(data)
    }
    
    fetchFilmDetails();
  }, [id]);

  if (!filmDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Table celled inverted selectable className='dark-div'>
    <Table.Row>
      <Table.Cell>{filmDetails.result.originalTitle}</Table.Cell>
      <Table.Cell>Director(s) : {filmDetails.result.directors[0]}</Table.Cell>
      <Table.Cell>Release Date : {filmDetails.result.year}</Table.Cell>
      <Table.Cell>Context : {filmDetails.result.overview}</Table.Cell>
      <Table.Cell>Trailer <a href={filmDetails.result.youtubeTrailerVideoLink}>here</a></Table.Cell>
      <Table.Cell>
        <img src={filmDetails.result.posterURLs[185]} style={{ width: '200px' }}/>
      </Table.Cell>
    </Table.Row>
  </Table>
  {user &&
      <div>
      <Button as='div' labelPosition='right'>
        <Button onClick={async ()=>{
          setIsLiked(!isLiked)
          addLike(id, !isLiked)
          setNumberOfLikes((currentLikes)=>{
            if (isLiked){
              return currentLikes -1
            }   
           return currentLikes +1
           })
         
        }} color={isLiked? 'grey':'red'}>
          <Icon name='heart' />         
          {isLiked ? "Unlike": "Like"}
        </Button>
        <Label as='a' basic color='red' pointing='left'>
          {numberOfLikes}
        </Label>
      </Button>
     
    </div>}
    



<div class="commentaire">

<Header as='h3' dividing>
Commentaires
</Header>
<div style={{ maxHeight: '45vh', overflow: 'auto' }}>   

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
</div>
    </>
    
  );
}
