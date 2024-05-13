import {useState} from "react";
import Dashboard from "./components/Dashboard";
import LoginSignup from "./components/LoginSignup";


function App()
{
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const dash = <Dashboard setIsLoggedIn={setIsLoggedIn}></Dashboard>
  const login = <LoginSignup setIsLoggedIn ={setIsLoggedIn}></LoginSignup>
  return(isLoggedIn ? dash : login)
}
export default App
