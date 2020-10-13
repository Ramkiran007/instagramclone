import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/Navbar'
import "./App.css"

import {BrowserRouter, Switch, Route, useHistory} from 'react-router-dom';
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/NewPassword'
import UserProfile from './components/screens/UserProfile'
import CreatePost from './components/screens/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import Error from './components/screens/Error' 
import Search from './components/screens/Search'
import SearchResult from './components/screens/SearchResult'

export const UserContext = createContext()



const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset'))
           history.push('/signin')
    }
  },[]) 
   return (
    <>
    <Switch>
   
      <Route exact path = "/" component={Home}/>
      <Route  path ="/signup" component={Signup}/>
      <Route  path ="/signin" component={Signin}/>
      <Route exact path ="/profile" component={Profile}/>
      <Route path="/profile/:userid" component={UserProfile}/>
      <Route exact path ="/reset" component={Reset}/>
      <Route  path ="/reset/:token" component={NewPassword}/>
      <Route  path = "/create"  component ={CreatePost}></Route>
      <Route path = "/search"   component = {Search}></Route>

      <Route exact component ={Error}/>

    </Switch>
    </>
  );
}




function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routing />
      
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;