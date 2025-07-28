import PageContainer from "../components/PageContainer";
import {
  ActionIcon,
  AspectRatio,
  Badge,
  Button,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  NumberInput,
  PasswordInput,
  ScrollAreaAutosize,
  Table,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import supabase from "../supabase";
import { useDisclosure } from "@mantine/hooks";
import { toProper } from "../helpers/helper";

const DEFAULT_PASSWORD = "123456789";

function Staff() {
  const [staffs, setStaffs] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [selectedUpdateId, setSelectedUpdateId] = useState(null);
  const [modalState, { open: openModalState, close: closeModalState }] =
    useDisclosure(false);
  const [
    updateStatusState,
    { open: openUpdateStatusState, close: closeUpdateStatusState },
  ] = useDisclosure(false);
  const staffForm = useForm({
    mode: "controlled",
    initialValues: {
      id: 0,
      First_Name: "",
      Last_Name: "",
      Email: "",
      Role: "",
      Contact: "",
      Password: "",
      ConfirmPassword: "",
      type: "add",
    },
    validate: {
      ConfirmPassword: (value, values) => {
        if (value !== values.Password) {
          return "Confirm Password should match the Password";
        }
        return null;
      },
    },
  });

  async function submitStaffAccount(data) {
    try {
      setSubmitLoading(true);
      if (data.type === "add") {
        // add staff
        const { error: insertError } = await supabase
          .from("Staff-Info")
          .insert({
            First_Name: data.First_Name,
            Last_Name: data.Last_Name,
            Email: data.Email,
            Role: data.Role,
            Contact: data.Contact,
            Password: data.Password || DEFAULT_PASSWORD,
            Status: "Active",
          });
        if (insertError) {
          window.alert(`Something Error: ${insertError.message}`);
          return;
        }
        await fetchData();
        window.alert("Add New Account Successfully!");
        staffForm.reset();
      } else {
        const { error: updateError } = await supabase
          .from("Staff-Info")
          .update({
            First_Name: data.First_Name,
            Last_Name: data.Last_Name,
            Email: data.Email,
            Role: data.Role,
            Contact: data.Contact,
            Password: data.Password ? data.Password : undefined,
          })
          .eq("id", data.id);
        if (updateError) {
          window.alert(`Something Error: ${updateError.message}`);
          return;
        }
        await fetchData();
        window.alert("Add Update Account Successfully!");
        closeModalState();
      }
    } catch (error) {
      window.alert(error.toString());
    } finally {
      setSubmitLoading(false);
    }
  }

  async function setStatusEvent(status) {
    try {
      await supabase
        .from("Staff-Info")
        .update({
          Status: status,
        })
        .eq("id", selectedUpdateId);
      await fetchData();
      closeUpdateStatusState();
    } catch (error) {
      window.alert(error.toString());
    }
  }

  async function fetchData() {
    const staffData = (
      await supabase
        .from("Staff-Info")
        .select()
        .order("id", { ascending: false })
    ).data;
    setStaffs(staffData);
    setLoadingPage(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      title='Staff'
      outsideChildren={
        <LoadingOverlay
          loaderProps={{ type: "dots" }}
          visible={loadingPage}
        />
      }
      rightSection={
        <Button
          size='xs'
          onClick={() => {
            staffForm.reset();
            openModalState();
          }}
          rightSection={<IconPlus size={14} />}
          variant='filled'
          radius='md'
        >
          Add
        </Button>
      }
    >
      <Modal
        marginTop={20}
        radius={20}
        centered='true'
        opened={updateStatusState}
        onClose={() => {
          closeUpdateStatusState();
          // setStaffS(false);
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <div className='Response'></div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            color='rgb(110, 193, 228)'
            onClick={() => {
              setStatusEvent("Active");
            }}
          >
            Active
          </Button>
          <Button
            color='rgb(255, 105, 0)'
            onClick={() => {
              setStatusEvent("Inactive");
            }}
          >
            InActive
          </Button>
        </div>
      </Modal>

      <Modal
        title='Add or Edit Staff'
        opened={modalState}
        onClose={closeModalState}
      >
        <form
          onSubmit={staffForm.onSubmit(submitStaffAccount)}
          style={{
            paddingTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Group
            grow
            align='start'
            mb={5}
          >
            <TextInput
              {...staffForm.getInputProps("First_Name")}
              required
              label='First Name'
              placeholder='Enter First Name'
            />
            <TextInput
              {...staffForm.getInputProps("Last_Name")}
              required
              label='Last Name'
              placeholder='Enter Last Name'
            />
          </Group>
          <TextInput
            {...staffForm.getInputProps("Email")}
            required
            type='email'
            label='Email Address'
            placeholder='Enter Email Address'
          />
          <NumberInput
            {...staffForm.getInputProps("Contact")}
            hideControls
            maxLength={11}
            allowDecimal={false}
            allowNegative={false}
            required
            label='Contact Number'
            placeholder='Enter Contact Number'
          />
          <TextInput
            {...staffForm.getInputProps("Role")}
            required
            label='Role'
            placeholder='Enter Role'
          />
          <PasswordInput
            {...staffForm.getInputProps("Password")}
            description={`Default Password: ${DEFAULT_PASSWORD}`}
            label='Password'
            placeholder='Enter Password'
          />
          <PasswordInput
            {...staffForm.getInputProps("ConfirmPassword")}
            label='Confirm Password'
            placeholder='Enter Confirm Password'
          />
          <Button
            mt={10}
            loading={submitLoading}
            type='submit'
          >
            {staffForm.values.type === "add" ? "Add Staff" : "Save Changes"}
          </Button>
        </form>
      </Modal>

      <ScrollAreaAutosize>
        <div>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>First Name</Table.Th>
                <Table.Th>Last Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Contact No.</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {staffs.map((st, i) => {
                return (
                  <Table.Tr key={i}>
                    <Table.Td>{i + 1}</Table.Td>
                    <Table.Td style={{ minWidth: 130 }}>
                      {toProper(st.First_Name)}
                    </Table.Td>
                    <Table.Td style={{ minWidth: 130 }}>
                      {toProper(st.Last_Name)}
                    </Table.Td>
                    <Table.Td style={{ minWidth: 200 }}>{st.Email}</Table.Td>
                    <Table.Td style={{ minWidth: 120 }}>{st.Contact}</Table.Td>
                    <Table.Td style={{ textWrap: "nowrap" }}>
                      {st.Role}
                    </Table.Td>
                    <Table.Td style={{ minWidth: 100 }}>
                      <Badge
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setSelectedUpdateId(st.id);
                          openUpdateStatusState();
                        }}
                        color={st.Status === "Active" ? "green" : "red"}
                      >
                        {st.Status}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta='center'>
                      <ActionIcon
                        onClick={() => {
                          staffForm.setValues({
                            ...st,
                            type: "edit",
                            Password: "",
                            ConfirmPassword: "",
                          });
                          openModalState();
                        }}
                        variant='subtle'
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      </ScrollAreaAutosize>
    </PageContainer>
  );
}

export default Staff;
