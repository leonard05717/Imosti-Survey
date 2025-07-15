import React, { useState } from 'react';
import './LoginPage.css';
import { AspectRatio , Image } from '@mantine/core';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');



  return (
    <>
       <div style={{backgroundColor:'black'}}>
      
      <div className='logo' style={{ display: 'flex' }}> 
                <AspectRatio style={{  marginTop: '10px' , marginBottom: '30px'} } ratio={1} flex="0 0 200px" >
                
                <Image 

                h={100} 
                w={300}
                   src="../Picture/Admin-Logo.png"
                  alt="Avatar"
              />
                    </AspectRatio>
                    
                  
          </div>
      </div>

      <div className="container">
        <div className="login-box">
          <h2>Log In Account</h2>
          <hr />
          <form >
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit">Sign In</button>
            
          </form>
        </div>
      </div>

      
    </>
  );
}

export default LoginPage