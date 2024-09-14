import {useState,useEffect} from "react";
import GlobalContext from "./GlobalContext";
import axios from "axios";
// import Cookies from "js-cookie";
import { API_URL } from "../utils/apiConfig";

// const BASE_URL = "https://localhost:3000/";

const GlobalState = (props) => {
    const [sid,setSid] = useState(-1) 
    const [state, setState] = useState(false)
    const [start, setStart] = useState(false)
    const [life,setLife] = useState(5)
    axios.defaults.withCredentials = true
    useEffect(() => {
        console.log('global state')
          axios.get(`${API_URL}/auth/verify`)
          .then(res => {
            if(res.data.status){
              console.log(res.data)
              setState(true)
            }else{
              setState(false)
            }
          })
    }, []);
    
    return (
        <GlobalContext.Provider value={{sid,setSid,state,setState,start,setStart,life,setLife}}>
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalState;