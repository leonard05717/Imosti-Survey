import {useEffect, useState } from 'react'
import './App.css';
import supabase from "./supabase";
import {
   Stepper, 
   Button, 
   Group, 
   TextInput,
   Checkbox, 
   ActionIcon ,
   Grid, 
   Modal, 
   AspectRatio , 
   Image , 
   Input,
   ModalTitle,
   px,
   Rating,
   
  

  } from '@mantine/core';
import { IconBrandAndroid, IconBrandBlackberry, IconCalendar} from '@tabler/icons-react';

import { DatePicker ,  DatePickerInput } from '@mantine/dates';
import { Label } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { keys } from 'lodash';



function App() {
  const navigate = useNavigate()
  const [count, setCount] = useState(0)
  const [active, setActive] = useState(1);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));    
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const [isModalOpen, setIsModalOpen] = useState(false)
  

  const [loading, setLoading] = useState(false)

  const string = "";
  const [Names, setName] = useState('');
  const [Instructor, setInstructor] = useState('');
  const [RegNo, setRegNo] = useState('');
  const [valuenowDate, SetvaluenowDate] = useState('');
  const [Trainingvalue, setTrainingValue] = useState([null, null]);

  const [Q1 , setQ1] = useState([''])
  const [Dropselect, setDropselect] = useState('');
  const [valueid , setvalueid] = useState();

  const [feedbackans , setFeedbackans] = useState(['']);
  
  


