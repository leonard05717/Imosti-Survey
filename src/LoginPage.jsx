import React, { useEffect, useState } from "react";
import './LoginPage.css';
import { AspectRatio ,Alert, Image, ActionIcon, PasswordInput } from '@mantine/core';
import supabase from "./supabase";
import { data, useNavigate } from 'react-router-dom';
import { IconEye, IconInfoCircle } from '@tabler/icons-react';


function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [Account , setaccount] = useState([])
  

  
  const icon = <IconInfoCircle />;

  async function submit() {
    
   const data = Account.find((v) => v.Email === email && v.Role === password && v.Status === "Active");
    if(data){
      window.localStorage.setItem("data" ,JSON.stringify(data))
      navigate("admin")
    }
    else{
      console.log('Account not found')
    }
   
  }

  async function loadData() {
    const { error, data } = await supabase.from("Staff-Info").select("*");
    setaccount(data) 
  }

  useEffect(() => {
    loadData()
    
    const sectionSubscription = supabase
    .channel("realtime:Staff-Info")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "Staff-Info" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setaccount((prev) => [
            payload.new,
            ...prev,
          ]);
        } else if (payload.eventType === "UPDATE") {
          setaccount((prev) =>
            prev.map((item) =>
              item.id === payload.new.id
                ? (payload.new)
                : item
            )
          );
        } else if (payload.eventType === "DELETE") {
          setaccount((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();

    return () => {
      supabase.removeChannel(sectionSubscription)
    }

    
  }, [])
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
            <div>
            <label>Password</label>
            <PasswordInput
                 size="lg"
                 placeholder="Input placeholder"
              />
             
            </div>

            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" onClick={() => {
              submit()
            }}>Sign In</button>
            
          </form>
        </div>
      </div>

      
    </>
  );
}

export default LoginPage