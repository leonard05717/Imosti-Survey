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
  Loader,
  PasswordInput,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import supabase, { getAccount } from "../supabase";
import { Navigate } from "react-router-dom";

function Settings() {
  const account = getAccount();
  const [img, setImg] = useState(account?.profile || "");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);

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
      Password: "",
    },
  });

  async function uploadProfileImage(file, userId) {
    const fileExt = file.name.split(".").pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error("Upload error:", error.message);
      return "";
    }

    const { data: urlData } = supabase.storage
      .from("profiles")
      .getPublicUrl(fileName);

    return urlData?.publicUrl || "";
  }

  async function saveAccountEventHandler(values) {
    try {
      setLoadingUpdate(true);

      console.log(values);

      const { data: updatedData } = await supabase
        .from("Staff-Info")
        .update({
          First_Name: values.First_Name,
          Last_Name: values.Last_Name,
          Email: values.Email,
          Role: values.Role,
          Status: values.Status,
          Contact: values.Contact,
          Password: values.Password ? values.Password : undefined,
        })
        .eq("id", values.id)
        .select()
        .single();

      accountForm.setFieldValue("Password", "");
      localStorage.setItem("data", JSON.stringify(updatedData));
      window.alert("Update Account Successfully!");
    } catch (error) {
      window.alert("Save error:", error.message);
    } finally {
      setLoadingUpdate(false);
    }
  }

  return (
    <PageContainer title='Settings'>
      <Box className='max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6'>
        <div className='flex items-center justify-center flex-col space-y-2'>
          <div className='relative'>
            <div className='absolute z-[1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              {loadingImg && <Loader />}
            </div>
            <Avatar
              size={100}
              radius='2'
              src={img}
              alt='User avatar'
              style={{ border: "1px solid #0005" }}
            />
          </div>
          <FileButton
            onChange={async (f) => {
              if (!account) {
                window.alert("No Account Found");
                return;
              }

              try {
                setLoadingImg(true);
                const url = await uploadProfileImage(f, account.id);
                let newAccount = {
                  ...account,
                  profile: url,
                };
                await supabase
                  .from("Staff-Info")
                  .update({
                    profile: url,
                  })
                  .eq("id", account.id);
                localStorage.setItem("data", JSON.stringify(newAccount));
                setImg(url);
              } catch (err) {
                console.error(err);
              } finally {
                setLoadingImg(false);
              }
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
          <PasswordInput
            label='New Password'
            placeholder='Enter New Password'
            {...accountForm.getInputProps("Password")}
          />

          <Group
            position='right'
            mt='md'
          >
            <Button
              loading={loadingUpdate}
              type='submit'
            >
              Save Changes
            </Button>
          </Group>
        </form>
      </Box>
    </PageContainer>
  );
}

export default Settings;
