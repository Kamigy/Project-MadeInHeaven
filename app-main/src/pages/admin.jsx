import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Icon, Input, Label, Menu, Table } from 'semantic-ui-react'
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { getDatabase, ref, orderByValue, limitToLast } from "firebase/database";
import app from "../firebase"
import { useOutletContext } from "react-router-dom"
import { getAuth } from "firebase/auth";

const db = getFirestore(app);
const auth = getAuth();





const TableAdmin= () => {
  const [searchText,setsearchText] = useState('')
  const [isAdmin,updateAdmin] = useState('')
  const user = useOutletContext()
  

  function handleSave(){
  const ref= doc(db, 'user', user.uid)
  updateDoc(ref,{isAdmin:isAdmin})
   
  }


  const [users, setUsers] = useState([]);
  const [filtredUsers, setfiltredUsers] = useState([]);
  async function fetchUsers() {

    // const docRef = doc(db, "user");
    const querySnapshot = await getDocs(collection(db, "user"));
   
    
    const allUsers = querySnapshot.docs.map(doc => {
      const newUser = doc.data()
      newUser.id = doc.id
      
      return newUser
      //({id: doc.id, ...doc.data()}))
    })
    console.log("users", allUsers)
    setUsers (allUsers)
   
  console.log("updating users", allUsers)
    // const users = doc.data([]);
  }
  useEffect(() => {
    if (user?.data?.isAdmin){
    fetchUsers();
  }
  }, [user])

  async function searchUsers() {
    const founUser = users.filter(currentUser => currentUser.email.includes(searchText))
    console.log ("found user", founUser)
    setfiltredUsers(founUser)

    // const docRef = doc(db, "user");
    // const querySnapshot = await getDocs(query(collection(db, "user"), where('email', '==', searchText )));
    // console.log("search users", searchText,  querySnapshot)
    
    // const allUsers = querySnapshot.docs.map(doc => {
    //   const newUser = doc.data()
    //   newUser.id = doc.id
    //   return newUser
    //   //({id: doc.id, ...doc.data()}))
    // })
    // console.log("users", allUsers)
    // setUsers (allUsers)

  }

useEffect(() =>
{
  searchUsers()
}, [users])

  async function setUserAdmin(uid,isAdmin){
    console.log("set admins", uid, isAdmin)
    const ref = doc(db, "user", uid)
    await updateDoc(ref, {isAdmin})
    fetchUsers()
  }
  async function setUserModerator(uid,isModerator){
    console.log("set moders", uid, isModerator)
    const ref = doc(db, "user", uid)
    await updateDoc(ref, {isModerator})
    fetchUsers()
  }
  async function setUserAnnonceur(uid,isAnnonceur){
    console.log("set Annonceurs", uid, isAnnonceur)
    const ref = doc(db, "user", uid)
    await updateDoc(ref, {isAnnonceur})
    fetchUsers()
  }



  // console.log(user)
  if (user?.data?.isAdmin != true) {
        
    return(
        <>
 
     <div  className='flex flex-col items-center text-xl font-sans'> You are not admin</div>
     </>)
   
  }


  return (


    <>  
    <br/>
      <div>
        <h1>Liste des utilisateurs</h1>
      
      </div>
      <form onSubmit={(event)=>{
        event.preventDefault()
        searchUsers()
        }}>
      <Input id="search" type="text" class="input" placeholder="search..." value={searchText} onChange={event=>setsearchText(event.target.value)}
      />
        <Button type="submit" 
        >Search</Button>
        </form>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Insta</Table.HeaderCell>
            <Table.HeaderCell>Admin</Table.HeaderCell>
            <Table.HeaderCell>Modérateur</Table.HeaderCell>
            <Table.HeaderCell>Annonceur</Table.HeaderCell>
            
          </Table.Row>
        </Table.Header>

        <Table.Body>
        {filtredUsers.map((userrow) => (
              <Table.Row key={userrow.id}>
                <Table.Cell>{userrow.email}</Table.Cell>
                <Table.Cell>{userrow.id}</Table.Cell>
                <Table.Cell>{userrow.insta || "-"}</Table.Cell>                
                <Table.Cell collapsing> 
                  <Checkbox  toggle checked={userrow.isAdmin}  onChange={ () => setUserAdmin(userrow.id, !userrow.isAdmin)}  />
                  {/* <Input value ={isAdmin}  /> */}
               </Table.Cell>  
               <Table.Cell collapsing> 
                  <Checkbox  toggle checked={userrow.isModerator}  onChange={ () => setUserModerator(userrow.id, !userrow.isModerator)}  />
                  {/* <Input value ={isAdmin}  /> */}
               </Table.Cell> 
               <Table.Cell collapsing> 
                  <Checkbox  toggle checked={userrow.isAnnonceur}  onChange={ () => setUserAnnonceur(userrow.id, !userrow.isAnnonceur)}  />
                  {/* <Input value ={isAdmin}  /> */}
               </Table.Cell>               
              </Table.Row>
            ))}
          
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            {/* <Table.HeaderCell colSpan='4'>
              <Menu floated='right' pagination>
                 <Button floated='left' onClick={handleSave}>
                  Save
                </Button>
                <Menu.Item as='a' icon>
                  <Icon name='chevron left' />
                </Menu.Item>
                <Menu.Item as='a'>1</Menu.Item>
                <Menu.Item as='a'>2</Menu.Item>
                <Menu.Item as='a'>3</Menu.Item>
                <Menu.Item as='a'>4</Menu.Item>
                <Menu.Item as='a' icon>
                  <Icon name='chevron right' />
                </Menu.Item>
                <Menu.Item as='a' icon>
                  <Icon name='chevron right' />
                </Menu.Item>
                <Menu.Item as='a' icon>
                  <Icon name='chevron right' />
                </Menu.Item>
               
              </Menu>
            </Table.HeaderCell> */}
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  )
}

export default TableAdmin



// useEffect(() => {
//   // Récupérer la liste de tous les utilisateurs à partir de Firebase Authentication
//   admin
//     .auth()
//     .listUsers()
//     .then((userRecords) => {
//       const usersList = userRecords.users.map((user) => {
//         return {
//           uid: user.uid,
//           email: user.email,
//           displayName: user.displayName,
//         };
//       });
//       setUsers(usersList);
//     })
//     .catch((error) => {
//       console.error("Erreur lors de la récupération de la liste des utilisateurs:", error);
//     });
// }, []);



   // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }

    // const q = query(collection(db, "user"));

    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.data().email);
    //   // console.log("users emails:", doc.id, doc.id?.email);
    // });

      {/* <table>
          <thead>
            <tr>
              <th>UID</th>
              <th>Email</th>
              <th>Nom d'affichage</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.insta || "-"}</td>
                <td>{user.isAdmin || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table> */}