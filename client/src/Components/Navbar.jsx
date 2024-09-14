import { useEffect, useState,useContext } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Navbar.css'
import GlobalContext from '../Contexts/GlobalContext'
import { API_URL } from '../utils/apiConfig'

const Navbar = () => {
    const {state,setState,start} = useContext(GlobalContext)

    const navigate=useNavigate()

    const handleLogout = () => {
      axios.get(`${API_URL}/auth/logout`)
      .then(res => {
        if(res.data.status){
          setState(false)
          navigate('/login')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  //   useEffect(() => {
  //     console.log('navbar')
  //       axios.get(`${API_URL}/auth/verify`)
  //       .then(res => {
  //         if(res.data.status){
  //           console.log(res.data)
  //           setState(true)
  //         }else{
  //           setState(false)
  //         }
  //       })
  // }, []);

  if(start){
    return null
  }

    return (
      <nav className="navbar">
        <div className="navbar__links navbar__left">
          <Link to="/" className="navbar__logo">Logo</Link>
          <Link to="/profile" className="navbar__link">Profile</Link>
          <Link to="/leaderboard" className="navbar__link">Leaderboard</Link>
          <Link to="/topics" className="navbar__link">Quiz</Link>
        </div>
        <div className="navbar__right">
          {state ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="navbar__link">Login</Link>
              <Link to="/signup" className="navbar__link">Signup</Link>
            </>
          )}
        </div>
      </nav>
    );
}

export default Navbar