import { useState,useContext,useEffect } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/apiConfig";
import GlobalContext from "../Contexts/GlobalContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [errors,setErrors]=useState({})
  const [firstname,setFirstname]=useState('')
  const [lastname,setLastname]=useState('')

  const navigate=useNavigate()
  const {setState}=useContext(GlobalContext)

  useEffect(() => {
    axios.get(`${API_URL}/auth/verify`)
    .then(res => {
        if(res.data.status){
          axios.get(`${API_URL}/auth/score`)
          .then(res=>{
            console.log(res.data)
            setUsername(res.data.username)
            setFirstname(res.data.firstname)
            setLastname(res.data.lastname)
            setEmail(res.data.email)
          })
          .catch(error=>{
            console.log(error)
          })
        }else{
            navigate('/')
        }
        console.log(res)
    })
},[])

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors={}
    if(username.trim()===''){
      validationErrors.username='Username is required'
    }
    if(email.trim()===''){
      validationErrors.email='Email is required'
    }
    setErrors(validationErrors)
    if(Object.keys(validationErrors).length===0){
      axios.post(`${API_URL}/auth/editprofile`, {
        firstname,
        lastname,
        username,
        email,
      }).then((response) => {
        if(response.data.status){
          navigate('/profile')
        }
        else{
          if(response.data.message==='email'){
            alert('Email already exists')
          }else if(response.data.message==='username'){
            alert('Username already exists')
          }
          else{
            alert(response.data.message);
          }
        }
      }).catch((error) => {
        alert("Something went wrong");
        console.log(error)
      })
    }
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Edit Details</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first name">First Name*:</label>
            <input type="text" placeholder="first name" onChange={(e)=>setFirstname(e.target.value)} value={firstname}/>
          </div>
          <div className="form-group">
            <label htmlFor="first name">Last Name:</label>
            <input type="text" placeholder="last name" onChange={(e)=>setLastname(e.target.value)} value={lastname}/>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="username">Username*:</label>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
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
            value={email}
          />
          {errors.email && <span>{errors.email}</span>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Signup;
