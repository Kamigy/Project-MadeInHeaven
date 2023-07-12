import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Card, Image, Icon, Label, Menu, Table, Reveal } from 'semantic-ui-react'
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, collectionGroup, onSnapshot } from "firebase/firestore"
import app from "../firebase"
import { useOutletContext, Link } from "react-router-dom"
import { getAuth } from "firebase/auth"



const db = getFirestore(app);
//const auth = getAuth();


const TableAdmin= () => {
  
  const user = useOutletContext()  
  


  const [users, setUsers] = useState([]);
  async function fetchUsers() {

    // const docRef = doc(db, "user");
    if(user?.data?.isModerator == true ){
      const querySnapshot = await getDocs(query(collection(db, "user")));
      const allUsers = querySnapshot.docs.map(doc => {
        const newUser = doc.data()
        newUser.id = doc.id
        return newUser
        //({id: doc.id, ...doc.data()}))
        
      })
      console.log("users", allUsers)
      setUsers (allUsers)
      
    }
    else{
      const querySnapshot = await getDocs(query(collection(db, "user"), where ("isPublique", "==", true) ));
   
    
    const allUsers = querySnapshot.docs.map(doc => {
      const newUser = doc.data()
      newUser.id = doc.id
      return newUser
      //({id: doc.id, ...doc.data()}))
      
    })

    console.log("users", allUsers)
    setUsers (allUsers)    }

   // console.log("users", allUsers)
    setUsers (allUsers)   
    
    // Assign value to a key
    //console.log(users)
   // var t = JSON.stringify(users);
   // sessionStorage.setItem("users", t);
   // console.log("sessionStorage.getItem", sessionStorage.getItem("users"));

  } 

  
  useEffect(() => {  
    fetchUsers();  
  }, [user])  

  
  const [likes, setLikes] = useState([]); 
  const [userSongslikes, setUserSongsLikes] = useState (new Map())


  async function allLikesbl() {     
   const reference = collectionGroup(db, 'likes');
   const wherLikes = where("isLiked", "==", true);
    const alb = query(reference, wherLikes);
    const querySnapshot = await getDocs(alb);
    

    const songLikes = new Map()
   querySnapshot.forEach((doc) => {    

    // const song = songLikes.get(doc.id) ?? {count: 0, name: doc.data().name} ;
    // songLikes.set (doc.id, {...song, count: song.count +1 })
    const userId = doc.ref.path.split("/")[1]

    songLikes.set(userId, (songLikes.get(userId)?? 0)+1)
    // console.log(doc, ' => ';
  });
  setUserSongsLikes(songLikes)
    console.log(songLikes, "Daria")

        const allLikes = querySnapshot.docs.map(doc => {
          const newLike = doc.data()
         console.log("path",doc.ref.path) 
          newLike.id = doc.id
          return newLike
        
        })
        console.log("Likes", allLikes)
        setLikes (allLikes)   
   }     
      useEffect(() => { 
       if (!user){
        return
       }
        allLikesbl()    
            
  }, [user])


  async function limituser(uid,islimited){


    const ref = doc(db, "user", uid)
    await updateDoc(ref, {islimited})
    
  }




  const [top5, setTop5]= useState([])
  async function allLikes() {

    const likes = query(collectionGroup(db, 'likes'), where('isLiked', '==', true));

    const querySnapshot = await getDocs(likes);
   

    const songLikes = new Map()
    querySnapshot.forEach((doc) => {    

      const song = songLikes.get(doc.id) ?? {count: 0, name: doc.data().name} ;
      songLikes.set (doc.id, {...song, count: song.count +1 })
      
  
      // console.log(doc, ' => ';
    });
    console.log(songLikes, "song Likes")
    const sortedSongs = Array.from( songLikes.entries() ).sort((a,b) => {
    const sortResult = b[1].count - a [1].count
    if (sortResult === 0){
      return a[0].localeCompare(b[0])
    }
    return sortResult
    }).slice(0,5)
    setTop5(sortedSongs)
    console.log(sortedSongs, 'sorted')

}
useEffect(()=>{    
    allLikes()
  }, []
  )


  
  // const [likes, setLikes] = useState([]);   
  // async function fetchLikes() { 
  // const querySnapshot = await getDocs(query(collection(db, "likes"),  where ("isLiked", "==", true) ));
 
  //       const allLikes = querySnapshot.docs.map(doc => {
  //         const newLike = doc.data()
  //         newLike.id = doc.id
  //         return newLike
        
  //       })
  //       console.log("Likes", allLikes)
  //       setLikes (allLikes)   
  //     }       
    
  // useEffect(() => {    
   
  //   fetchLikes();
            
  // }, [user])

      //  const [numberOfLikes, setNumberOfLikes] = useState(0)
      // async function countLikes() {
      //   const allLikes = query(collection(db, 'likes'), where('id', '==', id),where('isLiked', '==', true ));
      //   const querySnapshot = await getDocs(allLikes);

      //   console.log ('query', querySnapshot.size)
      //   setNumberOfLikes(querySnapshot.size)
    
      // }
      // useEffect(()=>{    
      //   countLikes();
      // }, []
      // )



  return (


    <>  
      <br/>
      <div>
        <h1>Liste des utilisateurs</h1>      
      </div>
      <br/>

      
      
        <Card.Group itemsPerRow={5} centered>
        {users.map((userrow) => (
        
          <Card >
             <Image>
             { userrow?.isPublique == true ?

         <Reveal animated='move down'>
              <Reveal.Content visible>
                <Image size='big' src={'store.png'} />
              </Reveal.Content>
              <Reveal.Content hidden>
                <Image size='big' src={userrow.photo ?? 'https://react.semantic-ui.com/images/avatar/large/matthew.png'} />
              </Reveal.Content>
            </Reveal>

              :
            
          
             <Image size='big' src= {  'store.png' } />
            
            }
            </Image>
          
{/*        
            <Image  src={userrow.photo ?? 'https://react.semantic-ui.com/images/avatar/large/matthew.png'} wrapped ui={false} /> */}
            
            <Card.Content>
           
            <Card.Header>


            { userrow?.isPublique == true ?
            <Link to={`/user/${userrow.email}`}>

            

              {userrow.email}
           
              </Link>
                 :
                 <p>
                 {userrow.email}
                 </p>
            
                }

            </Card.Header>
             
            <Card.Meta>
            { userrow?.isPublique == true ?
              <span className='date'>{userrow.insta || "my insta" }</span>
              :
              <span className='date'>Compte privé </span>
            }
            </Card.Meta>
            <Card.Description>
            { userrow?.isPublique == true ?
             <p>{userrow.description || "description"}</p>
             :
             null
            }
            </Card.Description>
            </Card.Content>
            <Card.Content extra>
            { userrow?.isPublique == true ?
            <a>
              <Icon name='sound' />
              J'ai liké {userSongslikes.get(userrow.id)?? 0} chansons 
            </a>
             :
               null
            }
           
            {user?.data?.isModerator &  !userrow?.islimited ?
            
            <Button basic color='red' onClick={async() => limituser(userrow.id,!userrow.islimited)}>Limiter l'utilisateur</Button>
            :
            null
            }
             { userrow?.islimited & user?.data?.isModerator  ?
                 <Button basic color='green' onClick={async() => limituser(userrow.id,!userrow.islimited)}>Rendre ses droits </Button>

                :
                null
              
              }
                 
            </Card.Content>        
            
           </Card>
           ))}
         </Card.Group>
  
    </>
  )

      }
export default TableAdmin

{/* <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Insta</Table.HeaderCell>
         
            
          </Table.Row>
        </Table.Header>

        <Table.Body>
        {users.map((userrow) => (
              <Table.Row key={userrow.id}>
                <Table.Cell collapsing>{userrow.id}</Table.Cell>
                <Table.Cell collapsing>{userrow.email}</Table.Cell>
                <Table.Cell collapsing>{userrow.insta || "-"}</Table.Cell>                
                        
              </Table.Row>
            ))}
          
        </Table.Body>
      </Table> */}



