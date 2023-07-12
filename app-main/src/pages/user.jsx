import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Icon, Label, Menu, Table } from 'semantic-ui-react'
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { getDatabase, ref, orderByValue, limitToLast } from "firebase/database";
import app from "../firebase"
import { useOutletContext, useParams } from "react-router-dom"
import { getAuth } from "firebase/auth";

const db = getFirestore(app);
const auth = getAuth();

async function fetchUser() {
const querySnapshot = await getDocs(query(collection(db, "user"), where ("email", "==", {id}) ));
}
const TableAdmin= () => {
  const {id} = useParams ()

  
  // async function fetchUser() {

    // const docRef = doc(db, "user");
    
  //   const querySnapshot = await getDocs(query(collection(db, "user"), where ("isPublique", "==", true) ));
    
    
  //   const allUsers = querySnapshot.docs.map(doc => {
  //     const newUser = doc.data()
  //     newUser.id = doc.id
  //     return newUser
  //     //({id: doc.id, ...doc.data()}))
      
  //   })
  //   console.log("users", allUsers)
  //   setUsers (allUsers)   
  // } 
  // useEffect(() => {  
  //   fetchUser();  
  // }, [])
  var t =JSON.parse(sessionStorage.getItem("users"));
  var users_array= t;
  console.log("users", users_array);

  // const [users, setUsers] = useState([]);

  // async function fetchUsers() {
  //   const {id} = useParams ()
    
   
  //     const docRef = doc(db, "user", id);
  //     const docSnap = await getDoc(docRef);
  
  //     if (docSnap.exists()) {
  //       console.log("Document data:", docSnap.data());
  //     } else {
  //       // docSnap.data() will be undefined in this case
  //       console.log("No such document!");
  //   }

       
  
  // }
  //   useEffect(() => {  
  //     fetchUsers();  
  //   }, [])
 
  async function fetchUsers() {
    const querySnapshot = await getDoc(query(collection(db, "user",id)));
    const allUsers = querySnapshot.docs.map(doc => {
      const newUser = doc.data()
      newUser.id = doc.id
      return newUser
      //({id: doc.id, ...doc.data()}))
      
    })
    console.log("user", allUsers)
    setUser (allUsers)
  }

  return (


      <div>
        <h1> Page of user {id}</h1>

 
      </div>

        
  )
}

export default TableAdmin

