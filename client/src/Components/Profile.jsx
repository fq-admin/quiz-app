import {useState,useEffect} from 'react'
import { API_URL } from '../utils/apiConfig';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import './Profile.css'
import defaultProfileImg from '../assets/image.png'
const Profile = () => {
    
    const [score,setScore]=useState(0)
    const [username,setUsername]=useState('')
    const [firstname,setFirstname]=useState('')
    const [lastname,setLastname]=useState('')
    const [email,setEmail]=useState('')
    const [image,setImage]=useState('')
    const [file,setFile]=useState(null)

    const navigate=useNavigate()
    axios.defaults.withCredentials = true
    useEffect(() => {
        axios.get(`${API_URL}/auth/verify`)
        .then(res => {
            if(res.data.status){
              axios.get(`${API_URL}/auth/profile`)
              .then(res=>{
                console.log(res.data)
                setScore(res.data.score)
                setUsername(res.data.username)
                setFirstname(res.data.firstname)
                setLastname(res.data.lastname)
                setEmail(res.data.email)
                setImage(res.data.image)
                console.log(image)
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

    const handleEdit=()=>{
      navigate('/editprofile')
    }

    const handlePass=()=>{
      navigate('/changepass')
    }

    const handleImageUpload = () => {
      if(!file){
        alert('Please select an image')
        return
      }
      
      // e.target.value = null;
      const formData = new FormData();
      formData.append("file", file);
      axios.post(`${API_URL}/auth/upload`, formData)
      .then(res => {
        if(res.data.status){
          console.log(res.data)
          alert('Image uploaded successfully')
          axios.get(`${API_URL}/auth/profile`)
          .then(res=>{
            setImage(res.data.image)
          })
          .catch(error=>{
            console.log(error)
          })
          setFile(null)
        }
        else{
          console.log(res.data)
          alert('Image upload failed') 
        }
      })
      .catch(error => {
        console.log(error)
      })
      // setFile(null)
      
    }

    const handleChange = (e) => {
      // console.log(e.target.files[0])
      if (!e.target.files[0]||!e.target.files[0].type.startsWith('image/')) {
        alert('File should be an image');
        return;
      }
      setFile(e.target.files[0])
      // e.target.files[0] = null;
    }

    const handleRemove = () => {
      if(image===''){
        alert('No image to remove')
        return
      }
      axios.get(`${API_URL}/auth/removeimage`)
      .then(res => {
        if(res.data.status){
          console.log(res.data)
          alert('Image removed successfully')
          setImage('')
        }
        else{
          console.log(res.data)
          alert('Image remove failed') 
        }
      })
      .catch(error => {
        console.log(error)
      })
    }

  return (
    <div className='containerp'>
      <div className='part'>
        <h1>Profile</h1>
        <h3>Username: {username}</h3>
        <h3>Firstname: {firstname}</h3>
        <h3>Email: {email}</h3>
        {lastname===''?null:<h3>Lastname: {lastname}</h3>}
        <h3>Points: {score}</h3>
      </div>
      <div className='part'>
        <button onClick={handleEdit}>edit details</button>
        <br />
        <button onClick={handlePass}>change password</button>
      </div>
      <div className='part pp'>

          {image==='' ? <img src={defaultProfileImg} alt="default profile" />:<img src={`http://localhost:3000/Images/`+image} alt=''/>}
          {/* <form onSubmit={handleImageUpload}> */}
            <input type="file" onChange={(e)=>{handleChange(e)}} />
            <div className='but'>
            <button onClick={handleImageUpload}>Upload Image</button>
            <button onClick={handleRemove}>Remove Image</button>

            </div>
      </div>
    </div>
  );
}

export default Profile