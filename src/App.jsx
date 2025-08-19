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
  ScrollArea,
  Divider,
} from "@mantine/core";
import {
  IconBrandAndroid,
  IconBrandBlackberry,
  IconCalendar,
} from "@tabler/icons-react";

import { DatePicker, DatePickerInput } from "@mantine/dates";
import { Label } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { staticData } from "./data";
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
  const [checked, setChecked] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [active, setActive] = useState(0);
  const nextStep = () => {
    setActive((current) => (current < 3 ? current + 1 : current));
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsofcondition, settermsofcondition] = useState(false);

  const [Name, setName] = useState("");
  const [Instructor, setInstructor] = useState("");
  const [Course, setCourse] = useState("");
  const [RegNo, setRegNo] = useState("");
  const [valuenowDate, SetvaluenowDate] = useState(new Date());
  const [Trainingvalue, setTrainingValue] = useState([null, null]);
  const [courses, setCourses] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [criteria, setcriteria] = useState([]);

  const NameTrasfer = (event) => {
     const input = event.target.value;
     const filtered = input.replace(/[0-9]/g, '');
     setName(filtered);
  
  };
  const InstructorTrasfer = (event) => {
     const input = event.target.value;
     const filtered = input.replace(/[0-9]/g, '');
     setInstructor(filtered);
  
  };
  const RegTrasfer = (event) => {
    setRegNo(event.target.value);
  };

  async function loadData() {
    const questionData = (await supabase.from("Questioner").select()).data;
    const feedbackData = (await supabase.from("Feedback-Question").select())
      .data;
    const CriteriaData = (await supabase.from("Criteria-Questioner").select())
      .data;
    const courseData = (await supabase.from("Course").select()).data;
    setQuestions(questionData.map((q) => ({ ...q, value: "" })));
    setFeedbacks(feedbackData.map((f) => ({ ...f, value: "" })));
    setcriteria(CriteriaData);
    setCourses(courseData);
    setLoadingPage(false);
    settermsofcondition(true)
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
            Are you sure you want to submit your Evaluation?
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
          Name: Name.toUpperCase(),
          Instructor: Instructor.toUpperCase(),
          Reg: RegNo.toUpperCase(),
          TrainingD: Trainingvalue,
          DateN: new Date(valuenowDate).toDateString(),
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
        created_at: new Date(valuenowDate).toDateString(),
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
        radius={20}
        centered
        opened={termsofcondition}
        onClose={settermsofcondition}
        size="lg"
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        style={{
          maxWidth: '80%',
          width: '100%',
          height: '80vh',
          overflowY: 'auto', // Scroll content if needed
          
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Logo */}
          <img
            src="/images/Admin-Logo.png" // Replace with your logo path
            alt="Logo"
            style={{  width: '300px', height: '70px' }}
          />
        </div>

        <h2 style={{ textAlign: 'center' , fontSize: '20px' , fontWeight: 'bold' }}>Privacy Policy</h2>

        <ScrollArea style={{ maxHeight: '1050vh', paddingRight: '15px' }}>
          <div style={{ padding: '10px' }}>
           
            <Text size="sm" style={{ marginBottom: '10px' }}>
              <strong>We at IMOSTI, Inc.</strong> value and put premium on your privacy. You have the right to know how your personal information is used and protected. This statement outlines several ways of processing the personal information that is shared. On your end, you have the choice to control (to a certain extent), the manner by which your personal information is used.
            </Text><br></br>
            <Text size="sm" style={{ marginBottom: '10px' }}>
            This statement is intended to protect all our clients, both individual and companies, in the same respectful manner.
            </Text><br></br>

            <Text style={{fontWeight:'bold'}} size="md" weight={500}>
              Personal Information Collected
            </Text><br></br>
            <Text size="sm" style={{ marginBottom: '25px' }}>
              The type of data that we gather from your inquiry or your company’s recommendation to the actual attendance varies depending on the training course. They include but are not limited to:
            </Text><br></br>
            <table className="table-auto w-full text-left border-collapse">
        <tbody>
          <tr>
            <td className="px-3 py-2 align-top">1. Full Name</td>
            <td className="px-3 py-2 align-top">5. ID Pictures</td>
            <td className="px-3 py-2 align-top">9. Company/Endorser</td>
          </tr>
          <tr>
            <td className="px-3 py-2 align-top">2. Date of Birth</td>
            <td className="px-3 py-2 align-top">6. Picture Taken***</td>
            <td className="px-3 py-2 align-top">10. PPE measurement</td>
          </tr>
          <tr>
            <td className="px-3 py-2 align-top">3. Contact Details*</td>
            <td className="px-3 py-2 align-top">7. Video Taping****</td>
            <td className="px-3 py-2 align-top">11. Emergency Contact Number</td>
          </tr>
          <tr>
            <td className="px-3 py-2 align-top">4. Government ID's**</td>
            <td className="px-3 py-2 align-top">8. Rank or Position</td>
            <td className="px-3 py-2 align-top">12. Miscellaneous info</td>
          </tr>
        </tbody>
      </table>
              <Text style={{marginTop:'25px'}} size="md" weight={500}>
              Phone number, e-mail and mailing addresses ** Passport, SSS or GSIS or UMID *** In the office**** Requirement-based
              </Text>
            <Text style={{marginTop:'25px'}} size="md" weight={500}>
              To provide you with accurate training intervention, there are critical documents that you need to share with us, either physically (photocopy) or electronically (scanned e-copy or image) prior to the start of training.
            </Text><br></br>
            <tr>
              <li>Valid medical certificate</li>
              <li>Valid certificate of completion</li>
              <li>Prerequisite training certificates and logs (DP Induction, sea service, DP logs)</li>
              <li>Sea time confirmation letter (from the company)</li>
            </tr>

            <Text size="sm" style={{ marginBottom: '10px', marginTop:'25px' }}>
              Refusal to comply with the requirements would mean that you shall be unable to pursue required training with us.
            </Text><br></br>

            <Text style={{ marginBottom: '10px',fontWeight:'bold'}} size="md" weight={500}>
              Additional Personal Data throughout the Duration of Work Relationship with You
            </Text><br></br>
            <Text size="sm" style={{ marginBottom: '10px' }}>
              In the course of our interaction, which could be between now and three years (sometimes beyond), we shall collect your data, including but not limited to your current training interest, history, and similar or related inquiries about our products and services.
            </Text><br></br>

            <Text size="md" weight={500}>
              Manner of Collecting Your Personal Data
            </Text>
            <Text size="sm" style={{ marginBottom: '10px' }}>
              When you engage with us, we get your information in several ways — receiving your call or SMS, welcoming you to the office or expressing your interest through e-mail and website. We shall gather your information via:
            </Text>
            <tr>
              <li>Registration form, e-mail, SMS, pre-training questionnaire and evaluation form</li>
              <li>Referral form</li>
              <li>Booking confirmation</li>
              <li>Information shared by your company, family, friend, or business contact</li>
            </tr><br></br>

            <Text size="sm" style={{ marginBottom: '10px' }}>
            The sensitive information shall only be provided to a requestor or disclosed to another party when required by law or regulation.
            </Text>

            <Text size="md" weight={500}>
              <strong>Notification of Received Information</strong>
            </Text><br></br>
            <Text size="sm" style={{ marginBottom: '10px' }}>
              Personal information that you or your company provides is treated with utmost care. The receiver shall take appropriate steps to notify you on:
            </Text><br></br>
            <tr>
              <li>How and why the information is asked for</li>
              <li>Who may have access to it</li>
              <li>Which part shall be shared with whom (case-to-case basis)</li>
            </tr><br></br>

            <Text size="sm" style={{ marginBottom: '10px' }}>
              The notice of usage might have been included in the form that you will get and submit to us.
            </Text>
            <Text size="sm" style={{ marginBottom: '10px' }}>
            All personal data and information collected shall only be used as required by IMOSTI, its associate and compliance. No personal information and data shall be shared without express written consent of the owner. Otherwise, all personal information and data will be retained and dispose according to <a href="https://privacy.gov.ph/data-privacy-act/" style={{color:"#046bd2",border:"none",borderBottom:"1px solid #046bd2"}}>R.A. 10173 Data Privacy Act 2012.</a> Click here to view the Certificate of Registration.
            </Text><br></br>

            <Text size="md" weight={500}>
              Usage of Your Personal Data
            </Text>
            <Text size="sm" style={{ marginBottom: '10px' }}>
              The information that you provide is used to:
            </Text><br></br>
            <tr>
              <li>Comply with offshore (and maritime) regulation as imposed by regulatory and statutory standards</li>
              <li>Conform to management system requirement</li>
              <li>Carry out our mandate arising from partnership between you (or your company) and our company</li>
              <li>Conduct every day business purpose</li>
            </tr><br></br>

            <Text size="md" weight={500}>
              Security of Your Personal Data
            </Text>
            <Text size="sm" style={{ marginBottom: '10px' }}>
              We store your information in paper and electronic forms. The security of your data is very important. That’s why we take reasonable steps to protect them from misuse, loss, unauthorized access or disclosure. We promote safety and avoid critical risks by:
            </Text><br></br>
            <tr>
              <li>Providing training to all team members on confidentiality requirements and data privacy</li>
              <li>Installing security controls to systems and facilities</li>
              <li>Identifying key accessors to personal data records</li>
            </tr><br></br>

            <Text size="md" weight={500}>
              <strong>Disposing of Personal Data When No Longer Needed</strong>
            </Text><br></br>
            <Text size="sm" style={{ marginBottom: '10px' }}>
              As your training provider partner, we will only retain your personal information for five years, as necessary for training purpose or as required by law and regulation.
            </Text><br></br>

            <Text size="md" weight={500}>
              <strong>Clarifications, Queries and Complaints</strong>
            </Text>
            <Text size="sm" style={{ marginBottom: '10px' }}>
              We appreciate your feedback. Contact us through (+63 2) 8893 2790.
            </Text><br></br>
            <Text size="sm" style={{ marginBottom: '10px' }}>
              You may also contact the National Privacy Commission by clicking or visiting info@privacy.gov.ph or complaints@privacy.gov.ph. Its address is 3rd Floor, Core G, GSIS Headquarters Building, Financial Center, Pasay City.
            </Text>

            <Divider style={{ margin: '20px 0' }} />

          
            <Checkbox
              
               label="I agree to the Privacy Policy and Terms & Conditions"
               onChange={(e) => setChecked(e.target.checked)}
               style={{display:'flex' , justifyContent:'center', marginTop: '25px' }}
               />
               <div style={{display:'flex' , justifyContent:'center'}}>
          <Button style={{ marginTop: '10px' }}  disabled={!checked} variant="filled"
          onClick={() => {
            settermsofcondition(false);
          }}
          >Submit</Button>
          </div>
          </div>
        </ScrollArea>
      </Modal>

      <Modal
        radius={20}
        centered
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
              src='../images/Logo.png'
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
                src='../images/Admin-Logo.png'
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
                description='Fill up Information'
              >
                <div className=''>
                  <div className='text-center font-black text-xl pb-5'>
                    Fill up all Information
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div className='space-y-3'>
                      <TextInput
                        label='Learners Name'
                        onChange={NameTrasfer}
                        className='input'
                        type='text'
                        placeholder='Enter Full Name'
                        value={Name}
                        pattern="[A-Za-z\s]+"
                        required
                      />
                      <TextInput
                        onChange={InstructorTrasfer}
                        id='Instructor'
                        className='input'
                        label='Instructor Name'
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
                        placeholder='Enter Full Company Name'
                        required
                        value={RegNo}
                      />
                    </div>
                    <div className='space-y-3'>
                      <DatePickerInput
                        type='multiple'
                        label='Training Date'
                        placeholder='Pick dates range'
                        
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
                          label: v.Course,
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
                      onClick={nextStep}
                      disabled={
                        !(
                          Name && Name.trim() &&
                          Instructor && Instructor.trim() &&
                          RegNo && RegNo.trim() &&
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
                description='Learners Evaluation'
              >
                <div className='text-center font-black text-xl pb-5'>
                  Learners Evaluation Form
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
                      {criteria.map((data, i) => {
                        const filteredQuestions = questions.filter(
                          (qs) => qs.Criteria === data.label,
                        );

                        return (
                          <React.Fragment key={i}>
                            <Table.Tr>
                              <Table.Th colSpan={6}>
                                {data.label}. {data.CQuestion}
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
                        required
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
                  <Button
                    disabled={feedbacks.some((v) => !v.value || !v.value.trim())}
                    onClick={nextStep}
                  >
                    Next step
                  </Button>
                </Group>
              </Stepper.Step>
              {/* 4th and confirmation */}
              <Stepper.Step
                label='Final step'
                description='Verify'
              >
                <div className='text-center font-black text-xl pb-5'>
                  Confirmation
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
                        <Table.Th>Learners Name:</Table.Th>
                        <Table.Td>{Name}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Course:</Table.Th>
                        <Table.Td>
                          {
                            courses.find((v) => v.id.toString() === Course)
                              ?.Course
                          }
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Company:</Table.Th>
                        <Table.Td>{RegNo}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Date:</Table.Th>
                        <Table.Td>{valuenowDate.toDateString()}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Instructor Name:</Table.Th>
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
                  Learners Evaluation Form:
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
