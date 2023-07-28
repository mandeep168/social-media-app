import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Account from './components/Account/Account';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from "./Actions/User";
import { useEffect } from 'react';
import NewPost from './components/NewPost/NewPost';


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  const { isAuthenticated } = useSelector((state => state.user));
  
  return (
    <Router>
      { isAuthenticated && <Header /> }

      <Routes>
        <Route path="/" element={ isAuthenticated ? <Home /> : <Login />} />
        <Route path="/account" element={ isAuthenticated ? <Account /> : <Login />} />
        <Route path="/newpost" element={ isAuthenticated ? <NewPost /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
