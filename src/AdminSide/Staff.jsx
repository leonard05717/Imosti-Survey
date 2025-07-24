import PageContainer from "../components/PageContainer";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
  ScrollAreaAutosize,
  Table,
  TextInput,
} from "@mantine/core";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import supabase from "../supabase";
import { useDisclosure } from "@mantine/hooks";

function Staff() {
  const [staffs, setStaffs] = useState([]);
  const [modalState, { open: openModalState, close: closeModalState }] =
    useDisclosure(false);

  async function fetchData() {
    const staffData = (await supabase.from("Staff-Info").select()).data;
    setStaffs(staffData);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      title='Staff'
      rightSection={
        <Button
          size='xs'
          onClick={() => {
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
        title='Add or Edit Staff'
        opened={modalState}
        onClose={closeModalState}
      >
        <form
          style={{
            height: 460,
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
              required
              label='First Name'
              placeholder='Enter First Name'
            />
            <TextInput
              required
              label='Last Name'
              placeholder='Enter Last Name'
            />
          </Group>
          <TextInput
            required
            type='email'
            label='Email Address'
            placeholder='Enter Email Address'
          />
          <NumberInput
            hideControls
            maxLength={11}
            allowDecimal={false}
            allowNegative={false}
            required
            label='Contact Number'
            placeholder='Enter Contact Number'
          />
          <TextInput
            required
            label='Role'
            placeholder='Enter Role'
          />
          <PasswordInput
            required
            label='Password'
            placeholder='Enter Password'
          />
          <PasswordInput
            required
            label='Confirm Password'
            placeholder='Enter Confirm Password'
          />
          <div style={{ textAlign: "end" }}>
            <Button>Add Staff</Button>
          </div>
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
                    <Table.Td>{st.First_Name}</Table.Td>
                    <Table.Td>{st.Last_Name}</Table.Td>
                    <Table.Td>{st.Email}</Table.Td>
                    <Table.Td>{st.Contact}</Table.Td>
                    <Table.Td>{st.Role}</Table.Td>
                    <Table.Td>{st.Status}</Table.Td>
                    <Table.Td ta='center'>
                      <ActionIcon variant='subtle'>
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
