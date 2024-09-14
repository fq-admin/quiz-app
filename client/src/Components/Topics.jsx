import {useState,useEffect,useContext} from 'react'
import { API_URL } from '../utils/apiConfig';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import GlobalContext from '../Contexts/GlobalContext'
import './Topics.css'

function Topics() {
    const {sid,setSid} = useContext(GlobalContext)
    const [topics, setTopics] = useState([]);
    const [subtopics, setSubtopics] = useState([]);
    const [topicSelected, setTopicSelected] = useState(-1);

    const navigate=useNavigate()
    axios.defaults.withCredentials = true
    useEffect(() => {
        axios.get(`${API_URL}/auth/verify`)
        .then(res => {
            if(res.data.status){
              axios.get('http://localhost:1337/api/topics?populate=subtopics')
              .then(response => {
                setTopics(response.data.data);
                console.log(response.data);
              })
              .catch(error => {
                console.error('There was an error fetching the topics!', error);
              });
            }else{
                navigate('/')
            }
            console.log(res)
        })
    },[])

    const handleTopicClick = (i,id) => {
        const topic = topics[i];
        setTopicSelected(id);
        // console.log(topic.attributes.subtopics.data);
        setSubtopics(topic.attributes.subtopics.data)
      };
    
      const handleSub=(id)=>{
        setSid(id)
        console.log(id)
        navigate('/quiz')
      }
  return (
    <div className='contains'>
            <h1>Topics</h1>
            {topics.map((topic,i) => (
              <div key={topic.id}>
                <div onClick={() => handleTopicClick(i,topic.id)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  {topic.attributes.name}
                </div>
                {topic.id===topicSelected?(
                  <ul>
                    {subtopics.map(subtopic => (
                      <li key={subtopic.id} onClick={()=>handleSub(subtopic.id)}>
                      {subtopic.attributes.name}
                      </li>
                    ))}
                  </ul>
                ):null}
              </div>
            ))}
        </div>
  )
}

export default Topics