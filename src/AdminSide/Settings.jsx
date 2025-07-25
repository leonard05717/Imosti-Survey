import React, { useState } from "react";
import PageContainer from "../components/PageContainer";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Group,
  Title,
  Avatar,
  FileButton,
  Divider,
  Box,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import supabase, { getAccount } from "../supabase";
import { Navigate } from "react-router-dom";

function Settings() {
  const account = getAccount();
  const [file, setFile] = useState(null);

  const accountForm = useForm({
    mode: "controlled",
    initialValues: {
      id: account?.id || 0,
      First_Name: account?.First_Name || "",
      Last_Name: account?.Last_Name || "",
      Email: account?.Email || "",
      Role: account?.Role || "",
      Status: account?.Status || "",
      Contact: account?.Contact || "",
      profile: account?.profile || "",
    },
  });

  // Upload image to Supabase Storage
  async function uploadProfileImage(file, userId) {
    const fileExt = file.name.split(".").pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("profiles") // Make sure you have a bucket called 'profile'
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error("Upload error:", error.message);
      return "";
    }

    const { data: urlData } = supabase.storage
      .from("profile")
      .getPublicUrl(fileName);

    return urlData?.publicUrl || "";
  }

  // Submit handler
  async function saveAccountEventHandler(values) {
    try {
      let profileUrl = values.profile;

      if (file) {
        profileUrl = await uploadProfileImage(file, values.id);
      }

      await supabase
        .from("Staff-Info")
        .update({
          First_Name: values.First_Name,
          Last_Name: values.Last_Name,
          Email: values.Email,
          Role: values.Role,
          Status: values.Status,
          Contact: values.Contact,
          profile: profileUrl,
        })
        .eq("id", values.id);

      alert("Account updated successfully!");
    } catch (error) {
      console.error("Save error:", error.message);
    }
  }

  if (!account) {
    return <Navigate to='/LoginPage' />;
  }

  return (
    <PageContainer title='Settings'>
      <Box className='max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6'>
        <div className='flex items-center justify-center flex-col space-y-2'>
          <Avatar
            size={100}
            radius='xl'
            src={accountForm.values.profile || ""}
            alt='User avatar'
          />
          <FileButton
            onChange={(f) => {
              console.log(f);

              // setFile(f);
            }}
            accept='image/png,image/jpeg'
          >
            {(props) => (
              <Button
                leftSection={<IconUpload size={18} />}
                variant='light'
                {...props}
              >
                Upload new photo
              </Button>
            )}
          </FileButton>
        </div>

        <Divider my='sm' />

        <Title order={4}>Account Information</Title>
        <form
          className='space-y-4'
          onSubmit={accountForm.onSubmit(saveAccountEventHandler)}
        >
          <Group grow>
            <TextInput
              label='First Name'
              required
              placeholder='Enter your first name'
              {...accountForm.getInputProps("First_Name")}
            />
            <TextInput
              label='Last Name'
              required
              placeholder='Enter your last name'
              {...accountForm.getInputProps("Last_Name")}
            />
          </Group>

          <TextInput
            label='Email'
            required
            placeholder='Enter your email'
            {...accountForm.getInputProps("Email")}
          />

          <Group grow>
            <TextInput
              label='Contact Number'
              placeholder='e.g. 09123456789'
              required
              {...accountForm.getInputProps("Contact")}
            />
            <TextInput
              label='Role'
              readOnly
              placeholder='Select role'
              {...accountForm.getInputProps("Role")}
            />
          </Group>

          <Group
            position='right'
            mt='md'
          >
            <Button type='submit'>Save Changes</Button>
          </Group>
        </form>
      </Box>
    </PageContainer>
  );
}

export default Settings;
