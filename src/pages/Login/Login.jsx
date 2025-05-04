import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import {login, signup} from '../../firebase'


function Login() {
  const [loading, setLoading] = useState(false);
  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user_auth = async (event)=>{
    event.preventDefault();
    if(signState==="Sign In"){
      await login(email, password);
    }else{
      await signup(name, email, password);
    }
    setLoading(false);
  }

  return (
    <div className="login">
      <img src={logo} alt="" className="login-logo" />
      <div className="login-form">
        <h1>{signState}</h1>
        <form>
          {signState === "Sign Up" ? (
            <input value={name } onChange={(e)=>{setName(e.target.value)}} type="text" placeholder="your name" />
          ) : (
            <></>
          )}

          <input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Email" />
          <input value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="password" />
          <button onClick={user_auth} type='submit'>{signState}</button>
        </form>
        <div className="form-switch">
          {signState === "Sign In" ? 
          <p>New to Account? <span onClick={()=>{setSignState("Sign Up")}}>Sign Up Now</span></p>
          :<p>Already have account? <span onClick={()=>{setSignState("Sign In")}}>Sign In Now</span></p>
}
        </div>
      </div>
    </div>
  );
}
export default Login;
