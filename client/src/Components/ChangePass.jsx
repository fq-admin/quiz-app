import { useState,useEffect } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/apiConfig";

const ChangePass = () => {
  const [errors,setErrors]=useState({})
  const [oldpassword,setOldpassword]=useState('')
    const [newpassword,setNewpassword]=useState('')

  const navigate=useNavigate()

  useEffect(() => {
    axios.get(`${API_URL}/auth/verify`)
    .then(res => {
        if(res.data.status===false){
            navigate('/')
        }
        console.log(res)
    })
},[])

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors={}
    setErrors(validationErrors)
    if(oldpassword.trim()===''){
        validationErrors.oldpassword='old password is required'
      }
    if(newpassword.trim()===''){
        validationErrors.newpassword='new password is required'
      }
    if(Object.keys(validationErrors).length===0){
      axios.post(`${API_URL}/auth/changepass`, {
        oldpassword,
        newpassword,
      }).then((response) => {
        if(response.data.status){
          alert(response.data.message)
          navigate('/profile')
        }
        else{
          alert(response.data.message)
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
        <h2>Change Password</h2>
        <div className="form-group">
          <label htmlFor="username">Old Password*:</label>
          <input
            type="password"
            placeholder="old password"
            onChange={(e) => setOldpassword(e.target.value)}
          />
          {errors.oldpassword && <span>{errors.oldpassword}</span>}
        </div>
          
        <div className="form-group">
          <label htmlFor="email">New Password*:</label>
          <input
            type="password"
            placeholder="new password"
            onChange={(e) => setNewpassword(e.target.value)}
          />
          {errors.newpassword && <span>{errors.newpassword}</span>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ChangePass;
