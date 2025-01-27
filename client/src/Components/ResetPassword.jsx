import { useState } from "react";
import "../App.css";
import Axios from "axios";
import { useNavigate,useParams } from "react-router-dom";
import { API_URL } from "../utils/apiConfig";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const {token}= useParams()

  const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`${API_URL}/auth/reset-password/${token}`, {
      password,
    }).then((response) => {
      if(response.data.status){
        navigate('/login')
      }
    }).catch((error) => {
      console.log(error)
    })
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          placeholder="**********"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Reset</button>
      </form>
    </div>
  );
};

export default ResetPassword;
