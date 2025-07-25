import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import {
  AspectRatio,
  Image,
  PasswordInput,
  TextInput,
  Button,
} from "@mantine/core";
import supabase, { getAccount } from "./supabase";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";

function LoginPage() {
  const account = getAccount();
  const navigate = useNavigate();

  const accountForm = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      password: "",
    },
  });

  const [loadingAccount, setLoadingAccount] = useState(false);

  async function submitAccount(data) {
    try {
      setLoadingAccount(true);
      const { email, password } = data;

      const { error: loginError, data: loginData } = await supabase
        .from("Staff-Info")
        .select()
        .eq("Email", email)
        .eq("Password", password);

      if (loginError) {
        window.alert(`Something Error: ${loginError.message}`);
        return;
      }

      if (loginData.length === 0) {
        window.alert("Account Not Found");
        return;
      }

      const json = JSON.stringify(loginData[0]);
      window.localStorage.setItem("data", json);
      navigate("/admin/analytics");
    } catch (error) {
      window.alert(`Something Error: ${error.toString()}`);
    } finally {
      setLoadingAccount(false);
    }
  }

  if (account) {
    return <Navigate to='/admin/analytics' />;
  }

  return (
    <div className='w-full h-screen'>
      <div className='bg-black flex items-center justify-center pb-4'>
        <Link to='/'>
          <AspectRatio>
            <Image
              h='100%'
              src='../Picture/Admin-Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
        </Link>
      </div>

      <div className='w-full flex items-center justify-center h-[calc(100%-10rem)]'>
        <div className='login-box'>
          <p className='text-xl font-black'>Log In Account</p>
          <hr />
          <form onSubmit={accountForm.onSubmit(submitAccount)}>
            <TextInput
              type='email'
              size='lg'
              label='Email Address'
              placeholder='Enter Email Address'
              {...accountForm.getInputProps("email")}
              required
            />
            <PasswordInput
              required
              label='Password'
              size='lg'
              placeholder='Enter Password'
              {...accountForm.getInputProps("password")}
            />

            <div className='forgot-password'>
              <a href='#'>Forgot Password?</a>
            </div>

            <Button
              type='submit'
              loading={loadingAccount}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
