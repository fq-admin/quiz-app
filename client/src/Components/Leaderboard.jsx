import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../utils/apiConfig'
import './Leaderboard.css'

const Leaderboard = () => {
    const [scores,setScores]=useState([])
    

    const navigate=useNavigate()
    axios.defaults.withCredentials = true
    useEffect(() => {
        axios.get(`${API_URL}/auth/verify`)
        .then(res => {
            if(res.data.status){
              axios.get(`${API_URL}/auth/scores`)
              .then(res=>{
                setScores(res.data)
                console.log(res.data)
              })
            }else{
                navigate('/')
            }
        })
    },[])
  return (
    <div className='containerd'>
      <div>
        <h1>leaderboard</h1>
        <ol>
            {scores.sort((a, b) => b.score - a.score).map((score, i) => (
              <li key={i}>
                <h3>{score.username} : {score.score}</h3>
              </li>
            ))}
          </ol>
      </div>
    </div>
  )
}

export default Leaderboard