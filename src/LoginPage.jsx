import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import {
  AspectRatio,
  Alert,
  Image,
  ActionIcon,
  PasswordInput,
  TextInput,
  Button,
} from "@mantine/core";
import supabase from "./supabase";
import { data, useNavigate } from "react-router-dom";
import { IconEye, IconInfoCircle } from "@tabler/icons-react";
import { useForm } from "@mantine/form";

function LoginPage() {
  const navigate = useNavigate();

  const accountForm = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      password: "",
    },
  });

  const [loadingAccount, setLoadingAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [Account, setaccount] = useState([]);

  const icon = <IconInfoCircle />;

  async function submit() {
    // const data = Account.find(
    //   (v) => v.Email === email && v.Role === password && v.Status === "Active",
    // );
    // if (data) {
    //   console.log("sample1");
    // } else {
    //   console.log("Account not found");
    // }
  }

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
        alert(`Something Error: ${loginError.message}`);
        return;
      }

      if (loginData.length === 0) {
        alert("Account Not Found");
        return;
      }

      const json = JSON.stringify(loginData[0]);
      window.localStorage.setItem("data", json);
      navigate("/admin2/analytics");
    } catch (error) {
      window.alert(`Something Error: ${error.toString()}`);
    } finally {
      setLoadingAccount(false);
    }
  }

  async function loadData() {
    const { error, data } = await supabase.from("Staff-Info").select("*");
    setaccount(data);
  }

  useEffect(() => {
    loadData();

    const sectionSubscription = supabase
      .channel("realtime:Staff-Info")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Staff-Info" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setaccount((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setaccount((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setaccount((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sectionSubscription);
    };
  }, []);
  return (
    <>
      <div style={{ backgroundColor: "black" }}>
        <div
          className='logo'
          style={{ display: "flex" }}
        >
          <AspectRatio
            style={{ marginTop: "10px", marginBottom: "30px" }}
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={100}
              w={300}
              src='../Picture/Admin-Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
        </div>
      </div>

      <div className='container'>
        <div className='login-box'>
          <h2>Log In Account</h2>
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
    </>
  );
}

export default LoginPage;
