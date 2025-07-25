import React, { useEffect, useState } from "react";
import "./App.css";
import supabase from "./supabase";
import {
  Stepper,
  Button,
  Group,
  TextInput,
  Checkbox,
  ActionIcon,
  Grid,
  Modal,
  AspectRatio,
  Image,
  Input,
  ModalTitle,
  px,
  Rating,
  Radio,
  RadioGroup,
  Select,
  Table,
  Text,
  ScrollAreaAutosize,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconBrandAndroid,
  IconBrandBlackberry,
  IconCalendar,
} from "@tabler/icons-react";

import { DatePicker, DatePickerInput } from "@mantine/dates";
import { Label } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { staticData } from "./AdminSide/data";
import { modals } from "@mantine/modals";

const ratings = [
  {
    labels: ["Superior"],
    rate: "5",
  },
  {
    labels: ["Exceeds", "Expectation"],
    rate: "4",
  },
  {
    labels: ["Meets", "Expectation"],
    rate: "3",
  },
  {
    labels: ["Needs", "Development"],
    rate: "2",
  },
  {
    labels: ["Below", "Expectation"],
    rate: "1",
  },
];

function App() {
  const [questions, setQuestions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [Name, setName] = useState("");
  const [Instructor, setInstructor] = useState("");
  const [Course, setCourse] = useState("");
  const [RegNo, setRegNo] = useState("");
  const [valuenowDate, SetvaluenowDate] = useState(new Date());
  const [Trainingvalue, setTrainingValue] = useState([null, null]);
  const [courses, setCourses] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);

  const NameTrasfer = (event) => {
    setName(event.target.value);
  };
  const InstructorTrasfer = (event) => {
    setInstructor(event.target.value);
  };
  const RegTrasfer = (event) => {
    setRegNo(event.target.value);
  };

  async function loadData() {
    const questionData = (await supabase.from("Questioner").select()).data;
    const feedbackData = (await supabase.from("Feedback-Question").select())
      .data;
    const courseData = (await supabase.from("Course").select()).data;
    setQuestions(questionData.map((q) => ({ ...q, value: "" })));
    setFeedbacks(feedbackData.map((f) => ({ ...f, value: "" })));
    setCourses(courseData);
    setLoadingPage(false);
  }

  function reset() {
    setActive(0);
    setName("");
    setInstructor("");
    setCourse("");
    setRegNo("");
    SetvaluenowDate(new Date());
    setTrainingValue([null, null]);
    setQuestions((curr) => curr.map((v) => ({ ...v, value: "" })));
    setFeedbacks((curr) => curr.map((v) => ({ ...v, value: "" })));
  }

  async function submitEventHandler() {
    const confirmation = await new Promise((resolve) => {
      modals.openConfirmModal({
        title: <div className='text-white text-sm'>Confirmation</div>,
        children: (
          <Text
            size='sm'
            mt={20}
          >
            Are you sure you want to submit your survey?
          </Text>
        ),
        labels: { confirm: "Confirm", cancel: "Cancel" },
        onCancel: () => resolve(false),
        onConfirm: () => resolve(true),
      });
    });

    try {
      if (!confirmation) return;

      setLoadingSubmit(true);

      const { data: singeData, error: trainingError } = await supabase
        .from("Info-Training")
        .insert({
          Name: Name,
          Instructor: Instructor,
          Reg: RegNo,
          TrainingD: Trainingvalue,
          DateN: valuenowDate,
          course_id: Course,
        })
        .select("*")
        .single();

      if (trainingError) {
        window.alert(`User Error: ${trainingError.message}`);
        return;
      }

      const questionData = questions.map((qs) => ({
        question_id: qs.id,
        score: qs.value,
        training_id: singeData.id,
        created_at: new Date(),
      }));

      const { error: scoreError } = await supabase
        .from("scores")
        .insert(questionData);
      if (scoreError) {
        return window.alert(`Insert Score Error: ${scoreError.message}`);
      }

      const feedbackData = feedbacks.map((feed) => ({
        training_id: singeData.id,
        feedback_id: feed.id,
        answer: feed.value,
      }));

      const { error: feedbackError } = await supabase
        .from("feedback_answer")
        .insert(feedbackData);

      if (feedbackError) {
        return window.alert(`Insert Feedback Error: ${feedbackError.message}`);
      }

      setIsModalOpen(true);
      reset();
    } catch (error) {
      window.alert(`Something Error: ${error.toString()}`);
    } finally {
      setLoadingSubmit(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <LoadingOverlay visible={loadingPage} />

      <Modal
        marginTop={20}
        radius={20}
        centered='true'
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
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
              src='../Picture/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <div className='Response'>Your response has been recorded</div>
        <Button
          className='Button-done'
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          Done
        </Button>
      </Modal>

      <div className='Main-Container'>
        <div className='bg-black flex items-center justify-center pb-4'>
          <Link to='/admin/analytics'>
            <AspectRatio>
              <Image
                h='100%'
                src='../Picture/Admin-Logo.png'
                alt='Avatar'
              />
            </AspectRatio>
          </Link>
        </div>
        <div className='stepper-center flex items-center justify-center'>
          <div className='Stepper-Containers px-8 md:w-[60%] w-full'>
            <Stepper
              active={active}
              allowNextStepsSelect={false}
              onStepClick={setActive}
              size='xs'
              iconSize={62}
              styles={{
                content: {
                  paddingBottom: 60,
                },
                root: {
                  paddingTop: 30,
                  height: "calc(100vh - 12rem)",
                },
              }}
            >
              {/* 1st */}
              <Stepper.Step
                label='First step'
                description='Get Information'
              >
                <div className=''>
                  <div className='text-center font-black text-xl pb-5'>
                    Fillup All Information
                  </div>
                  <div className='font-semibold'>INSTRUCTION:</div>
                  <div className='mb-5'>
                    Please Mark the Circle that applies and corresponds to your
                    assessment of each item.
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className='space-y-3'>
                      <TextInput
                        label='Full Name'
                        onChange={NameTrasfer}
                        className='input'
                        type='text'
                        placeholder='Enter Full Name'
                        value={Name}
                        required
                      />
                      <TextInput
                        onChange={InstructorTrasfer}
                        id='Instructor'
                        className='input'
                        label='Instructor'
                        type='text'
                        placeholder='Enter Instructor'
                        required
                        value={Instructor}
                      />
                      <TextInput
                        onChange={RegTrasfer}
                        id='Reg'
                        className='input'
                        label='Company Name'
                        type='text'
                        placeholder='Enter Company Name'
                        required
                        value={RegNo}
                      />
                    </div>
                    <div className='space-y-3'>
                      <DatePickerInput
                        type='range'
                        label='Pick dates range'
                        placeholder='Pick dates range'
                        value={Trainingvalue}
                        onChange={setTrainingValue}
                        required
                        clearable
                        minDate={new Date(2000, 0, 1)}
                      />
                      <DatePickerInput
                        leftSection={
                          <IconCalendar
                            size={18}
                            stroke={1.5}
                          />
                        }
                        readOnly
                        label='Date Now'
                        placeholder='Pick Date'
                        value={valuenowDate}
                        onChange={SetvaluenowDate}
                      />
                      <Select
                        searchable
                        label='Course'
                        checkIconPosition='right'
                        required
                        placeholder='Select Course'
                        data={courses.map((v) => ({
                          label: v.Code,
                          value: v.id.toString(),
                        }))}
                        clearable
                        styles={{
                          dropdown: {
                            boxShadow: "0 0 5px #0005",
                            border: "1px solid #0005",
                          },
                        }}
                        value={Course}
                        onChange={(v) => setCourse(v)}
                      />
                    </div>
                  </div>
                  <Group
                    justify='center'
                    mt='xl'
                  >
                    <Button
                      variant='default'
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={
                        !(
                          Name &&
                          Instructor &&
                          RegNo &&
                          Trainingvalue.every((v) => !!v) &&
                          valuenowDate &&
                          Course
                        )
                      }
                    >
                      Next step
                    </Button>
                  </Group>
                </div>
              </Stepper.Step>
              {/* 2nd */}
              <Stepper.Step
                label='Second step'
                description='Check Survey'
              >
                <div className='text-center font-black text-xl pb-5'>
                  Survey Form
                </div>
                <div className='font-semibold'>INSTRUCTION:</div>
                <div className='mb-5'>
                  Please Mark the Circle that applies and corresponds to your
                  assessment of each item.
                </div>

                <ScrollAreaAutosize>
                  <Table
                    withColumnBorders
                    withTableBorder
                  >
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>CRITERIA</Table.Th>
                        <Table.Th
                          colSpan={5}
                          ta='center'
                        >
                          RATINGS
                        </Table.Th>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td></Table.Td>
                        {ratings.map((rating, ri) => {
                          return (
                            <Table.Td
                              key={ri}
                              w={10}
                              className='text-center'
                            >
                              <div className='font-black text-lg'>
                                {rating.rate}
                              </div>
                              {rating.labels.map((label, lis) => (
                                <div
                                  className='text-[0.7rem]'
                                  key={lis}
                                >
                                  {label}
                                </div>
                              ))}
                            </Table.Td>
                          );
                        })}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {staticData.map((data, i) => {
                        const filteredQuestions = questions.filter(
                          (qs) => qs.Criteria === data.key,
                        );

                        return (
                          <React.Fragment key={i}>
                            <Table.Tr>
                              <Table.Th colSpan={6}>
                                {data.key}. {data.description}
                              </Table.Th>
                            </Table.Tr>
                            {filteredQuestions.map((question, ix) => {
                              const checkedValue = question.value;

                              return (
                                <Table.Tr key={ix}>
                                  <Table.Td miw={250}>
                                    {ix + 1}. {question.Question}
                                  </Table.Td>

                                  {ratings.map((rating, rix) => {
                                    return (
                                      <Table.Td
                                        key={rix}
                                        className='place-items-center'
                                      >
                                        <Radio
                                          checked={checkedValue === rating.rate}
                                          value={rating.rate}
                                          name={question.id.toString()}
                                          onChange={(e) =>
                                            setQuestions((curr) =>
                                              curr.map((qs) => {
                                                if (qs.id === question.id)
                                                  return {
                                                    ...qs,
                                                    value: e.target.value,
                                                  };
                                                return qs;
                                              }),
                                            )
                                          }
                                        />
                                      </Table.Td>
                                    );
                                  })}
                                </Table.Tr>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </ScrollAreaAutosize>
                <Group
                  justify='center'
                  mt='xl'
                >
                  <Button
                    variant='default'
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                  <Button
                    disabled={questions.some((qs) => qs.value === "")}
                    onClick={() => nextStep()}
                  >
                    Next step
                  </Button>
                </Group>
              </Stepper.Step>
              {/* 3rd */}
              <Stepper.Step
                label='Third step'
                description='Additional Feedback'
              >
                <div className='text-center font-black text-xl pb-5'>
                  Additional Feedback
                </div>

                {feedbacks.map((Feedbacklist, ifx) => {
                  return (
                    <div key={Feedbacklist.id}>
                      <TextInput
                        mb={20}
                        label={`${ifx + 1}. ${Feedbacklist.QuestionFeedback}`}
                        placeholder='Enter your feedback'
                        value={Feedbacklist.value}
                        onChange={(e) => {
                          setFeedbacks((curr) => {
                            return curr.map((v) => {
                              if (v.id === Feedbacklist.id) {
                                return {
                                  ...v,
                                  value: e.target.value,
                                };
                              }
                              return v;
                            });
                          });
                        }}
                      />
                    </div>
                  );
                })}
                <Group
                  justify='center'
                  mt='xl'
                >
                  <Button
                    variant='default'
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                  <Button onClick={nextStep}>Next step</Button>
                </Group>
              </Stepper.Step>

              {/* Confirmation */}
              <Stepper.Step
                label='Final step'
                description='Verify'
              >
                <div className='text-center font-black text-xl pb-5'>
                  Survey Confirmation
                </div>

                <Text
                  size='md'
                  mt={10}
                  mb={5}
                  style={{ tableLayout: "fixed" }}
                >
                  Information:
                </Text>
                <ScrollAreaAutosize>
                  <Table
                    withTableBorder
                    withColumnBorders
                  >
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Th>Full Name:</Table.Th>
                        <Table.Td>{Name}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Course:</Table.Th>
                        <Table.Td>
                          {
                            courses.find((v) => v.id.toString() === Course)
                              ?.Code
                          }
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Date:</Table.Th>
                        <Table.Td>{valuenowDate.toDateString()}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Instructor:</Table.Th>
                        <Table.Td>{Instructor}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Training Date:</Table.Th>
                        <Table.Td>
                          {Trainingvalue.map((t) =>
                            new Date(t).toDateString(),
                          ).join(" to ")}
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </ScrollAreaAutosize>

                <Text
                  size='md'
                  mt={20}
                  mb={5}
                >
                  Survey Form:
                </Text>

                <ScrollAreaAutosize>
                  <Table
                    withTableBorder
                    withColumnBorders
                  >
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Criteria</Table.Th>
                        <Table.Th>Rate</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {staticData.map((data, dataxi) => {
                        const filteredQuestions = questions.filter(
                          (qs) => qs.Criteria === data.key,
                        );

                        return (
                          <React.Fragment key={dataxi}>
                            <Table.Tr>
                              <Table.Th>
                                {data.key}. {data.description}
                              </Table.Th>
                              <Table.Td></Table.Td>
                            </Table.Tr>
                            {filteredQuestions.map((qs, qsix) => {
                              const rslist = ratings.find(
                                (r) => r.rate === qs.value,
                              );
                              let rate = "None";
                              if (rslist) {
                                rate = rslist.labels.join(" ");
                              }

                              return (
                                <Table.Tr key={qsix}>
                                  <Table.Th miw={200}>{qs.Question}</Table.Th>
                                  <Table.Td>
                                    {qs.value} ({rate})
                                  </Table.Td>
                                </Table.Tr>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </ScrollAreaAutosize>

                <Text
                  size='md'
                  mt={20}
                  mb={5}
                >
                  Additional Feedback:
                </Text>

                <ScrollAreaAutosize>
                  <Table
                    withTableBorder
                    withColumnBorders
                  >
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Question</Table.Th>
                        <Table.Th>Feedback</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {feedbacks.map((feed) => {
                        return (
                          <Table.Tr>
                            <Table.Th miw={200}>
                              {feed.QuestionFeedback}
                            </Table.Th>
                            <Table.Td>{feed.value || "-"}</Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </ScrollAreaAutosize>

                <Group
                  justify='center'
                  mt='xl'
                >
                  <Button
                    variant='default'
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                  <Button
                    loading={loadingSubmit}
                    onClick={() => {
                      submitEventHandler();
                    }}
                  >
                    Submit
                  </Button>
                </Group>
              </Stepper.Step>
              <Stepper.Completed>
                Completed, click back button to get to previous step
              </Stepper.Completed>
            </Stepper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
