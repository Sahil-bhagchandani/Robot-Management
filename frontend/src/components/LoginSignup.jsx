import { useState , useEffect} from "react";
import PropTypes from 'prop-types'


function LoginSignup({ setIsLoggedIn }) {

  const [mode, setMode] = useState("login");
  const handleModeChange = () => {
     setMode(mode === "login" ? "signup" : "login");
  }

  // Logic for signup
  const [name,setname] = useState("");
  const [password,setpassword] = useState("");
  const handleSignup = async () => {
  
    let result = await fetch('http://localhost:5000/signup',{
        method:'post',
        body:JSON.stringify({name,password}),
        headers:{
            'Content-Type':'application/json'
        },
    });
    result = await result.json();
    console.log(result);
    
    if(result)
        {
            localStorage.setItem("user",JSON.stringify(result))
            setIsLoggedIn(true);
        }
  };

  // Logic for login
  const [username,setusername] = useState("");
  const [pass,setpass] = useState("");
  const handleLogin = async () => {
    console.log(username,pass)
    let result = await fetch('http://localhost:5000/login', {
        method:'post',
        body:JSON.stringify({username,pass}),
        headers:{
            'Content-Type':'application/json'
        }    
    });
    result = await result.json();
    console.log(result);
    if(result){
        localStorage.setItem("user",JSON.stringify(result));
        setIsLoggedIn(true);

    }
    else{
        throw new Error("Please Enter Correct Login Details!")
    }
  };


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
    }
  }, );

  
  return (
    <div className="login-signup-modal">
      <div className="bg-img"></div>
      <div className="wrapper">
      <div className="switch-container">
          <span className="mode-label">Login</span>
          <label className="switch">
            <input type="checkbox" onClick={handleModeChange} />
            <span className="circle"></span>
          </label>
          <span className="mode-label">Signup</span>
        </div>
        <div className="card-container">
        {mode === "login" ? (
          <div className="boxL">
            <div className="title">Login</div>
            <div className="form"></div>
            {/* Login form fields */}
            <input className="inputfield" type="text" placeholder="Username" value={username} onChange={(e)=>setusername(e.target.value)}/>
            <input className="inputfield"type="password" placeholder="Password" value={pass} onChange={(e)=>setpass(e.target.value)}/>
            <button className="buttonfield" onClick={handleLogin}>Login</button>
          </div>
        ) : (
          <div className="boxS">
            <div className="title">Signup</div>
            {/* Signup form fields */}
            <div className="form"></div>
            <input className="inputfield" type="text" placeholder="Username" value={name} onChange={(e)=>setname(e.target.value)}/>
            <input className="inputfield" type="password" placeholder="Password" value={password} onChange={(e)=>setpassword(e.target.value)}/>
            <button className="buttonfield" onClick={handleSignup}>Signup</button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}


LoginSignup.propTypes = {
    setIsLoggedIn: PropTypes.func.isRequired, // Specify the type and mark it as required
  };


export default LoginSignup;
