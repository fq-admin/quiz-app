import React, { useState,useContext } from "react";
import "../App.css";
import Axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { API_URL } from "../utils/apiConfig";
import GlobalContext from "../Contexts/GlobalContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {setState}=useContext(GlobalContext)
  const navigate=useNavigate()

  Axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    }).then((response) => {
      if(response.data.status){
        setState(true)
        navigate('/profile')
      }else{
        alert(response.data.message)
      }
    }).catch((error) => {
      console.log(error)
    })
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="**********"
          onChange={(e) => setPassword(e.target.value)}
        />

      </div>

        <button type="submit">Login</button>
        <Link to='/forgotPassword'>Forgot Password?</Link>
        <p>Don't Have an Account?</p><Link to='/signup'>Sign Up</Link>
      </form>
    </div>
  );
};

export default Login;
