import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Signup from './Components/Signup'
import Login from './Components/Login'
import Home from './Components/Home'
import ForgotPassword from './Components/ForgotPassword'
import ResetPassword from './Components/ResetPassword'
import Quiz from './Components/Quiz'
import GlobalState from './Contexts/GlobalState'
import Navbar from './Components/Navbar'
import Profile from './Components/Profile'
import Leaderboard from './Components/Leaderboard'
import Topics from './Components/Topics'
import EditProfile from './Components/EditProfile'
import ChangePass from './Components/ChangePass'


const App = () => {

  return (
    <GlobalState>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/changepass" element={<ChangePass />} />
      </Routes>
    </BrowserRouter>
    </GlobalState>
  )
}

export default App
