import {useEffect,useRef,useState,useContext,useCallback} from 'react'
import axios from 'axios'
import './Quiz.css'
import GlobalContext from '../Contexts/GlobalContext'
import { API_URL } from '../utils/apiConfig';
import { Link,useNavigate } from 'react-router-dom';

function Quiz() {
  const Navigate=useNavigate()
  const {sid,setStart,start,life,setLife} = useContext(GlobalContext)
  const [did,setDid] = useState(1)
    const [index, setIndex] = useState(0)
    // const [question,setQuestion] = useState(null)
    const [questions, setQuestions] = useState([]);
    const [lock,setLock] = useState(0)
    const [score,setScore] = useState(0)
    const [result,setResult] = useState(false)
    const [ans,setAns] = useState(-1)
    const [seconds,setSeconds] = useState(8)
    
    
    const ref=useRef()
    const option1=useRef(null)
    const option2=useRef(null)
    const option3=useRef(null)
    const option4=useRef(null)

    const option_array=[option1,option2,option3,option4]

    useEffect(()=>{
      axios.get(`${API_URL}/auth/verify`)
      .then(res => {
          if(!res.data.status){
            Navigate('/')
          }
      })
      .catch(error=>{
        console.log(error)
      })
      if(sid===-1){
        Navigate('/topics')
      }
    },[])

    
  const handleLevel=(e)=>{
    const id=e.target.value
    console.log(e.target.value)
    setDid(id)
  }

    const handleReload=useCallback((e)=>{
      e.preventDefault()
      e.returnValue=''
    },[])

    const handleBack=useCallback((e)=>{
      e.preventDefault()
      const confirm=window.confirm('Are you sure you want to leave the page?')
      if(confirm){
        // window.removeEventListener('beforeunload', handleReload,true)
        // window.removeEventListener('popstate',handleBack,true)
        setStart(false)
        Navigate('/topics')
      }
      else{
        e.preventDefault()
        
      }
    },[])

    // if(ref?.current){
    //   clearInterval(ref.current)
    // }

    const checkAns=(e,option)=>{
        if(lock===0){
            setAns(option)
            option_array[option-1].current.classList.add('selected')
        }
    }
    const change=()=>{
      // console.log(seconds)
      // setSeconds((s)=>{
      //   if(s>0)return s-1
      //   else return 0

      // })
      setSeconds((s)=>s-1)
    }



    
    const next=()=>{
        if(lock===2){
            if(life===0){
                setResult(true)
            }

            if(index+1 === questions.length){
                setResult(true)
                axios.post(`${API_URL}/auth/score`, {
                  score,
                });
                // window.removeEventListener('beforeunload', handleReload,true);
                // window.removeEventListener('popstate',handleBack,true)
                setStart(false)
                return
            }
            setLock(0)
            setIndex(index+1)
            setAns(-1)
            setSeconds(8)
            ref.current=setInterval(change,1000)
            option_array.forEach((option)=>{
              option.current.classList.remove('correct')
              option.current.classList.remove('wrong')
            })
          }
          else if(ans===-1){
            alert('Please select an option')
          }
          else if(ans!=-1){
            clearInterval(ref.current)
            // console.log(seconds+"next")
            if(ans === parseInt(questions[index].attributes.answer)){
                setScore(score+1)
                option_array[ans-1].current.classList.remove('selected')
                option_array[ans-1].current.classList.add('correct')
            }
            else{
                option_array[ans-1].current.classList.remove('selected')
                option_array[ans-1].current.classList.add('wrong')
                option_array[parseInt(questions[index].attributes.answer)-1].current.classList.add('correct')
                setLife(life-1)
                console.log(life)
            }
            setLock(2)
            
        }
    }

  const handleStart=()=>{
    if(sid===-1){
      Navigate('/topics')
    }
    // window.addEventListener('beforeunload', handleReload,true);
    // window.addEventListener('popstate',handleBack,true)
    // ref.current=setInterval(change,1000)
    setStart(true)
    ref.current=setInterval(change,1000)
    console.log(sid)
    axios.get(`http://localhost:1337/api/questions?filters[subtopic][id][$eq]=${sid}&filters[level][id][$eq]=${did}`)
    .then(response => {
      console.log(response.data.data)
      const d = response.data.data;
      setQuestions(d);
    })
    .catch(error => {
      console.error('There was an error fetching the topics!', error);
    });
  }

  if(questions.length==0) return(
    <div>
      <h3>set difficulty</h3>
      <select onChange={handleLevel}>
        <option value={1}>easy</option>
        <option value={2}>medium</option>
        <option value={3}>hard</option>
      </select>
      <button onClick={handleStart}>Start Quiz</button>
    </div>
  )

  // if(seconds===0){
  //   console.log("timesup")
  //   clearInterval(ref.current)
  //   console.log(ref.current)
    

  // }

  const fun=()=>{
    // console.log(seconds)
    if(seconds===0){
      clearInterval(ref.current)
      setSeconds((s)=>s-1)
      option_array[parseInt(questions[index].attributes.answer)-1].current.classList.add('correct')
      setLock((l)=>l+2)
      setLife(life-1)
      return 0
    }
    if(seconds<0)return 0
    return seconds
  }

  return (
    <div className='container'>
        {/* <h1>Quiz App</h1> */}
        <hr />
        {result?<>
            <h2>You Scored {score} out of {questions.length}</h2>
            <Link className='link' to='/profile'>Home</Link>
        </>:<>
        <h2>{fun()}</h2>
        <h3>{index+1}. {questions[index].attributes.q}</h3>
        <ul>
            <li ref={option1} onClick={(e)=>{checkAns(e,1)}}>{questions[index].attributes.option1}</li>
            <li ref={option2} onClick={(e)=>{checkAns(e,2)}}>{questions[index].attributes.option2}</li>
            <li ref={option3} onClick={(e)=>{checkAns(e,3)}}>{questions[index].attributes.option3}</li>
            <li ref={option4} onClick={(e)=>{checkAns(e,4)}}>{questions[index].attributes.option4}</li>
        </ul>
        <button onClick={next}>Next</button>
        {/* <button onClick={()=>{window.removeEventListener('beforeunload', handleReload,true)}}>Quit</button> */}
        <div className='index'>{index+1} of {questions.length} questions</div>
        </>
        }
    </div>
  )
}

export default Quiz