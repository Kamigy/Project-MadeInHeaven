import { Outlet } from "react-router-dom"
import {useEffect, useState} from "react"
import { useOutletContext } from "react-router-dom"
import app from "../firebase"
import {getFirestore, doc, setDoc, getDoc, getDocs, collection, updateDoc,deleteDoc,deleteField,query, where, onSnapshot} from "firebase/firestore"
import {getAuth, GoogleAuthProvider,onAuthStateChanged, signInWithPopup, signOut, } from 'firebase/auth'
import { Link } from 'react-router-dom';
import { Button, Input,Checkbox, Table, Label, Popup, Form, Segment, Grid, Header, Image, Statistic } from "semantic-ui-react"
import { deleteUser } from "firebase/auth";
import { FirebaseError } from "firebase/app"
import { useRef } from "react"

// const auth =getAuth(app)
const db = getFirestore(app);

export default function Profile() {
    const [ErrorMessage, setMessage] = useState("");
    const [msgcolor, setColor] = useState("red");
    const user = useOutletContext("")

    function handleFileUploadChange(event) {
        setFilleUpload(event.target.files[0])
      }
      console.log('user', user)
    //   console.log('file', fileUpload)
    const [insta,updateInsta] = useState('')
    const [number,updateNumber] = useState('')
    const [description,updateDescription] = useState('')
    const [isPublique,setPublique] = useState(false)
   
   // const [searchText,setsearchText] = useState('')
  

    async function getUserDoc(){
        console.log('user a', user)
        if (!user) {
            return
        }
        const ref= doc(db, 'user', user.uid);
        const userDoc = await getDoc(ref);

        if(!userDoc.exists())
        {
            return
        }
        updateInsta(userDoc.data().insta)
        updateDescription(userDoc.data().description)
        updateNumber(userDoc.data().number)
        setPublique(userDoc.data().isPublique ?? false)
        
        
    }
    useEffect( ()=>{
        getUserDoc()       
    }, [user]
    )

    //const [users, setUsers] = useState([]);
    
  
    async function setProfilePublique(uid,isPublique){
      console.log("set publique", uid, isPublique)
      const ref = doc(db, "user", uid)
      await updateDoc(ref, {isPublique:isPublique})
      getUserDoc()
    }


    const [likes, setLikes] = useState([]); //songs
    
      useEffect(() => {    
       
          if (!user){
            return
          }
         return onSnapshot(query (collection(db, 'user', user.uid,'likes'), where("isLiked", "==", true)),(querySnapshot)=>{
            const allLikes = querySnapshot.docs.map(doc => {
              const newLike = doc.data()
              newLike.id = doc.id
              return newLike
            
            })
            console.log("Likes", allLikes)
            setLikes (allLikes)   
          })      
                
      }, [user])
      const [likes_films, setLikes_films] = useState([]); //films
    
      useEffect(() => {    
       
          if (!user){
            return
          }
         return onSnapshot(query (collection(db, 'user', user.uid,'likes_films'), where("isLiked", "==", true)),(querySnapshot)=>{
            const allLikes = querySnapshot.docs.map(doc => {
              const newLike = doc.data()
              newLike.id = doc.id
              return newLike
            
            })
            console.log("Likes", allLikes)
            setLikes_films (allLikes)   
          })      
                
      }, [user])

      const [likes_ev, setLikes_ev] = useState([]); //event
    
      useEffect(() => {    
       
          if (!user){
            return
          }
         return onSnapshot(query (collection(db, 'user', user.uid,'likes_event'), where("isLiked", "==", true)),(querySnapshot)=>{
            const allLikes = querySnapshot.docs.map(doc => {
              const newLike = doc.data()
              newLike.id = doc.id
              return newLike
            
            })
            console.log("Likes", allLikes)
            setLikes_ev (allLikes)   
          })      
                
      }, [user])






      
    function handleSave(){
        const ref= doc(db, 'user', user.uid)

        const regex = new RegExp('[0-9]{10}');
        if(regex.test(number)){
          setColor("green")
          setMessage("Vous avez enregistrer vos informations avec succès") ;
          updateDoc(ref,{insta:insta,number:number,description:description})
        }
        else{
          setColor("red")
          setMessage("Vous devez entrer un numéro de téléphone valide (10 numéro sans espaces)") ;
        }
        
    }

    if (!user) {        
        return( <div  className='flex flex-col items-center text-xl font-sans'> Login please</div> )
    }
    async function  Delete() {
        
        const auth = getAuth();
        const user = auth.currentUser;
        await deleteUser(user).then(() => {
            setMessage("Suppression effectuer avec succès")
            const userRef = doc(db, 'user', user.uid);
            updateDoc(userRef, {
            email: deleteField()
            });
            deleteDoc(userRef)
        })  
        .catch((error) => {
            setMessage("Si vous êtes certains de votre choix recliquer sur le bouton de suppression de compte") ;
            console.log(error)
            reauthentificate();
        });


        
    }
    async function reauthentificate(){

        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        var user= await signInWithPopup(auth,provider)
    }

    const likes_total = likes.length + likes_ev.length +likes_films.length;


    
    return (   
    <div class="ui divider" className="flex flex-col items-center">        
        
        <br/>
            <h1 className='text-xl font-sans'> Bonjour {user?.displayName ?? "no user"} !! </h1>
            
            <div className='text-xl font-sans'> email: {user?.email ?? "no user"}  </div>
            <div className='text-xl font-sans'> last Sign In Time: {user?.metadata?.lastSignInTime ?? "no user"}  </div>
            <img class="fit-picture" src={user?.photoURL ?? "no user"} />
            <p onChange={(e) => setMessage(e.target.value)} style={{color:msgcolor}}> {ErrorMessage}  </p>
          <Form>
            <Form.Field>
            <label> Add your Insta: 
              <Input value ={insta} onChange={event => updateInsta(event.target.value)} type ="text" /></label>
            </Form.Field>
            <Form.Field>
            <label> Add your Phone number: <Input value ={number} onChange={event => updateNumber(event.target.value)} type ="text" pattern="[0-9]{10}" /></label>
            </Form.Field>           
            <Form.Field>
            <label> Add decriprion of your account: <Input value ={description} onChange={event => updateDescription(event.target.value)} type ="text" /></label>
            </Form.Field>
            
            <Popup
                content='Data is saved'
                on='click'
                pinned
                trigger={<Button  className="w-auto" type="submit" onClick={handleSave} content='Save' />}
            />
          </Form>
            
            
           
           

            <br/>
            <h2>Set your profile publique </h2> 
             {user?.data?.islimited ?
              <p>you are limited and your profile can't be public</p>
             :
             <Checkbox  toggle checked={isPublique}   onChange={ () =>{
              setPublique(!isPublique)
              setProfilePublique(user.uid, !isPublique)
             } 
             }     />
            }
            
            
         
           <br/>

           <Statistic>
           <h2>You have</h2>  
              <Statistic.Value>{likes_total}</Statistic.Value>
              <Statistic.Label>Likes</Statistic.Label>
            </Statistic>
            {/* <div>
             <h1>Liste des Likes</h1>      
            </div>
            <br/> */}

{/*             
      <Table celled collapsing>
        <Table.Header collapsing>
          <Table.Row>
            <Table.HeaderCell collapsing>Like ID</Table.HeaderCell>
            <Table.HeaderCell>name</Table.HeaderCell>                    
            
          </Table.Row>
        </Table.Header>

        <Table.Body>
        {likes.map((likerow) => (

              <Table.Row key={likerow.id}>
                <Table.Cell collapsing>
                <Link to={`/albumdetail/${likerow.id}`}>{likerow.name}</Link>
               </Table.Cell>
                <Table.Cell >{likerow.id}</Table.Cell>                        
                                 
              </Table.Row>
          
            ))}          
        </Table.Body>
      </Table> */}
      <h1>Liste des Likes </h1> 

      <Segment style={{ padding: '0em' }} vertical>
        
      <Grid stackable columns={3} >
        <Grid.Row textAlign='center'>
          <Grid.Column style={{ paddingBottom: '3em' }} width={5}>
          
                <Table celled collapsing>
                <Table.Header collapsing>
                <Table.Row>
                  <Table.HeaderCell width={10} collapsing>Songs</Table.HeaderCell>
                  {/* <Table.HeaderCell>name</Table.HeaderCell>                     */}
                  
                </Table.Row>
              </Table.Header>

              <Table.Body>
              {likes.map((likerow) => (

                    <Table.Row key={likerow.id}>
                      <Table.Cell >
                      <Link to={`/albumdetail/${likerow.id}`}>{likerow.name}</Link>
                    </Table.Cell>
                      {/* <Table.Cell >{likerow.id}</Table.Cell>                         */}
                                      
                    </Table.Row>
                
                  ))}          
              </Table.Body>
            </Table>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: '3em' }} width={5}>
              
                  
                  <Table celled >
                  <Table.Header >
                  <Table.Row>
                    <Table.HeaderCell width={10} >Films</Table.HeaderCell>
                    {/* <Table.HeaderCell>name</Table.HeaderCell>                     */}
                    
                  </Table.Row>
                </Table.Header>
  
                <Table.Body>
                {likes_films.map((likerow) => (
  
                      <Table.Row key={likerow.id}>
                        <Table.Cell >
                        <Link to={`/filmdetail/${likerow.id}`}>{likerow.title}</Link>
                      </Table.Cell>
                        {/* <Table.Cell >{likerow.id}</Table.Cell>                         */}
                                        
                      </Table.Row>
                  
                    ))}          
                </Table.Body>
              </Table>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: '3em' }}>
               
                  
                  
                  <Table celled >
                  <Table.Header >
                  <Table.Row>
                    <Table.HeaderCell width={10} >Events</Table.HeaderCell>
                    {/* <Table.HeaderCell>name</Table.HeaderCell>                     */}
                    
                  </Table.Row>
                </Table.Header>
  
                <Table.Body>
                {likes_ev.map((likerow) => (
  
                      <Table.Row key={likerow.id}>
                        <Table.Cell >
                        <Link to={`/DetailEvent/${likerow.id}`}>{likerow.title}</Link>
                      </Table.Cell>
                        {/* <Table.Cell >{likerow.id}</Table.Cell>                         */}
                                        
                      </Table.Row>
                  
                    ))}          
                </Table.Body>
              </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
      
             
        {/* <Button onClick={() => {alert('woooooooot?');}}>try me when popup is open</Button> */}


            
            <br></br>
            <br></br>
            <Button color='red' onClick={Delete} > Delete compte </Button>
            <br></br>
            



            {/* <button  type='button' className='rounded-xl bg-blue p-3' onClick={() => user 
                ? signOut(auth) 
                :signInWithPopup(auth,provider) } >  {user ? 'Sign Out': 'Sign In'}
            </button>  */}
           

            {/* {user && (
                <div> 
                    <Outlet context={user} ></Outlet>
                    <Button type='button' onClick={handleFileUploadChange} > Choose photo</Button>
                   
                    <div></div>
               
                   
                </div>
             )} */}
        </div>
    )
}
