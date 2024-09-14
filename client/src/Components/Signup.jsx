import React, { useState,useContext } from "react";
import "../App.css";
import Axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { API_URL } from "../utils/apiConfig";
import GlobalContext from "../Contexts/GlobalContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors,setErrors]=useState({})
  const [firstname,setFirstname]=useState('')
  const [lastname,setLastname]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')

  const navigate=useNavigate()
  const {setState}=useContext(GlobalContext)

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors={}
    if(firstname.trim()===''){
      validationErrors.firstname='First Name is required'
    }
    if(username.trim()===''){
      validationErrors.username='Username is required'
    }
    if(email.trim()===''){
      validationErrors.email='Email is required'
    }
    if(password.trim()===''){
      validationErrors.password='Password is required'
    }
    if(confirmPassword.trim()===''||confirmPassword!==password){
      validationErrors.confirmPassword='Passwords do not match'
    }
    setErrors(validationErrors)
    if(Object.keys(validationErrors).length===0){
      Axios.post(`${API_URL}/auth/signup`, {
        firstname,
        lastname,
        username,
        email,
        password,
      }).then((response) => {
        if(response.data.status){
          setState(true)
          alert("Form Submitted Successfully");
          navigate('/login')
        }
        else{
          if(response.data.message==='email'){
            alert('Email already exists')
          }else{
            alert('Username already exists')
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first name">First Name*:</label>
            <input type="text" placeholder="first name" onChange={(e)=>setFirstname(e.target.value)}/>
            {errors.firstname && <span>{errors.firstname}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="first name">Last Name:</label>
            <input type="text" placeholder="last name" onChange={(e)=>setLastname(e.target.value)}/>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="username">Username*:</label>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          {errors.username && <span>{errors.username}</span>}
        </div>
          
        <div className="form-group">
          <label htmlFor="email">Email*:</label>
          <input
            type="email"
            autoComplete="off"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span>{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password*:</label>
          <input
            type="password"
            placeholder="**********"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span>{errors.password}</span>}
        </div>

        <div className="form-group">
          <label >Confirm Password*:</label>
          <input
            type="password"
            placeholder="**********"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </div>

        <button type="submit">Sign Up</button>
        <p>Have an Account?</p><Link to='/login'>Login</Link>
      </form>
    </div>
  );
};

export default Signup;
