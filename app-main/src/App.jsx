

 import { Outlet, Link } from "react-router-dom";
 import app from './firebase'

import {getFirestore, doc, setDoc, getDoc, getDocFromServer,  deleteDoc} from "firebase/firestore"


import {getAuth, GoogleAuthProvider,onAuthStateChanged, signInWithPopup, signOut, } from 'firebase/auth'
import { createMedia } from '@artsy/fresnel'
import 'semantic-ui-css/semantic.min.css'
import PropTypes from 'prop-types'
import React, { Component, useState, useEffect } from 'react'
import { InView } from 'react-intersection-observer'
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
} from 'semantic-ui-react'


const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})


class MobileContainer extends Component {
  state = {}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state

    return (
      <Media as={Sidebar.Pushable} at='mobile'>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item as='a' active>
              Home
            </Menu.Item>
            <Menu.Item as='a'>Work</Menu.Item>
            <Menu.Item as='a'>Company</Menu.Item>
            <Menu.Item as='a'>Careers</Menu.Item>
            <Menu.Item as='a'><Link to="/apimport">Oeuvres</Link></Menu.Item>
            <Menu.Item as='a'>Log in</Menu.Item>
            <Menu.Item as='a'>Sign Up</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment
              inverted
              textAlign='center'
              style={{ minHeight: 350, padding: '1em 0em' }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size='large'>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name='sidebar' />
                  </Menu.Item>
                  <Menu.Item position='right'>
                    <Button as='a' inverted>
                      Log in
                    </Button>
                    {user &&
                      <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
                      Profile
                      </Button>
                    }
                  </Menu.Item>
                </Menu>
              </Container>
              
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

const auth = getAuth(app)
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


const HomepageLayout = () => {

  const fixed = true;
  const [user, setUser] = useState(null)

  
  useEffect(() => onAuthStateChanged (auth, (nextUser) => {
    setUser(nextUser)
    if (nextUser){

    // console.log("updating user data")
    getUserData (nextUser.uid)
  }
  }),[])

  

  async function getUserData(uid){
    const userDoc = await getDocFromServer(doc(db, "user", uid))
    // ==console.log("fetched user data", uid, userDoc.data())
    setUser(currentUser => {
      if (currentUser)
      {
        return {...currentUser, data:userDoc.data()}

      }
      return(currentUser)
    })
  }

  async function handleSignIn () {
    const user= await signInWithPopup(auth,provider)
    const uid= user.user.uid
    const ref = doc(db, `user/${uid}`)
    const snapshot = await getDoc(ref)

    if(!snapshot.exists()) {
      await setDoc(ref, {email: user.user.email, photo: user.user.photoURL })
    }
  }
    //save in bd

  return (
    <div style={{minHeight:"100vh",  display: "flex", flexDirection: "column"}}>
    <Menu
    fixed={fixed ? 'top' : null}
    inverted={!fixed}
    pointing={!fixed}
    secondary={!fixed}
    size='large'
  >
    <Container>
  
  
      {/* <Menu.Item as='div' src="/images/logo.png">
      
    f
  
      </Menu.Item> */}
      <Menu.Item as='a' link href={`/`}>
          <img alt="logo" src='/logo.png' />
        </Menu.Item>
    
      <Menu.Item as='a' link href={`/`} active>
        Home
      </Menu.Item>
      {/* <Menu.Item as='a'>Actualités</Menu.Item> */}
      <Menu.Item as='a' link href={`/apimport`} >Musique</Menu.Item>
      <Menu.Item as='a' link href={"/filmport"}>Films</Menu.Item>
      <Menu.Item as='a' link href={`/Event`} >Evènements</Menu.Item>
      <Menu.Item as='a'link href={"/users"}>Users</Menu.Item>
      
      
      <Menu.Item position='right'>
        <Button as='a' inverted={!fixed} onClick={user ? () => signOut(auth) : () => handleSignIn()}>
          {user ? 'Log out' : 'Log in'}
        </Button>
        
        {user &&
          <Button as={Link} to="/profile" inverted={!fixed}  primary={fixed} style={{ marginLeft: '0.5em' }}>
          Profile
          </Button>
                          
        }
        {user?.data?.isAdmin == true &&  
        <Button color='black' as={Link} to="/admin"  style={{ marginLeft: '0.5em' }}>
        Admin
        </Button>
         }    
        
      </Menu.Item>
    </Container>
  </Menu>

  {/* <ResponsiveContainer> */}
   <div style={{marginTop:"52px", flexGrow :"1"}}> <Outlet context={user}/></div>
  {/* </ResponsiveContainer> */}
  {/* <Segment inverted vertical style={{ padding: '5em 0em',  position:"absolute", bottom:0, marginLeft: "auto", marginRight: "auto"  }}> */}
  
  <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'><Link to="/politique">Politique de Confidentialité</Link></List.Item>                
                <List.Item as='a'><Link to="/mention">Mentions légales</Link></List.Item>
                {/* <List.Item as='a'>Contact Us</List.Item>                
                <List.Item as='a'>Gazebo Plans</List.Item> */}
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Services' />
              <List link inverted>
                <List.Item as='a' link href={`/filmport`}>Films</List.Item>
                
                <List.Item as='a' link href={`/apimport`}>Musique</List.Item>
                <List.Item as='a' link href={`/event`}>Event</List.Item>
               
               
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                
              </Header>
              <p>
              Made by Breda Vincent, Chaouki Younes, Lemasson Maxime, Fironova Daria and Verdel Jules. 
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </div>
)
  }

export default HomepageLayout






/* import { useEffect, useState } from 'react'
import {getAuth, GoogleAuthProvider,onAuthStateChanged, signInWithPopup, signOut, } from 'firebase/auth'
import app from './firebase'
import {getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'
import React from 'react';
import ReactDOM from 'react-dom';
import "bootstrap/dist/css/bootstrap.min.css";


const auth = getAuth();
const provider = new GoogleAuthProvider();
// const getStorage = uploadFile();   ///
const storage = getStorage(app)

function App() {
  const [user, setUser] = useState(null)
  const [fileUpload, setFilleUpload] = useState()
  
  useEffect(() => onAuthStateChanged (auth, (nextUser) => {
    setUser(nextUser)
  }))

  async function uploadFile(){
    const imageRef = ref (storage, 'images/${uploadFile.name}')
    const result = await uploadBytes
    console.log(result)
    const url = await getDownloadURL(imageRef)
    console.log ('url', url)
  }

  <input onChange={handleFileUpload}

  console.log('user', user)
  console.log('file', fileUpload)

  function handleFileUploadChange(event) {
    setFilleUpload(event.target.files[0])
  }

  return (
    <div className='flex flex-col'>
      <div className='text-xl font-sans'> hello </div>
      <button type='button' className='rounded-xl bg-blue p-3' onClick={() => user 
        ? signOut(auth) 
        :signInWithPopup(auth,provider) } >  {user ? 'Sign Out': 'Sign In'} </button> 
      {user &&( <div> 
    
      <button type='button' onClick={handleFileUploadChange} > Choose photo</button>
      <div></div>
      <button type='file' onClick={uploadFile} >Upload</button>
      </div>
      )
      }
<div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Made in Haven</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">About us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contact</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="jumbotron">
        <h1 className="display-4">Welcome to Made in Heaven !</h1>
        <p className="lead">The best algorithm designed or you only.</p>
        <hr className="my-4" />
        <p>News</p>
        <a className="btn btn-primary btn-lg" href="#" role="button">Learn More</a>
      </div>
      <div className="card-deck">
        <div className="card">
          <img src="https://cdn.mos.cms.futurecdn.net/39CUYMP8vJqHAYGVzUghBX.jpg" className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">Frog</h5>
            <p className="card-text">This is a sample card with supporting text below as a natural lead-in to additional content.</p>
            <a href="#" className="btn btn-primary">Learn More</a>
          </div>
        </div>
        <div className="card">
          <img src="https://i.scdn.co/image/ab67706c0000da844bfee7c2a763fb912cb3281e" className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">THEN SOMETHING JUST SNAPPED</h5>
            <p className="card-text">This is a sample card with supporting text below as a natural lead-in to additional content.</p>
            <a href="#" className="btn btn-primary">Learn More</a>
          </div>
        </div>
        <div className="card">
          <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2F9gag.com%2Ftag%2Fanime&psig=AOvVaw3DI5kFGpZ2hO-4p2vzlVGF&ust=1678876632655000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCLCvpfyc2_0CFQAAAAAdAAAAABBY" className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">Anya</h5>
            <p className="card-text">This is a sample card with supporting text below as a natural lead-in to additional content.</p>
            <a href="#" className="btn btn-primary">Learn More</a>
          </div>
        </div>
      </div>
    </div>
    </div>

    
    
  )
}

export default App */



/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

// import { Outlet, Link } from "react-router-dom";
// import app from './firebase'



// import {getAuth, GoogleAuthProvider,onAuthStateChanged, signInWithPopup, signOut, } from 'firebase/auth'
// import { createMedia } from '@artsy/fresnel'
// import 'semantic-ui-css/semantic.min.css'
// import PropTypes from 'prop-types'
// import React, { Component, useState, useEffect } from 'react'
// import { InView } from 'react-intersection-observer'
// import {
//   Button,
//   Container,
//   Divider,
//   Grid,
//   Header,
//   Icon,
//   Image,
//   List,
//   Menu,
//   Segment,
//   Sidebar,
// } from 'semantic-ui-react'
// import Login from "./pages/login";



/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
// class DesktopContainer extends Component {
//   state = {}

//   toggleFixedMenu = (inView) => this.setState({ fixed: !inView })

//   render() {
//     const { children } = this.props
//     const { fixed } = this.state

//     return (
//       // <Media greaterThan='mobile'>
//       //   <InView onChange={this.toggleFixedMenu}>
//           // <Segment
//           //   inverted
//           //   textAlign='center'
//           //   style={{ minHeight: 700, padding: '1em 0em' }}
//           //   vertical
//           // >
//           //   <Menu
//           //     fixed={fixed ? 'top' : null}
//           //     inverted={!fixed}
//           //     pointing={!fixed}
//           //     secondary={!fixed}
//           //     size='large'
//           //   >
//           //     <Container>
//           //       <Menu.Item as='a' active>
//           //         Home
//           //       </Menu.Item>
//           //       <Menu.Item as='a'>Work</Menu.Item>
//           //       <Menu.Item as='a'>Company</Menu.Item>
//           //       <Menu.Item as='a'>Careers</Menu.Item>
//           //       <Menu.Item position='right'>
//           //         <Button as='a' inverted={!fixed}>
//           //           Log in
//           //         </Button>
//           //         <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
//           //           Sign Up
//           //         </Button>
//           //       </Menu.Item>
//           //     </Container>
//           //   </Menu>
        
//           // </Segment>
//       //   </InView>

//       //   {children}
//       // </Media>
//     // )
//   // }
// }

// DesktopContainer.propTypes = {
//   children: PropTypes.node,
// }


