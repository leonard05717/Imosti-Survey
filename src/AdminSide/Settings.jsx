import React, { useEffect } from "react";
import PageContainer from "../components/PageContainer";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Group,
  Select,
  Title,
  Avatar,
  FileButton,
  Divider,
  Box,
} from "@mantine/core";
import { IconUpload, IconUser } from "@tabler/icons-react";
import supabase from "../supabase";
import { Navigate } from "react-router-dom";
import { getAccount } from "../main";

function Settings() {
  const account = getAccount();

  const accountForm = useForm({
    mode: "controlled",
    initialValues: {
      First_Name: account?.First_Name || "",
      Last_Name: account?.Last_Name || "",
      Email: account?.Email || "",
      Role: account?.Role || "",
      Status: account?.Status || "",
      Contact: account?.Contact || "",
      profile: account?.profile || "",
    },
  });

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
            src={accountForm.values.profile || undefined}
            alt='User avatar'
          />
          <FileButton
            onChange={(file) => {
              /* handle upload */
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
          onSubmit={accountForm.onSubmit((values) => console.log(values))}
        >
          <Group grow>
            <TextInput
              label='First Name'
              placeholder='Enter your first name'
              {...accountForm.getInputProps("First_Name")}
            />
            <TextInput
              label='Last Name'
              placeholder='Enter your last name'
              {...accountForm.getInputProps("Last_Name")}
            />
          </Group>

          <TextInput
            label='Email'
            placeholder='Enter your email'
            {...accountForm.getInputProps("Email")}
          />

          <Group grow>
            <TextInput
              label='Contact Number'
              placeholder='e.g. 09123456789'
              {...accountForm.getInputProps("Contact")}
            />
            <Select
              label='Status'
              placeholder='Select status'
              data={["Active", "Inactive"]}
              {...accountForm.getInputProps("Status")}
            />
          </Group>

          <Select
            label='Role'
            placeholder='Select role'
            data={["Admin", "Instructor", "Student"]}
            {...accountForm.getInputProps("Role")}
          />

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
