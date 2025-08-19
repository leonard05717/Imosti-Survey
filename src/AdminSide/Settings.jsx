import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  PasswordInput,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { usePrevious } from "@mantine/hooks";
import { useDisclosure } from "@mantine/hooks";
import supabase from "../supabase";
import { DatePickerInput } from "@mantine/dates";
import { IconPrinter, IconTrash } from "@tabler/icons-react";

function Settings() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mapingAdmin, setmapingAdmin] = useState([]);
  const [historylist , sethistorylist] = useState([]);
  const [comfirmdelete, setcomfirmdelete] = useState();
  const [DeleteRecord, { open: openDeleteRecord, close: closeDeleteRecord }] =
  useDisclosure(false);
  const analyticForm = useForm({
    mode: "controlled",
    initialValues: {
      form_number: "",
      revision_number: "",
      issued_date: null,
    },
  });

  const [previousValues, setPreviousValues] = useState({
    form_number: "",
    revision_number: "",
    issued_date: null,
  });

  async function DeleteRecords() {
    try{
      setLoading(true);

    for (const sc of mapingAdmin.filter((v) => v.Role === "superadmin")) {
      if (sc.Password === comfirmdelete) {
        const { error: deleteError } = await supabase
          .from("history")
          .delete()
          .neq("id", 0);

        if (deleteError) {
          console.log(`Something Error: ${deleteError.message}`);
          return;
        }
       
        await fetchData();
        console.log("delete success")
        closeDeleteRecord();
        setLoading(false);
        return;
      }
    }

        alert("Password Incorrect or not matched with any superadmin.");
      }
      catch (error) {
       console.log("Error deleting history:", error);
         return;
        }
  }


  async function submitAnalyticEventHandler(values) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("storage")
        .update({ value: values.form_number })
        .eq("key", "form_number");
      const { error: revisionError } = await supabase
        .from("storage")
        .update({ value: values.revision_number })
        .eq("key", "revision_number");
      const { error: issuedDateError } = await supabase
        .from("storage")
        .update({ value: values.issued_date })
        .eq("key", "issued_date");
      if (error || revisionError || issuedDateError) {
        return window.alert("Failed to update storage");
      }
      setPreviousValues(values);
    } catch (error) {
      console.error(error);
      window.alert(error.toString());
    } finally {
      setLoading(false);
    }
  }

  const handlePrintToAverage = () => {
    const printWindow = window.open("", "_blank");

    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Evaluation Average Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #000;
            position: relative;
          }

          .watermark {
            position: absolute;
            left: 50%;
            top: 100%;
            width: 100%;
            transform: translate(-50%, -50%);
            opacity: 0.1;
            z-index: 0;
          }

          .logo-container {
            display: grid;
            place-items: center;
            margin-top: 20px;
            z-index: 1;
          }

          .divider {
            margin: 30px 0;
            border-top: 1px solid #0003;
          }

          .content {
            padding: 0 30px 30px 30px;
            z-index: 1;
            position: relative;
            margin-top: -25px;
          }

          .course-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .course-title {
            font-weight: bold;
            font-size: 20px;
            margin: 0;
          }

          .course-description {
            font-size: 15px;
            margin: 0 0 5px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }

          th, td {
            font-size: 15px;
            padding: 6px 0;
          }

          thead th {
            text-align: left;
            padding-bottom: 8px;
          }

          tbody td, tbody th {
            padding-right: 20px;
          }

          .criteria-title {
            font-weight: bold;
            padding-top: 10px;
          }

          .total-average {
            display: flex;
            justify-content: end;
            margin-top: 10px;
          }

          .stats-info {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
          }

           table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }
        </style>
      </head>
      <body>
        <img class="watermark" src="/images/Logo.png" alt="Watermark" />
        <div class="logo-container">
          <img src="/images/Admin-Logo.png" alt="Logo" style="height: 70px;" />
        </div>
        <div class="divider"></div>
        <div class="content">
          <div class="course-header">
            <p class="course-title">Activity Log</p>
            <p>${new Date().toDateString()}</p>
          </div>
          
 <table id="activityTable">
    <thead>
      <tr>
        <th>Account</th>
        <th>Transaction</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
     ${historylist
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((v) => {
        const formattedDate = new Date(v.created_at).toLocaleString();
        return `
        <tr> 
          <td>${v.Account}</td>
          <td>${v.transaction}</td>
          <td>${formattedDate}</td>
        </tr>
        `;
      }).join('')}
    </tbody>
  </table>


        </div>
      </body>
    </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  async function fetchData() {
    try {
      setLoadingPage(true);
      const history = (await supabase.from("history").select()).data;
      const Admin = (await supabase.from("Staff-Info").select()).data;
      const { value: form_number } = (
        await supabase
          .from("storage")
          .select("value")
          .eq("key", "form_number")
          .single()
      ).data;
      const { value: revision_number } = (
        await supabase
          .from("storage")
          .select("value")
          .eq("key", "revision_number")
          .single()
      ).data;
      const { value: issued_date } = (
        await supabase
          .from("storage")
          .select("value")
          .eq("key", "issued_date")
          .single()
      ).data;
      setPreviousValues({
        form_number,
        revision_number,
        issued_date,
      });
      analyticForm.setFieldValue("form_number", form_number);
      analyticForm.setFieldValue("revision_number", revision_number);
      analyticForm.setFieldValue("issued_date", issued_date);
      sethistorylist(history)
      setmapingAdmin(Admin);
    } catch (error) {
      window.alert(error.toString());
    } finally {
      setLoadingPage(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer title='Settings'>

    {/*Delete */}
    <Modal
        radius={20}
        centered='true'
        opened={DeleteRecord}
        onClose={() => {
          closeDeleteRecord();
        }}
      >
        <div className='Response'>
        <Text fw={700}>Confirm Deletion</Text>
        </div>
        <PasswordInput
          required
          type='Password'
          radius='md'
          placeholder='Enter Password'
          onChange={(e) => {
            setcomfirmdelete(e.target.value);
          }}
        />
        <Button
          onClick={DeleteRecords}
          className='Button-done'
          type='submit'
          style={{ width: "fit-content" }}
        >
          Delete
        </Button>
      </Modal>

    
      <Card
        withBorder
        shadow='md'
      >
        <form onSubmit={analyticForm.onSubmit(submitAnalyticEventHandler)}>
          <Text
            ff='montserrat-black'
            size='lg'
          >
            Analytic Report Data
          </Text>
          <Table
            layout='fixed'
            withColumnBorders
            style={{
              verticalAlign: "auto",
            }}
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Form No:</Table.Th>
                <Table.Td>
                  <TextInput
                    leftSection={
                      loadingPage && (
                        <Loader
                          color='dark'
                          size='xs'
                        />
                      )
                    }
                    variant='unstyled'
                    {...analyticForm.getInputProps("form_number")}
                    style={{
                      borderBottom: "1px solid #0004",
                    }}
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Revision No:</Table.Th>
                <Table.Td>
                  <TextInput
                    leftSection={
                      loadingPage && (
                        <Loader
                          color='dark'
                          size='xs'
                        />
                      )
                    }
                    variant='unstyled'
                    {...analyticForm.getInputProps("revision_number")}
                    style={{
                      borderBottom: "1px solid #0004",
                    }}
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Issued Date:</Table.Th>
                <Table.Td>
                  <DatePickerInput
                    leftSection={
                      loadingPage && (
                        <Loader
                          color='dark'
                          size='xs'
                        />
                      )
                    }
                    variant='unstyled'
                    {...analyticForm.getInputProps("issued_date")}
                    style={{
                      borderBottom: "1px solid #0004",
                    }}
                  />
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <div className='pt-2 text-right'>
            <Button
              type='submit'
              loading={loading}
              disabled={
                loading ||
                !analyticForm.values.form_number?.trim() ||
                !analyticForm.values.revision_number?.trim() ||
                !analyticForm.values.issued_date?.trim() ||
                (analyticForm.values.form_number ===
                  previousValues.form_number &&
                  analyticForm.values.revision_number ===
                    previousValues.revision_number &&
                  analyticForm.values.issued_date ===
                    previousValues.issued_date)
              }
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
     <Card  withBorder
        shadow='md'
        style={{marginTop:'10px' , maxWidth: '1250px'}}>
     <Text
            ff='montserrat-black'
            size='lg'
          >
            Activity Log
      </Text>
      <div style={{display:'flex' ,justifyContent:'flex-end' , marginTop: '-25px' , gap: '10px'}}>
      <ActionIcon onClick={handlePrintToAverage}>
       <IconPrinter size={18} />
      </ActionIcon>
      <ActionIcon color='red' onClick={() => { openDeleteRecord()}}>
          
       <IconTrash size={18} />
      </ActionIcon>
      </div>
    
      <ScrollArea w="auto" h={240} scrollbars="y" >
      <Box w="auto">
     
      <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Account</Table.Th>
          <Table.Th>Transaction</Table.Th>
          <Table.Th>Date</Table.Th>
          
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
      {historylist
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((v) => {
        const formattedDate = new Date(v.created_at).toLocaleString();
        return (
        <Table.Tr key={v.id}> 
          <Table.Td>{v.Account}</Table.Td>
          <Table.Td>{v.transaction}</Table.Td>
          <Table.Td>{formattedDate}</Table.Td>
        </Table.Tr>
      );
      })}
      </Table.Tbody>
       </Table>
      </Box>
      </ScrollArea>
    </Card>
    
    </PageContainer>

  );
}

export default Settings;
