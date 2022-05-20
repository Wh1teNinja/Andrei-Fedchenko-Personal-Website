import "./Login.css";

import { useState } from "react";

function Login({ setJwtToken }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmission = (e) => {
    e.preventDefault();
  };

  return (
    <div className='Login'>
      <form className='Login-form'>
        <h3>Admin Login</h3>
        <div className='input-group'>
          <label htmlFor='login' className='input-group-label'>
            Login:
          </label>
          <input type="text" id='login' placeholder='login' className='input-group-input'/>
        </div>
        <div className='input-group'>
          <label htmlFor='password' className='input-group-label'>
            Password:
          </label>
          <input type="password" id='password' placeholder='password' className='input-group-input'/>
        </div>
        <button className='form-submit-button' onClick={handleFormSubmission}>
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
