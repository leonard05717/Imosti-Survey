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
  MultiSelect,
  NumberInput,
  PasswordInput,
  ScrollAreaAutosize,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import supabase, { getAccount } from "../supabase";
import { useDisclosure } from "@mantine/hooks";
import { toProper } from "../helpers/helper";

const DEFAULT_PASSWORD = "123456789";

const accessData = [
  {
    value: "analytics",
    label: "Analytics",
  },
  {
    value: "courses",
    label: "Courses",
  },
  {
    value: "trainee",
    label: "Trainee",
  },
  {
    value: "staff",
    label: "Staff",
  },
  {
    value: "maintenance",
    label: "Maintenance",
  },
  {
    value: "settings",
    label: "Settings",
  },
];

// sample
function Staff() {
  const account = getAccount();
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
      access: [],
      role_label: "Staff",
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
      access: (value, values) => {
        if (values.Role === "admin" && value.length === 0) {
          return "Please select at least one access";
        }
        return null;
      },
      Contact: (v) => {
        if (v.toString().length !== 10 && v.toString().length !== 11) {
          return "Contact Number should be 10 or 11 digits";
        }
        if (!v.toString().match(/^0|9/)) {
          return "Contact Number should start with 0 or 9";
        }
        return null;
      },
    },
  });

  async function submitStaffAccount(data) {
    try {
     console.log(data);
      setSubmitLoading(true);
      console.log(data);

     

      if (data.type === "add") {
        // add staff

        const { data: existingEmail, error: emailError } = await supabase
        .from("Staff-Info")
        .select("Email")
        .eq("Email", data.Email)
        .single();
 
      if (existingEmail) {
        window.alert("Email already exists. Please use a different email.");
       setSubmitLoading(false);
          return;
       }

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
            role_label: data.Role === "admin" ? data.role_label : null,
            access: data.Role === "admin" ? data.access : null,
          });


          const { error: deletehistory } = await supabase
          .from("history")
          .insert({
            transaction: "Add Account",
            Account: account?.Email,
            created_at: new Date(),
          });


 			 if (deletehistory) {
            console.log(`Something Error: ${deletehistory.message}`);
            return;
          }

        if (insertError) {
          window.alert(`Something Error: ${insertError.message}`);
          return;
        }
        await fetchData();
        window.alert("Add New Account Successfully!");
        staffForm.reset();
      } 
      else {



        if (data.Password && data.Password.trim() === "") {
          window.alert("Password cannot be empty or spaces only.");
          setSubmitLoading(false);
          return;
           }
        const { error: updateError } = await supabase
          .from("Staff-Info")
          .update({
            First_Name: data.First_Name,
            Last_Name: data.Last_Name,
            Email: data.Email,
            Role: data.Role,
            Contact: data.Contact,
            Password: data.Password ? data.Password : undefined,
            role_label: data.role_label || undefined,
            access: data.access || undefined,
          })
          .eq("id", data.id);

          const { error: deletehistory } = await supabase
          .from("history")
          .insert({
            transaction: "Update Account",
            Account: account?.Email,
            created_at: new Date(),
          });


 			 if (deletehistory) {
            console.log(`Something Error: ${deletehistory.message}`);
            return;
          }

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
    > {/*Active or Inactive */}
      <Modal
        radius={20}
        centered='true'
        opened={updateStatusState}
        onClose={() => {
          closeUpdateStatusState();
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
        title={<span style={{ color: 'white' }}>Add or Edit Staff</span>}
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
              minLength={2}
              onChange={(e) => {
              const value = e.target.value.replace(/[0-9]/g, ""); 
              staffForm.setFieldValue("First_Name", value);
            }}
            />
            <TextInput
              {...staffForm.getInputProps("Last_Name")}
              required
              label='Last Name'
              placeholder='Enter Last Name'
              minLength={2}
              onChange={(e) => {
              const value = e.target.value.replace(/[0-9]/g, ""); 
              staffForm.setFieldValue("Last_Name", value);
            }}
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
            allowLeadingZeros
            required
            label='Contact Number'
            placeholder='Enter Contact Number'
          />
          <Select
            {...staffForm.getInputProps("Role")}
            required
            label='Role'
            placeholder='Enter Role'
            checkIconPosition='right'
            searchable
            data={[
              { value: "superadmin", label: "Super Admin" },
              { value: "admin", label: "Admin" },
            ]}
          />
          {staffForm.values.Role === "admin" && (
            <>
              <TextInput
                required
                {...staffForm.getInputProps("role_label")}
                label='Role Label'
                placeholder='Enter Role Label'
              />
              <MultiSelect
                {...staffForm.getInputProps("access")}
                label='Allowed Page'
                placeholder='Enter Allowed Page'
                data={accessData}
                required
                checkIconPosition='right'
                styles={{
                  dropdown: {
                    border: "1px solid #0005",
                    boxShadow: "1px 2px 3px #0005",
                  },
                }}
              />
            </>
          )}
          <PasswordInput
            {...staffForm.getInputProps("Password")}
            description={`Default Password: ${DEFAULT_PASSWORD}`}
            label='Password'
            placeholder='Enter Password'
            minLength={8}
          />
          <PasswordInput
            {...staffForm.getInputProps("ConfirmPassword")}
            label='Confirm Password'
            placeholder='Enter Confirm Password'
            minLength={8}
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
                    {st.Role === "admin" && st.role_label
                      ? st.role_label
                      : "Super Admin"}
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
                          access: st.access || [],
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
      </ScrollAreaAutosize>
    </PageContainer>
  );
}

export default Staff;
