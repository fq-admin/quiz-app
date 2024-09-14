import { useState } from "react";
import "../App.css";
import Axios from "axios";
import { useNavigate} from "react-router-dom";
import { API_URL } from "../utils/apiConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    }).then((response) => {
      if(response.data.status){
        console.log(response.data.message)
        alert("Password reset link sent to your email")
        navigate('/login')
      }
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
      

        <label htmlFor="email">Email</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />


        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
