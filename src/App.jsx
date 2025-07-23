import { useEffect, useState } from "react";
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
} from "@mantine/core";
import {
  IconBrandAndroid,
  IconBrandBlackberry,
  IconCalendar,
} from "@tabler/icons-react";

import { DatePicker, DatePickerInput } from "@mantine/dates";
import { Label } from "recharts";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [Name, setName] = useState("");
  const [Instructor, setInstructor] = useState("");
  const [Course, setCourse] = useState("");
  const [RegNo, setRegNo] = useState("");
  const [valuenowDate, SetvaluenowDate] = useState(new Date());
  const [Trainingvalue, setTrainingValue] = useState([null, null]);
  const [courses, setCourses] = useState([]);

  const NameTrasfer = (event) => {
    setName(event.target.value);
  };
  const InstructorTrasfer = (event) => {
    setInstructor(event.target.value);
  };
  const CourseTrasfer = (event) => {
    setCourse(event.target.value);
  };
  const RegTrasfer = (event) => {
    setRegNo(event.target.value);
  };

  const [QuestionDB, setQuestion] = useState([
    {
      Question: "",
      value: "",
      id: 0,
    },
  ]);

  const [Question2DB, setQuestion2] = useState([
    {
      Question: "",
      value: "",
      id: 0,
    },
  ]);

  const [Question3DB, setQuestion3] = useState([
    {
      Question: "",
      value: "",
      id: 0,
    },
  ]);

  const [Question4DB, setQuestion4] = useState([
    {
      Question: "",
      value: "",
      id: 0,
    },
  ]);

  const [FeedbackQ, setFeedback] = useState([
    {
      QuestionFeedback: "",
      value: "",
      id: 0,
    },
  ]);

  async function nextStep1() {
    setLoading(true);
    const { error } = await supabase.from("Info-Training").insert({
      Name: firstname,
      Instructor: CInstructor,
      Course: CCourse,
      TrainingD: TrainingValue,
      DateN: valuenowDate,
      Reg: CReg,
    });
    setLoading(false);
  }

  async function loadData() {
    const { error, data } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "A");
    const { data2 } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "B");
    const { data3 } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "C");
    const { data4 } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "D");

    const { error: courseError, data: dataCourse } = await supabase
      .from("Course")
      .select();
    if (courseError) return console.log(courseError.message);

    setCourses(dataCourse);
    setQuestion(data.map((v) => ({ ...v, value: "" })));
    setQuestion2(data2.map((v) => ({ ...v, value: "" })));
    setQuestion3(data3.map((v) => ({ ...v, value: "" })));
    setQuestion4(data4.map((v) => ({ ...v, value: "" })));
  }
  async function loadData2() {
    const { error, data } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "B");
    setQuestion2(data);
  }
  async function loadData3() {
    const { error, data } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "C");
    setQuestion3(data);
  }

  async function loadData4() {
    const { error, data } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "D");
    setQuestion4(data);
  }

  async function Feedback1() {
    const { error, data } = await supabase.from("Feedback-Question").select();

    setFeedback(data.map((v) => ({ ...v, value: "" })));
  }

  function reset() {
    setActive(0);
    setName("");
    setInstructor("");
    setCourse("");
    setRegNo("");
    SetvaluenowDate(new Date());
    setTrainingValue("");
  }

  async function submitEventHandler() {
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
      console.log(trainingError.message);
      return;
    }

    const data = QuestionDB.map((v) => ({
      question_id: v.id,
      score: v.value,
      training_id: singeData.id,
      created_at: new Date(),
    }));

    const data2 = Question2DB.map((v) => ({
      question_id: v.id,
      score: v.value,
      training_id: singeData.id,
      created_at: new Date(),
    }));

    const data3 = Question3DB.map((v) => ({
      question_id: v.id,
      score: v.value,
      training_id: singeData.id,
      created_at: new Date(),
    }));
    const data4 = Question4DB.map((v) => ({
      question_id: v.id,
      score: v.value,
      training_id: singeData.id,
      created_at: new Date(),
    }));

    const allData = data.concat(data2, data3, data4);

    const { error: scoreError } = await supabase.from("scores").insert(allData);
    if (scoreError) return console.log(scoreError.message);

    const feedback = FeedbackQ.map((v) => ({
      training_id: singeData.id,
      feedback_id: v.id,
      answer: v.value,
    }));

    const { error: feedbackError } = await supabase
      .from("feedback_answer")
      .insert(feedback);
    if (feedbackError) return console.log(feedbackError.message);

    reset();
  }

  useEffect(() => {
    loadData2();
    loadData3();
    loadData4();
    Feedback1();
    loadData();

    const sectionSubscription = supabase
      .channel("realtime:users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "A.Services" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuestion((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setQuestion((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setQuestion((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    const section2Subscription = supabase
      .channel("realtime:B.Facilities")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "B.Facilities" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuestion2((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setQuestion2((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setQuestion2((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    const section3Subscription = supabase
      .channel("realtime:C.Course")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "C.Course" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuestion3((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setQuestion3((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setQuestion3((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    const section4Subscription = supabase
      .channel("realtime:D.Instructor")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "D.Instructor" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuestion4((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setQuestion4((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setQuestion4((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    const sectionFeedBack = supabase
      .channel("realtime:Feedback")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Feedback-Question" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFeedback((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setFeedback((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setFeedback((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sectionSubscription);
      supabase.removeChannel(section2Subscription);
      supabase.removeChannel(section3Subscription);
      supabase.removeChannel(section4Subscription);
      supabase.removeChannel(sectionFeedBack);
    };
  }, []);

  return (
    <>
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
            submitEventHandler();
            setIsModalOpen(false);
            setActive(0);
          }}
        >
          Done
        </Button>
      </Modal>

      <div className='Main-Container'>
        <div style={{ backgroundColor: "black" }}>
          <div
            className='logo'
            style={{ display: "flex" }}
          >
            <AspectRatio
              style={{ marginTop: "10px", marginBottom: "30px" }}
              ratio={1}
              flex='0 0 200px'
            >
              <Image
                h={100}
                w={300}
                src='../Picture/Admin-Logo.png'
                alt='Avatar'
              />
            </AspectRatio>
          </div>
        </div>
        <div className='stepper-center'>
          <div className='Stepper-Container'>
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
              <Stepper.Step
                label='First step'
                description='Get Information'
              >
                <div className='Input-Center'>
                  <div className='font-size'>Fillup All Information</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "30px",
                    }}
                  >
                    INSTRUCTION: Please Mark the Circle that applies and
                    corresponds to your assessment of each item.
                  </div>
                  <div className='input-design'>
                    <div className='Input-text'>
                      Name:
                      <input
                        style={{ marginTop: "-20px" }}
                        onChange={NameTrasfer}
                        className='input'
                        type='text'
                        placeholder='Full Name'
                        value={Name}
                        required
                      />
                      Instructor:
                      <input
                        style={{ marginTop: "-20px" }}
                        onChange={InstructorTrasfer}
                        id='Instructor'
                        className='input'
                        type='text'
                        placeholder='Instructor'
                        required
                        value={Instructor}
                      />
                      Company
                      <input
                        style={{ width: "300px", marginTop: "-20px" }}
                        onChange={RegTrasfer}
                        id='Reg'
                        className='input'
                        type='text'
                        placeholder='Insert full company Name'
                        required
                        value={RegNo}
                      />
                    </div>
                    <div className='right-container'>
                      <div className='m_38a85659-mantine-popover-dropdown'>
                        <div className='left-info'>
                          <DatePickerInput
                            type='range'
                            label='Pick dates range'
                            placeholder='Pick dates range'
                            value={Trainingvalue}
                            onChange={setTrainingValue}
                            required
                          />
                        </div>
                        <div style={{ marginTop: "6px" }}>
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
                            labelProps={{ style: { fontWeight: "bold" } }}
                            required
                          />
                        </div>
                      </div>
                      <div style={{ marginTop: "-10px" }}>
                        <Select
                          searchable
                          label='Course'
                          required
                          placeholder='Select Course'
                          data={courses.map((v) => ({
                            label: v.Code,
                            value: v.id.toString(),
                          }))}
                          value={Course}
                          onChange={(v) => setCourse(v)}
                        />
                      </div>
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
                          Trainingvalue &&
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
              <Stepper.Step
                label='Second step'
                description='Check Survey'
              >
                <div className='Maincontainer-second'>
                  <div className='Main-text'>Survey Form</div>
                  <div className='Second-text'>
                    <label style={{ fontweight: "bold" }}>INSTRUCTION:</label>
                    Please Mark the Circle that applies and corresponds to your
                    assessment of each item.
                  </div>

                  <div className='first-border'>
                    <Grid justify='space-evenly'>
                      <Grid.Col span={1.8}>CRITERIA</Grid.Col>
                      <Grid.Col
                        style={{ marginLeft: "185px" }}
                        span={1.8}
                      >
                        RATING
                      </Grid.Col>
                    </Grid>
                  </div>
                  <div className='Second-border'>
                    <Grid
                      grow
                      gutter='xl'
                    >
                      <Grid.Col
                        style={{ marginLeft: "20px" }}
                        span={3}
                      ></Grid.Col>
                      <Grid.Col
                        style={{}}
                        span={1.8}
                      >
                        <Grid style={{ justifyContent: "space-evenly" }}>
                          <Grid.Col span={2.4}>5</Grid.Col>
                          <Grid.Col span={2.4}>4</Grid.Col>
                          <Grid.Col span={2.4}>3</Grid.Col>
                          <Grid.Col span={2.4}>2</Grid.Col>
                          <Grid.Col span={2.4}>1</Grid.Col>
                        </Grid>
                      </Grid.Col>
                    </Grid>

                    <label
                      style={{
                        display: "flex",
                        fontSize: "12px",
                        marginLeft: "56%",
                      }}
                    >
                      Superior
                      <label style={{ marginLeft: "38px", fontSize: "12px" }}>
                        Exceeds
                      </label>
                      <label style={{ marginLeft: "45px", fontSize: "12px" }}>
                        Meets
                      </label>
                      <label style={{ marginLeft: "47px", fontSize: "12px" }}>
                        Needs
                      </label>
                      <label style={{ marginLeft: "52px", fontSize: "12px" }}>
                        Below
                      </label>
                    </label>
                    <label
                      style={{
                        display: "flex",
                        fontSize: "12px",
                        marginLeft: "60%",
                        marginTop: "-6px",
                      }}
                    >
                      <label style={{ marginLeft: "38px", fontSize: "12px" }}>
                        Expectation
                      </label>
                      <label style={{ marginLeft: "16px", fontSize: "12px" }}>
                        Expectation
                      </label>
                      <label style={{ marginLeft: "16px", fontSize: "12px" }}>
                        Development
                      </label>
                      <label style={{ marginLeft: "22px", fontSize: "12px" }}>
                        Expectation
                      </label>
                    </label>
                  </div>
                  <Grid style={{ borderBottom: "2px solid black" }}>
                    <Grid.Col
                      className='AService'
                      style={{ marginLeft: "20px" }}
                      span={3}
                    >
                      A.Services
                    </Grid.Col>
                  </Grid>
                  <div className='Question-Sheet'>
                    <Grid
                      style={{ marginTop: "20px" }}
                      grow
                      gutter='xl'
                    >
                      <Grid.Col
                        style={{ marginLeft: "20px" }}
                        span={4}
                      >
                        <div>
                          {QuestionDB.map((RequestQ1) => {
                            return (
                              <div style={{ marginBottom: "20px" }}>
                                {" "}
                                {RequestQ1.Question}
                              </div>
                            );
                          })}
                        </div>
                      </Grid.Col>
                      <Grid.Col
                        style={{ marginLeft: "-100px" }}
                        span={1.8}
                      >
                        <div>
                          {QuestionDB.map((Request1) => {
                            return (
                              <RadioGroup
                                onChange={(value) => {
                                  setQuestion((curr) => {
                                    return curr.map((v) => {
                                      if (v.id === Request1.id) {
                                        return {
                                          ...v,
                                          value: value,
                                        };
                                      }
                                      return v;
                                    });
                                  });
                                }}
                              >
                                <div
                                  style={{
                                    gap: "60px",
                                    display: "flex",
                                    flexdirection: "row",
                                    marginBottom: "20px",
                                  }}
                                >
                                  {Request1.count}
                                  <Radio
                                    name={Request1.Question}
                                    value='5'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='4'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='3'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='2'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='1'
                                  />
                                </div>
                              </RadioGroup>
                            );
                          })}
                        </div>
                      </Grid.Col>
                    </Grid>
                    <div className='Second-border'>
                      <Grid>
                        <Grid.Col
                          style={{ marginLeft: "20px" }}
                          span={3}
                        >
                          B.Facilities
                        </Grid.Col>
                      </Grid>
                    </div>
                    <Grid
                      style={{ marginTop: "20px" }}
                      grow
                      gutter='xl'
                    >
                      <Grid.Col
                        style={{ marginLeft: "20px" }}
                        span={4}
                      >
                        <div>
                          {Question2DB.map((RequestQ) => {
                            return (
                              <div style={{ marginBottom: "20px" }}>
                                {RequestQ.Question}
                              </div>
                            );
                          })}
                        </div>
                      </Grid.Col>
                      <Grid.Col
                        style={{ marginLeft: "-100px" }}
                        span={1.8}
                      >
                        <div>
                          <div>
                            {Question2DB.map((Request3) => {
                              return (
                                <div
                                  style={{
                                    gap: "60px",
                                    display: "flex",
                                    flexdirection: "row",
                                    marginBottom: "20px",
                                  }}
                                ></div>
                              );
                            })}
                          </div>
                          <div style={{ marginTop: "-60px" }}>
                            {Question2DB.map((Request1) => {
                              return (
                                <RadioGroup
                                  onChange={(value) => {
                                    setQuestion2((curr) => {
                                      return curr.map((v) => {
                                        if (v.id === Request1.id) {
                                          return {
                                            ...v,
                                            value: value,
                                          };
                                        }
                                        return v;
                                      });
                                    });
                                  }}
                                >
                                  <div
                                    style={{
                                      gap: "60px",
                                      display: "flex",
                                      flexdirection: "row",
                                      marginBottom: "20px",
                                    }}
                                  >
                                    {Request1.count}
                                    <Radio
                                      name={Request1.Question}
                                      value='5'
                                    />
                                    <Radio
                                      name={Request1.Question}
                                      value='4'
                                    />
                                    <Radio
                                      name={Request1.Question}
                                      value='3'
                                    />
                                    <Radio
                                      name={Request1.Question}
                                      value='2'
                                    />
                                    <Radio
                                      name={Request1.Question}
                                      value='1'
                                    />
                                  </div>
                                </RadioGroup>
                              );
                            })}
                          </div>
                        </div>
                      </Grid.Col>
                    </Grid>
                    <div className='Second-border'>
                      <Grid>
                        <Grid.Col
                          style={{ marginLeft: "20px" }}
                          span={3}
                        >
                          C.Course
                        </Grid.Col>
                      </Grid>
                    </div>
                    <Grid
                      style={{ marginTop: "20px" }}
                      grow
                      gutter='xl'
                    >
                      <Grid.Col
                        style={{ marginLeft: "20px" }}
                        span={4}
                      >
                        <div>
                          {Question3DB.map((RequestQ3) => {
                            return (
                              <div style={{ marginBottom: "20px" }}>
                                {RequestQ3.Question}
                              </div>
                            );
                          })}
                        </div>
                      </Grid.Col>
                      <Grid.Col
                        style={{ marginLeft: "-100px" }}
                        span={1.8}
                      >
                        <div style={{}}>
                          {Question3DB.map((Request1) => {
                            return (
                              <RadioGroup
                                onChange={(value) => {
                                  setQuestion3((curr) => {
                                    return curr.map((v) => {
                                      if (v.id === Request1.id) {
                                        return {
                                          ...v,
                                          value: value,
                                        };
                                      }
                                      return v;
                                    });
                                  });
                                }}
                              >
                                <div
                                  style={{
                                    gap: "60px",
                                    display: "flex",
                                    flexdirection: "row",
                                    marginBottom: "20px",
                                  }}
                                >
                                  {Request1.count}
                                  <Radio
                                    name={Request1.Question}
                                    value='5'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='4'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='3'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='2'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='1'
                                  />
                                </div>
                              </RadioGroup>
                            );
                          })}
                        </div>
                      </Grid.Col>
                    </Grid>

                    <div className='Second-border'>
                      <Grid>
                        <Grid.Col
                          style={{ marginLeft: "20px" }}
                          span={3}
                        >
                          D.Instructor
                        </Grid.Col>
                      </Grid>
                    </div>
                    <Grid
                      style={{ marginTop: "20px" }}
                      grow
                      gutter='xl'
                    >
                      <Grid.Col
                        style={{ marginLeft: "20px" }}
                        span={4}
                      >
                        <div>
                          {Question4DB.map((RequestQ6) => {
                            return (
                              <div style={{ marginBottom: "20px" }}>
                                {RequestQ6.Question}
                              </div>
                            );
                          })}
                        </div>
                      </Grid.Col>
                      <Grid.Col
                        style={{ marginLeft: "-100px" }}
                        span={1.8}
                      >
                        <div style={{}}>
                          {Question4DB.map((Request1) => {
                            return (
                              <RadioGroup
                                onChange={(value) => {
                                  setQuestion4((curr) => {
                                    return curr.map((v) => {
                                      if (v.id === Request1.id) {
                                        return {
                                          ...v,
                                          value: value,
                                        };
                                      }
                                      return v;
                                    });
                                  });
                                }}
                              >
                                <div
                                  style={{
                                    gap: "60px",
                                    display: "flex",
                                    flexdirection: "row",
                                    marginBottom: "20px",
                                  }}
                                >
                                  {Request1.count}
                                  <Radio
                                    name={Request1.Question}
                                    value='5'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='4'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='3'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='2'
                                  />
                                  <Radio
                                    name={Request1.Question}
                                    value='1'
                                  />
                                </div>
                              </RadioGroup>
                            );
                          })}
                        </div>
                      </Grid.Col>
                    </Grid>
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
                    onClick={() => {
                      const isAllAnswered1 = QuestionDB.every(
                        (q) => q.value && q.value !== "",
                      );
                      const isAllAnswered2 = Question2DB.every(
                        (q) => q.value && q.value !== "",
                      );
                      const isAllAnswered3 = Question3DB.every(
                        (q) => q.value && q.value !== "",
                      );
                      const isAllAnswered4 = Question4DB.every(
                        (q) => q.value && q.value !== "",
                      );

                      if (
                        !isAllAnswered1 ||
                        !isAllAnswered2 ||
                        !isAllAnswered3 ||
                        !isAllAnswered4
                      ) {
                        alert("Please answer all questions before proceeding.");
                        return;
                      }
                      nextStep();
                    }}
                  >
                    Next step
                  </Button>
                </Group>
              </Stepper.Step>
              <Stepper.Step
                label='Third step'
                description='Additional Feedback'
              >
                <div>
                  <div className='Feedback-text'>Additional Feedback</div>

                  <div className='Feedback-question'>
                    <div className='Feedback-input'>
                      <div>
                        {FeedbackQ.map((Feedbacklist) => {
                          return (
                            <div style={{ marginBottom: "20px" }}>
                              {Feedbacklist.id} .{" "}
                              {Feedbacklist.QuestionFeedback}
                              <Input
                                radius='xl'
                                id={"Feedback" + Feedbacklist.id}
                                placeholder='Input Answer'
                                value={Feedbacklist.value}
                                onChange={(e) => {
                                  setFeedback((curr) => {
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
                      </div>
                    </div>
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
                  <Button onClick={nextStep}>Next step</Button>
                </Group>
              </Stepper.Step>
              <Stepper.Step
                label='Final step'
                description='Verify'
              >
                <div className='Feedback-text'>Survey Information</div>
                <div>
                  <div className='Center-Step4'>
                    <div className='Borderline-Step4'>
                      <label className='Step4'>Name :</label>
                      <label style={{ marginLeft: "170px" }}>{Name}</label>{" "}
                      <br></br>{" "}
                    </div>
                    <div className='Borderline-Step4'>
                      <label className='Step4'>Course :</label>
                      <label style={{ marginLeft: "163px" }}>
                        {courses.find((v) => v.id.toString() === Course)?.Code}
                      </label>
                      <br></br>
                    </div>
                    <div className='Borderline-Step4'>
                      <label className='Step4'>Date :</label>
                      <label style={{ marginLeft: "178px" }}>
                        {valuenowDate.toDateString()}
                      </label>
                      <br></br>
                    </div>
                    <div className='Borderline-Step4'>
                      <label className='Step4'>Instructor :</label>
                      <label style={{ marginLeft: "140px" }}>
                        {Instructor}
                      </label>
                      <br></br>
                    </div>
                    <div className='Borderline-Step4'>
                      <label className='Step4'>Training Date :</label>
                      <label style={{ marginLeft: "110px" }}>
                        {Trainingvalue}
                      </label>
                      <br></br>
                    </div>
                    <div className='Borderline-Step4'>
                      <label className='Step4'>Reg.# :</label>
                      <label style={{ marginLeft: "170px" }}>{RegNo}</label>
                    </div>
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
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    {" "}
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
    </>
  );
}

export default App;
