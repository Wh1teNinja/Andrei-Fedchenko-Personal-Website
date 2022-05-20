import "./Login.css";

import { useState } from "react";
import { useMutation } from "@apollo/client";

import { login as loginMutation } from "./queries/queries";

function Login({ setJwtToken }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser] = useMutation(loginMutation);

  const handleFormSubmission = (e) => {
    e.preventDefault();

    loginUser({
      context: {
        header: {
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
        },
      },
      variables: {
        login,
        password,
      },
    })
      .then(({ data }) => {
        setJwtToken(data.login);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='Login'>
      <form className='Login-form'>
        <h3>Admin Login</h3>
        <div className='input-group'>
          <label htmlFor='login' className='input-group-label'>
            Login:
          </label>
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            type='text'
            id='login'
            placeholder='login'
            className='input-group-input'
          />
        </div>
        <div className='input-group'>
          <label htmlFor='password' className='input-group-label'>
            Password:
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            id='password'
            placeholder='password'
            className='input-group-input'
          />
        </div>
        <button className='form-submit-button' onClick={handleFormSubmission}>
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
