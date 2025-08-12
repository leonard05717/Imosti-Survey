import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import {
  Button,
  Card,
  Group,
  Loader,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { usePrevious } from "@mantine/hooks";
import supabase from "../supabase";
import { DatePickerInput } from "@mantine/dates";

function Settings() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
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

  async function fetchData() {
    try {
      setLoadingPage(true);
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
                 !analyticForm.values.form_number.trim() || 
                 !analyticForm.values.revision_number.trim() ||
                 !analyticForm.values.issued_date.trim() ||
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
    </PageContainer>
  );
}

export default Settings;
