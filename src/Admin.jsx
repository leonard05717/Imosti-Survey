import {useEffect, useState } from 'react'
import './Admin.css';
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
   Tabs,
   Table,
   ThemeIcon,
   Paper,
   ScrollArea,
  

  } from '@mantine/core';
import { IconBrandBlackberry, IconCalendar , IconCertificate, IconChartHistogram, IconEdit, IconExposureMinus1, IconMassage, IconMessage2Cog, IconRowInsertBottom, IconSearch, IconSettings, IconTrash, IconUser, IconUserMinus, IconUserShare,} from '@tabler/icons-react';

import { DatePicker ,  DatePickerInput } from '@mantine/dates';
import { Label, PieChart } from 'recharts';
import { data, useNavigate } from 'react-router-dom';
import { size } from 'lodash';
import { AreaChart } from '@mantine/charts';
import '@mantine/core/styles.css';



function Admin() {

  
    const navigate = useNavigate()

    const [QuestionQues, setQuestion] = useState([
      {
        Question: "",
       
      }
    ]);

    const [QuestionB, setQuestionB] = useState([
      {
        Question2: "",
       
      }
    ]);
    const [QuestionC, setQuestionC] = useState([
      {
        Question3:"",
       
      }
    ]);

    const [QuestionD, setQuestionD] = useState([
      {
        Question4:"",
       
      }
    ]);

    async function loadData() {
      const { error, data } = await supabase.from("A.Services").select();
      setQuestion(data) 
  
    }

    async function loadDataB() {
      const { error, data } = await supabase.from("B.Facilities").select();
      setQuestionB(data) 
  
    }
    async function loadDataC() {
      const { error, data } = await supabase.from("C.Course").select();
      setQuestionC(data) 
  
    }
    async function loadDataD() {
      const { error, data } = await supabase.from("D.Instructor").select();
      setQuestionD(data) 
  
    }

      useEffect(() => {
        loadData()
        loadDataB()
        loadDataC()
        loadDataD()

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

        const sectionSubscriptionB = supabase
        .channel("realtime:B.Facilities")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "B.Facilities" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setQuestionB((prev) => [
                payload.new,
                ...prev,
              ]);
            } else if (payload.eventType === "UPDATE") {
              setQuestionB((prev) =>
                prev.map((item) =>
                  item.id === payload.new.id
                    ? (payload.new)
                    : item
                )
              );
            } else if (payload.eventType === "DELETE") {
              setQuestionB((prev) =>
                prev.filter((item) => item.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

        const sectionSubscriptionC = supabase
        .channel("realtime:C.Course")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "C.Course" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setQuestionC((prev) => [
                payload.new,
                ...prev,
              ]);
            } else if (payload.eventType === "UPDATE") {
              setQuestionC((prev) =>
                prev.map((item) =>
                  item.id === payload.new.id
                    ? (payload.new)
                    : item
                )
              );
            } else if (payload.eventType === "DELETE") {
              setQuestionC((prev) =>
                prev.filter((item) => item.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

        const sectionSubscriptionD = supabase
        .channel("realtime:D.Instructor")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "D.Instructor" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setQuestionD((prev) => [
                payload.new,
                ...prev,
              ]);
            } else if (payload.eventType === "UPDATE") {
              setQuestionD((prev) =>
                prev.map((item) =>
                  item.id === payload.new.id
                    ? (payload.new)
                    : item
                )
              );
            } else if (payload.eventType === "DELETE") {
              setQuestionD((prev) =>
                prev.filter((item) => item.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();


        return () => {
          supabase.removeChannel(sectionSubscription)
          supabase.removeChannel(sectionSubscriptionB)
          supabase.removeChannel(sectionSubscriptionC)
          supabase.removeChannel(sectionSubscriptionD)
        }
    
        
      }, [])


  return (

    
    <div className='Devider-tabs'>

    
    <div className='Tabs-Main'>
        <div>
        <AspectRatio ratio={1} flex="0 0 200px" style={{display:'flex'}}>
                <Image  style={{marginLeft: '-70px' , marginTop: '-80px'}}  
                fit='contain'
                h={250} 
                w={250}
                   src="../Picture/Admin-Logo.png"
                  alt="Avatar"
              />
           
                    </AspectRatio>
                 
        </div>
    <div>
    
    <Tabs size='xl' variant="pills"  defaultValue="gallery" orientation="vertical" >
    <Tabs.List >
      <div style={{paddingRight:'55px', paddingLeft:'50px' , borderBottom:'2px solid black'}}><Tabs.Tab className='tab-list' leftSection={<IconChartHistogram  size={20}/>} value="Analytics">Analytics</Tabs.Tab></div>
      <div style={{paddingRight:'63px', paddingLeft:'50px' , borderBottom:'2px solid black'}} className='Line-tab'><Tabs.Tab className='tab-list' leftSection={<IconCertificate  size={20}/>} 
       onClick={() => {
            navigate("course")}}
       value="Course">Courses</Tabs.Tab></div>
      <div style={{paddingRight:'90px', paddingLeft:'50px' , borderBottom:'2px solid black'}} className='Line-tab'><Tabs.Tab className='tab-list' leftSection={<IconUserShare   size={20}/>} value="Staff">Staff</Tabs.Tab></div>
      <div style={{paddingRight:'23px', paddingLeft:'50px' , borderBottom:'2px solid black'}} className='Line-tab'><Tabs.Tab className='tab-list' leftSection={<IconMessage2Cog  size={20}/>} value="Maintenance">Maintenance</Tabs.Tab></div>
      <div style={{paddingRight:'61.5px', paddingLeft:'50px' , borderBottom:'2px solid black'}} className='Line-tab'><Tabs.Tab className='tab-list' leftSection={<IconSettings  size={20}/>} value="Settings">Settings</Tabs.Tab></div>
    </Tabs.List>
        <div >
          <div className='Tabs-panelborder'>
          <Tabs.Panel  value="Analytics">
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel  value="Course">
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel  value="Staff">
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel  value="Maintenance">
        <div>
          <div>
            <h1 style={{marginLeft:'30px' , display:'flex'}}>Maintenance
            <Input style={{display:'flex' , marginLeft: '290px' , justifyContent:'center' }} leftSection={<IconSearch size={16} />} variant="filled" size="md" radius="xl" placeholder="Search" />
            <label style={{marginLeft:'400px'}}>Leo</label>
            <ThemeIcon  size="xl" color="black" autoContrast>
            <IconUser size={20} />
            </ThemeIcon>
            
            </h1> 
          </div>
          <ScrollArea  h={600} style={{borderTop:'2px solid black', backgroundColor:'	rgb(240, 235, 235)'}}>
            {
          <div   style={{ marginRight: '-17px' , height:'600px' }}>
            <div style={{ backgroundColor: 'whitesmoke', border:'2px solid black' , margin:'50px'}}>
              <h2 style={{display:'flex' , justifyContent: 'center'}}>Training Evaluation</h2>
              <div style={{marginLeft:'10px'}}>
                <h3>A.Services</h3>
                <div>
                {QuestionQues.map((keys) => {
          return (
            <div className='item'>
              <div>{keys.Question}</div>
              <div>
              <ActionIcon color="red" onClick={() => {
              }}>
                <IconTrash size={17} />
              </ActionIcon>
              </div>
            </div>
            )
          })}
          </div>     
          </div>
              
            </div>

            <div style={{backgroundColor: 'whitesmoke' , border:'2px solid black' , margin:'50px'}}>
              <h2 style={{display:'flex' , justifyContent: 'center'}}>Training Evaluation</h2>
              <div style={{marginLeft:'10px'}}>
                <h3>B.Facilities</h3>
                <div>
                {QuestionB.map((keyb) => {
          return (
            <div className='item'>
              <div>{keyb.Question2}</div>
              <div>
              <ActionIcon color="red" onClick={() => {
              }}>
                <IconTrash size={17} />
              </ActionIcon>
              </div>
            </div>
            )
          })}
          </div>     
          </div>  
            </div>

            <div style={{backgroundColor: 'whitesmoke' , border:'2px solid black' , margin:'50px'}}>
              <h2 style={{display:'flex' , justifyContent: 'center'}}>Training Evaluation</h2>
              <div style={{marginLeft:'10px'}}>
                <h3>C.Course</h3>
                <div>
                {QuestionC.map((keyc) => {
          return (
            <div className='item'>
              <div>{keyc.Question3}</div>
              <div>
              <ActionIcon color="red" onClick={() => {
              }}>
                <IconTrash size={17} />
              </ActionIcon>
              </div>
            </div>
            )
          })}
          </div>     
          </div>  
            </div>

            <div style={{backgroundColor: 'whitesmoke' , border:'2px solid black' , margin:'50px'}}>
              <h2 style={{display:'flex' , justifyContent: 'center'}}>Training Evaluation</h2>
              <div style={{marginLeft:'10px'}}>
                <h3>D.Instructor</h3>
                <div>
                {QuestionD.map((keyD) => {
          return (
            <div className='item'>
              <div>{keyD.Question4}</div>
              <div>
              <ActionIcon color="red" onClick={() => {
              }}>
                <IconTrash size={17} />
              </ActionIcon>
              </div>
            </div>
            )
          })}
          </div>     
          </div>  
            </div>
            
            
          </div>
        }
        </ScrollArea>
         
        </div>
      </Tabs.Panel>

      <Tabs.Panel  value="Settings">
        Gallery tab content
      </Tabs.Panel>
          </div>
      
        </div>
    
      
       
      </Tabs>
   </div>
  </div>
  
  <div >

        <div style={{}} >

        </div>
    

  </div>
        
  
  </div>
  )
}

export default Admin