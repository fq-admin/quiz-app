import axios from 'axios'
import {useContext} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../utils/apiConfig'
import GlobalContext from '../Contexts/GlobalContext'

const Home = () => {
  const {state,setState} = useContext(GlobalContext)
  const navigate=useNavigate()
  axios.defaults.withCredentials = true
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
  const handleLogin = () => {
    navigate('/login')
  }
  const handleSignup = () => {
    navigate('/signup')
  }
  const handleProfile = () => {
    navigate('/profile')
  }
  return (
    <div className='sign-up-container'>
    <div className='sign-up-form'>
      Home
      <button onClick={handleProfile}>Profile</button>
      <br />
      <br />
      <button onClick={handleLogout}>Logout</button>
      <br />
      <br />
      <button onClick={handleLogin}>Login</button>
      <br />
      <br />
      <button onClick={handleSignup}>Signup</button>
      
    </div>
    </div>
  )
}

export default Home