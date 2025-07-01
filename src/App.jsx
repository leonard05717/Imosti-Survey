import { useState } from 'react'
import './App.css';
import { createClient } from '@supabase/supabase-js'
import { Stepper, Button, Group, TextInput, ActionIcon , Modal, FOCUS_CLASS_NAMES} from '@mantine/core';
import { IconCalendar, IconEdit, IconHeart } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { DatePicker ,  DatePickerInput } from '@mantine/dates';
import { Container } from 'postcss';


const supabaseUrl = 'https://ppplvgibvloalxknegjt.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcGx2Z2lidmxvYWx4a25lZ2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjk2NTcsImV4cCI6MjA2NjkwNTY1N30.cre2CuWbYnEpjgta3KUShw4qMNae1h7xjL2rPLX1VKw'
const supabase = createClient(supabaseUrl, key)

function App() {
  const [count, setCount] = useState(0)
  const [active, setActive] = useState(1);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));    
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const [isModalOpen, setIsModalOpen] = useState(false)

  
  const [TrainingValue, SetTrainingValue] = useState(null);
  const [valuenowDate, SetvaluenowDate] = useState(null);
  
  
  const [Instructor, setInstructor] = useState("")
  const [Course, SetCourse] = useState("")
  const [Reg, SetReg] = useState("")
  
  async function nextStep1() {
    
    
    const firstname = document.getElementById("Name").value
    const CInstructor = document.getElementById("Instructor").value
    const CCourse = document.getElementById("Course").value
    const CReg = document.getElementById("Reg").value
   console.log(firstname , CInstructor , CCourse ,TrainingValue,valuenowDate, CReg);

   const { error } = await supabase.from("users").insert({
    firstname: firstname,
    Instructor:CInstructor,
    Course:CCourse,
    TrainingD:TrainingValue,
    DateN:valuenowDate,
    Reg:CReg,
  })


  }

  return (
    <>
      <div className='Main-Container'>
      <div>
      
        <div className='Survey-acction'>
         <h2>Survey</h2>
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
              <div className='input-design'>
              <div className='Input-text' >
                Name:
                <input style={{marginTop: '-20px'}} id='Name' className='input' type='text' placeholder='Full Name' />
                Instructor:
                <input style={{marginTop: '-20px'}} id='Instructor' className='input' type='text' placeholder='Instructor' />
                Course:
                <input style={{marginTop: '-20px'}} id='Course' className='input' type='text' placeholder= 'Course' />
                </div>
                <div className='right-container'>
                <div className='m_38a85659-mantine-popover-dropdown'>
                <div className='left-info'> 
                      <DatePickerInput 
                       leftSection={<IconCalendar size={18} stroke={1.5} />}
                       
                      label="Training Date"
                      placeholder="Pick date"
                      value={TrainingValue}
                      onChange={SetTrainingValue}
                      
                       />
            
              </div>
              <div style={{marginTop:'6px'}}> 
              
                       
                       <DatePickerInput 
                        leftSection={<IconCalendar size={18} stroke={1.5} />}
                        
                         label="Date Now"
                         placeholder="Pick date"
                         value={valuenowDate}
                         onChange={SetvaluenowDate}
                     
                       />
                       
               </div>
               </div>
              Reg#
              <input style={{width:'300px', marginTop: '-20px'}} id='Reg' className='input' type='text' placeholder= '#' />
              </div>

              </div>
              <Group justify="center" mt="xl">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep1}>Next step</Button>
              </Group>
            </div>
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Check Survey">
            Step 2 content: Verify email
          </Stepper.Step>
          <Stepper.Step label="Third step" description="Additional Feedback">
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Verify">
            Step 4 content: save
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