const trowfeedback = (event) => {
  const index = 0;
  setFeedbackans(prev => ({...prev , [index+1]: event.target.value }));
 }

  const Drophandle = (event) => {
  setDropselect(event.target.value);
  };

  const handleChange = (id , rate) => {
    setQ1(prev => ({...prev ,[id]: rate}))
  }


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



  const [Questioncount, setQuestioncount] = useState([
    {
      Question: "",
      id:"",
    }
  ])
  
  const [QuestionDB, setQuestion] = useState([
    {
      Question: "",
     
    }
  ])

  const [Question2DB, setQuestion2] = useState([
    {
      Question: "",
    }
  ])

  const [Question3DB, setQuestion3] = useState([
    {
      Question: "",
    }
  ])

  const [Question4DB, setQuestion4] = useState([
    {
      Question: "",
    }
  ])

  const [FeedbackQ, setFeedback] = useState([
    {
        QuestionFeedback: "",
     
    }
  ])

  const [CourseDrop , setCourseDrop] = useState([
    {
      Course:"",
      Code:"",

    }

  ])




  async function nextStep2() {
    console.log(Q1  , valueid)
    
  }

  async function sample() {
    const numbers = [10, 21, 32 , 20];

    const average = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
    const roundedAverage = average.toFixed(2);
    
    console.log(roundedAverage);
    
  }
  
  async function nextStep1() {

    
    setLoading(true)

   

   const { error } = await supabase.from("Info-Training").insert({
    Name: Names,
    Instructor:Instructor,
    Course:Dropselect,
    TrainingD:Trainingvalue,
    DateN:valuenowDate,
    Reg:RegNo,
    
    
  })
  console.log(error)
  setLoading(false)
  nextStepQ()
  }

  async function nextStepQ() {
    setLoading(true)
    
    {Questioncount.map(async (keys) => {
      const index = 1
      const { error } = await supabase.from("Score-Save").insert({
        Name:Names,
        Score:Q1,
        QID:keys.id
      })

      
      return(index+1)
    })}
    
 
  console.log("success2")
  setLoading(false)
  setIsModalOpen(false)
  }

  async function loadCrouseDrop() {
    const { error, data } = await supabase.from("Course").select("");
    setCourseDrop(data) 

  }

  async function loadDataQcount() {
    const { error, data } = await supabase.from("Questioner").select();
    setQuestioncount(data) 

  }

  async function loadData() {
    const { error, data } = await supabase.from("Questioner").select("id,Question ").eq("Criteria","A");
    setQuestion(data) 

  }
  async function loadData2() {
    const { error, data } = await supabase.from("Questioner").select("id,Question").eq("Criteria","B");
    setQuestion2(data) 

    const {data2} = await supabase.from("Questioner").select().in("")
 
  }
  async function loadData3() {
    const { error, data } = await supabase.from("Questioner").select("id,Question").eq("Criteria","C");
    setQuestion3(data) 

  }

  async function loadData4() {
    const { error, data } = await supabase.from("Questioner").select("id,Question").eq("Criteria","D");
    setQuestion4(data) 

  }

  async function Feedback1() {
    const { error, data } = await supabase.from("Feedback-Question").select();
    setFeedback(data) 

  }


  useEffect(() => {

    
    loadData2()
    loadData3()
    loadData4()
    Feedback1()
    loadData() 
    loadCrouseDrop()
    loadDataQcount()

    const sectionSubscription = supabase
    .channel("realtime:users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "A.Services" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setQuestion((prev) => [
            payload.new,
            ...prev,
          ]);
        } else if (payload.eventType === "UPDATE") {
          setQuestion((prev) =>
            prev.map((item) =>
              item.id === payload.new.id
                ? (payload.new)
                : item
            )
          );
        } else if (payload.eventType === "DELETE") {
          setQuestion((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();

    const section2Subscription = supabase
    .channel("realtime:B.Facilities")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "B.Facilities" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setQuestion2((prev) => [
            payload.new,
            ...prev,
          ]);
        } else if (payload.eventType === "UPDATE") {
          setQuestion2((prev) =>
            prev.map((item) =>
              item.id === payload.new.id
                ? (payload.new)
                : item
            )
          );
        } else if (payload.eventType === "DELETE") {
          setQuestion2((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();

    const section3Subscription = supabase
    .channel("realtime:C.Course")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "C.Course" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setQuestion3((prev) => [
            payload.new,
            ...prev,
          ]);
        } else if (payload.eventType === "UPDATE") {
          setQuestion3((prev) =>
            prev.map((item) =>
              item.id === payload.new.id
                ? (payload.new)
                : item
            )
          );
        } else if (payload.eventType === "DELETE") {
          setQuestion3((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();

    const section4Subscription = supabase
    .channel("realtime:D.Instructor")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "D.Instructor" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setQuestion4((prev) => [
            payload.new,
            ...prev,
          ]);
        } else if (payload.eventType === "UPDATE") {
          setQuestion4((prev) =>
            prev.map((item) =>
              item.id === payload.new.id
                ? (payload.new)
                : item
            )
          );
        } else if (payload.eventType === "DELETE") {
          setQuestion4((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();

    const sectionFeedBack = supabase
    .channel("realtime:Feedback")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "Feedback-Question" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setFeedback((prev) => [
            payload.new,
            ...prev,
          ]);
        } else if (payload.eventType === "UPDATE") {
          setFeedback((prev) =>
            prev.map((item) =>
              item.id === payload.new.id
                ? (payload.new)
                : item
            )
          );
        } else if (payload.eventType === "DELETE") {
          setFeedback((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();

    const sectionDropdown = supabase
    .channel("realtime:Course")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "Course" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setCourseDrop((prev) => [
            payload.new,
            ...prev,
          ]);
        } else if (payload.eventType === "UPDATE") {
          setCourseDrop((prev) =>
            prev.map((item) =>
              item.id === payload.new.id
                ? (payload.new)
                : item
            )
          );
        } else if (payload.eventType === "DELETE") {
          setCourseDrop((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();

    const sectionQcount = supabase
    .channel("realtime:Questioner")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "Questioner" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setQuestioncount((prev) => [
            payload.new,
            ...prev,
          ]);
        } else if (payload.eventType === "UPDATE") {
          setQuestioncount((prev) =>
            prev.map((item) =>
              item.id === payload.new.id
                ? (payload.new)
                : item
            )
          );
        } else if (payload.eventType === "DELETE") {
          setQuestioncount((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();


    
    return () => {
      supabase.removeChannel(sectionSubscription)
      supabase.removeChannel(section2Subscription)
      supabase.removeChannel(section3Subscription)
      supabase.removeChannel(section4Subscription)
      supabase.removeChannel(sectionFeedBack)
      supabase.removeChannel(sectionDropdown)
      supabase.removeChannel(sectionQcount)
    }

    
  }, [])

  
  return (
    <>

        <Modal marginTop={20} radius={20} centered='true' opened={isModalOpen} onClose={() => { setIsModalOpen(false)}}>
        <div style={{ display: 'flex' }}> 
                <AspectRatio ratio={1} flex="0 0 200px">
                <Image  
                h={70} 
                w={70}
                   src="../Picture/Logo.png"
                  alt="Avatar"
              />
           
                    </AspectRatio>
                    <div className='Aspect-text'>International Maritime & Offshore <div className='Aspect-text2'> Safety Training Institute</div></div>
                         
          </div>
          <div className='Response'>Your response has been recorded</div> 
          <Button className='Button-done' onClick={nextStep1}>Done</Button>

            
       
        </Modal>

    
      <div className='Main-Container'>
      <div style={{backgroundColor:'black'}}>
      
      <div className='logo' style={{ display: 'flex' }}> 
                <AspectRatio style={{  marginTop: '10px' , marginBottom: '30px'} } ratio={1} flex="0 0 200px" >
                
                <Image 

                h={100} 
                w={300}
                   src="../Picture/Admin-Logo.png"
                  alt="Avatar"
              />
                    </AspectRatio>
                    
                  
          </div>
      </div>
      <div className='stepper-center'>
        <div className='Stepper-Container'>
       <Stepper active={active} onStepClick={setActive} size='xs' iconSize={62} styles={{
            content: {
              paddingBottom: 60,
              
            },
            root: {
              paddingTop: 30,
              height: "calc(100vh - 12rem)",
              
            },
          
          }}>
         <Stepper.Step label="First step" description="Get Information">
            <div className='Input-Center'>
            <div className='font-size'>
              Fillup All Information
              </div>
              <div style={{display:'flex' , justifyContent:'center' , marginBottom: '30px'}}>
              INSTRUCTION: Please Mark the Circle that applies and corresponds to your assessment of each item.
              </div>
              <div className='input-design'>
              <div className='Input-text' >
                Name:
                <input style={{marginTop: '-20px'}} onChange={NameTrasfer} id='Name' className='input' type='text' placeholder='Full Name' />
                Instructor:
                <input style={{marginTop: '-20px'}} onChange={InstructorTrasfer} id='Instructor' className='input' type='text' placeholder='Instructor' />
                Course:
                
                    
                <select style={{marginTop: '-20px' , padding:'1px'}} id="dropdown" value={Dropselect} onChange={Drophandle}>
                    <option>-- Select Course --</option>
                    {CourseDrop.map((dropdown) =>{
                      return(<option>{dropdown.Code}</option>  ) })}
                </select>
              
                </div>
                <div className='right-container'>
                <div className='m_38a85659-mantine-popover-dropdown'>
                <div className='left-info'> 
                     
                         <DatePickerInput
                          type="range"
                          label="Training Date"
                          placeholder="Pick dates range"
                          value={Trainingvalue}
                          onChange={setTrainingValue}
                          labelProps={{ style: { fontWeight: 'bold' } }} 
                          />


              </div>
              <div style={{marginTop:'6px'}}> 
              
                       
                       <DatePickerInput 
                        leftSection={<IconCalendar size={18} stroke={1.5} />}
                        
                         label="Date Now"
                         placeholder='Pick Date'
                         value={valuenowDate}
                         onChange={SetvaluenowDate}
                         labelProps={{ style: { fontWeight: 'bold' } }}  
                     
                       />
                       
               </div>
               </div>
              Company
              <input style={{width:'300px', marginTop: '-20px'}} onChange={RegTrasfer} id='Reg' className='input' type='text' placeholder= 'Insert full company Name' />
              </div>

              </div>
              <Group justify="center" mt="xl">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Next step</Button>
              </Group>
            </div>
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Check Survey">
            <div className='Maincontainer-second'>
                <div className='Main-text'>
                  Survey Form
                </div>
                <div className='Second-text'>
                  <label style={{fontweight: 'bold'}}>INSTRUCTION:</label>Please Mark the Circle that applies and corresponds to your assessment of each item.
                            
                </div>

            <div className='first-border'>

              <Grid justify="space-evenly">
                <Grid.Col span={1.8}>CRITERIA</Grid.Col>
                <Grid.Col style={{marginLeft:'185px'}} span={1.8}>RATING</Grid.Col>
               </Grid>
            </div>
            <div className='Second-border'>
               <Grid grow gutter="xl">
                  <Grid.Col style={{ marginLeft: '20px'}} span={3}></Grid.Col>      
                  <Grid.Col style={{}} span={1.8}>
                    <Grid style={{justifyContent: 'space-evenly'}}>
                    <Grid.Col span={2.4}>5</Grid.Col>
                    <Grid.Col span={2.4}>4</Grid.Col>
                    <Grid.Col span={2.4}>3</Grid.Col>
                    <Grid.Col span={2.4}>2</Grid.Col>
                    <Grid.Col span={2.4}>1</Grid.Col>
                    </Grid>
                  </Grid.Col>
               </Grid> 
                
               <label style={{display: 'flex' , fontSize: '12px' , marginLeft: '56%'}}>Superior
                <label style={{marginLeft: '38px', fontSize: '12px' }}>Exceeds</label> 
                <label style={{marginLeft: '45px', fontSize: '12px' }}>Meets</label>
                <label style={{marginLeft: '47px', fontSize: '12px' }}>Needs</label>
                <label style={{marginLeft: '52px', fontSize: '12px' }}>Below</label>
               </label>
               <label style={{display: 'flex' , fontSize: '12px' , marginLeft: '60%', marginTop: '-6px'}}>
                <label style={{marginLeft: '38px', fontSize: '12px' }}>Expectation</label> 
                <label style={{marginLeft: '16px', fontSize: '12px' }}>Expectation</label>
                <label style={{marginLeft: '16px', fontSize: '12px' }}>Development</label>
                <label style={{marginLeft: '22px', fontSize: '12px' }}>Expectation</label>
               </label>
               
               </div>
               <Grid style={{borderBottom: '2px solid black'}}>
               <Grid.Col className='AService' style={{marginLeft: '20px' }} span={3}>A.Services</Grid.Col>  
               </Grid>
               <div className='Question-Sheet'>
               
               <Grid style={{marginTop: '20px'}} grow gutter="xl">
                 <Grid.Col style={{ marginLeft: '20px'}} span={4}>
                  <div>
                  {QuestionDB.map((RequestQ1 , index) =>{
                    return(
                      <div style={{marginBottom: '20px'}}>{index + 1} . {RequestQ1.Question}</div>
                    )
                  })}
                  </div>
                 </Grid.Col>
                 <Grid.Col style={{marginLeft: '-100px' }} span={1.8}>
                 <div>
                  {QuestionDB.map((Request1) =>{
                    return(

                      <div style={{ gap: '60px',display:'flex' , flexdirection: 'row' , marginBottom: '20px' }}>{Request1.count}
                      <Checkbox      
                   radius="xl"
                  size="md"
                  value={Request1.id}
                  onChange={() => handleChange(Request1.id , "5")}
                   />
                   <Checkbox
                   radius="xl"
                  size="md"
                  value="2"
                  onChange={() => handleChange(Request1.id , "4")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="3"
                  onChange={() => handleChange(Request1.id , "3")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="4"
                  onChange={() => handleChange(Request1.id , "2")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="5"
                  onChange={() => handleChange(Request1.id , "1")}
                   />
                  
                      </div>
                    )

                  })}
                  </div>
                  
                </Grid.Col>   
                 </Grid>
                 <div className='Second-border'>
                 <Grid>
                 <Grid.Col style={{marginLeft:'20px'}} span={3}>B.Facilities</Grid.Col>
                 </Grid>
                 </div>
                 <Grid style={{marginTop: '20px'}} grow gutter="xl">
                 <Grid.Col style={{ marginLeft: '20px'}} span={4}>
                  <div>
                  {Question2DB.map((RequestQ) =>{
                    return(
                      
                      <div style={{marginBottom: '20px'}}>{RequestQ.Question}</div>
                    )
                  })}
                  </div>
                 </Grid.Col>
                 <Grid.Col style={{marginLeft: '-100px' }} span={1.8}>
                 <div>
                  {Question2DB.map((Request3) =>{
                    return(
                      <div style={{ gap: '60px',display:'flex' , flexdirection: 'row' , marginBottom: '20px' }}>{Request3.count}
                      <Checkbox      
                   radius="xl"
                  size="md"
                  value="1"
                  onChange={() => handleChange(Request3.id , "5")}
                   />
                   <Checkbox
                   radius="xl"
                  size="md"
                  value="2"
                  onChange={() => handleChange(Request3.id , "4")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="3"
                  onChange={() => handleChange(Request3.id , "3")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="4"
                  onChange={() => handleChange(Request3.id , "2")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="5"
                  onChange={() => handleChange(Request3.id , "1")}
                   />
                  
                      </div>
                    )

                  })}
                  </div>
                  
                </Grid.Col>   
                 </Grid>
                 <div className='Second-border'>
                 <Grid>
                 <Grid.Col style={{marginLeft:'20px'}} span={3}>C.Course</Grid.Col>
                 </Grid>
                 </div>
                 <Grid style={{marginTop: '20px'}} grow gutter="xl">
                 <Grid.Col style={{ marginLeft: '20px'}} span={4}>
                  <div>
                  {Question3DB.map((RequestQ3) =>{
                    return(
                      
                      <div style={{marginBottom: '20px'}}>{RequestQ3.Question}</div>
                    )
                  })}
                  </div>
                 </Grid.Col>
                 <Grid.Col style={{marginLeft: '-100px' }} span={1.8}>
                 <div>
                  {Question3DB.map((RequestQ4) =>{
                    return(
                      <div style={{ gap: '60px',display:'flex' , flexdirection: 'row' , marginBottom: '20px' }}>{RequestQ4.count}
                      <Checkbox      
                   radius="xl"
                  size="md"
                  value="1"
                  onChange={() => handleChange(RequestQ4.id , "5")}
                   />
                   <Checkbox
                   radius="xl"
                  size="md"
                  value="2"
                  onChange={() => handleChange(RequestQ4.id , "4")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="3"
                  onChange={() => handleChange(RequestQ4.id , "3")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="4"
                  onChange={() => handleChange(RequestQ4.id , "2")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="5"
                  onChange={() => handleChange(RequestQ4.id , "1")}
                   />
                  
                      </div>
                    )

                  })}
                  </div>
                  
                </Grid.Col>   
                 </Grid>

                 <div className='Second-border'>
                 <Grid>
                 <Grid.Col style={{marginLeft:'20px'}} span={3}>D.Instructor</Grid.Col>
                 </Grid>
                 </div>
                 <Grid style={{marginTop: '20px'}} grow gutter="xl">
                 <Grid.Col style={{ marginLeft: '20px'}} span={4}>
                  <div>
                  {Question4DB.map((RequestQ6) =>{
                    return(
                      
                      <div style={{marginBottom: '20px'}}>{RequestQ6.Question}</div>
                    )
                  })}
                  </div>
                 </Grid.Col>
                 <Grid.Col style={{marginLeft: '-100px' }} span={1.8}>
                 <div>
                  {Question4DB.map((RequestQ5) =>{
                    return(
                      <div style={{ gap: '60px',display:'flex' , flexdirection: 'row' , marginBottom: '20px' }}>{RequestQ5.count}
                      <Checkbox      
                   radius="xl"
                  size="md"
                  value="1"
                  onChange={() => handleChange(RequestQ5.id , "5")}
                   />
                   <Checkbox
                   radius="xl"
                  size="md"
                  value="2"
                  onChange={() => handleChange(RequestQ5.id , "4")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="3"
                  onChange={() => handleChange(RequestQ5.id , "3")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="4"
                  onChange={() => handleChange(RequestQ5.id , "2")}
                   />
                     <Checkbox
                   radius="xl"
                  size="md"
                  value="5"
                  onChange={() => handleChange(RequestQ5.id , "1")}
                   />
                  
                      </div>
                    )

                  })}
                  </div>
                  
                </Grid.Col>   
                 </Grid>
              </div>
            </div>
            <Group justify="center" mt="xl">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Next step</Button>
              </Group>
          </Stepper.Step>
          <Stepper.Step label="Third step" description="Additional Feedback">
            <div >
                    <div className='Feedback-text'>
                    Additional Feedback
                    </div>
                  
                  <div className='Feedback-question'>
                    <div className='Feedback-input'>
                       <div>
                       {FeedbackQ.map((Feedbacklist , index) =>{
                       return(
                       <div style={{marginBottom: '20px'}}>{index + 1} . {Feedbacklist.QuestionFeedback} 
                       <Input radius="xl" id={'Feedback'+Feedbacklist.id} onChange={trowfeedback} placeholder="Input Answer" />
                       </div>
                       
                       )
                       })} 
        
                      </div>
                          
                    </div>
                  </div>
            </div>
            <Group justify="center" mt="xl">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Next step</Button>
              </Group>
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Verify">
              <div className='Feedback-text'>
              Survey Information
              </div>
              <div >
                  <div className='Center-Step4'>
                    <div className='Borderline-Step4'><label className='Step4'>Name :</label><label style={{marginLeft:'170px'}} >{Names}</label> <br></br> </div>
                    <div className='Borderline-Step4'><label className='Step4'>Course :</label><label style={{marginLeft:'163px'}} >{Dropselect}</label><br></br></div>
                    <div className='Borderline-Step4'><label className='Step4'>Date :</label><label style={{marginLeft:'178px'}} >{valuenowDate}</label><br></br></div>
                    <div className='Borderline-Step4'><label className='Step4'>Instructor :</label><label style={{marginLeft:'140px'}}>{Instructor}</label><br></br></div>
                    <div className='Borderline-Step4'><label className='Step4'>Training Date :</label><label style={{marginLeft:'110px'}}>{Trainingvalue}</label><br></br></div>
                    <div className='Borderline-Step4'><label className='Step4'>Company :</label><label style={{marginLeft:'170px'}}>{RegNo}</label></div>
                    </div>
              </div>
              <Group justify="center" mt="xl">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={() => {setIsModalOpen(true) }}> Submit</Button>
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
     
    
  )
}

export default App
