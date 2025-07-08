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
import { IconBrandBlackberry, IconCalendar , IconCertificate, IconChartHistogram, IconEdit, IconExposureMinus1, IconMassage, IconMessage2Cog, IconPlus, IconRowInsertBottom, IconSearch, IconSettings, IconTrash, IconUser, IconUserMinus, IconUserShare,} from '@tabler/icons-react';

import { DatePicker ,  DatePickerInput } from '@mantine/dates';
import { Label, PieChart } from 'recharts';
import { data, useNavigate } from 'react-router-dom';
import { keys, size } from 'lodash';
import { AreaChart } from '@mantine/charts';
import '@mantine/core/styles.css';



function Admin() {

  
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenVerify, setIsModalOpenVerify] = useState(false)
    const [StaffS, setStaffS] = useState(false)
    const [IDs, setID] = useState('');
    const [anyQuesttrow, setQ] = useState('');
    
    const [IDStaff, setIDStaff] = useState('');


   

    async function StaffAc(id) {
      setIDStaff(id);
      setStaffS(true)    
    }
  


    async function handleID(id) {
      setID(id); 
      setIsModalOpenVerify(true)    
    }

    async function Identify(AnyQuest) {
      setQ(AnyQuest); 
      setIsModalOpen(true)   
      
    }

    const [Staff, setStaff] = useState([
      {
       
        First_name:"",
        Last_Name:"",
        Email:"",
        Role:"",
        Status:""

      }
    ]);

    async function StaffStatus(ActiveStat){
      console.log("Loading..")
    await supabase.from("Staff-Info").update({
      Status:ActiveStat
    }).eq("id", IDStaff);
    StaffLoadData()
    setIDStaff("")
    setStaffS(false)
    console.log("Edit Success")
    }

    const rows = Staff.map((element) => (
      <Table.Tr >
        <Table.Td>{element.First_Name}</Table.Td>
        <Table.Td>{element.Last_Name}</Table.Td>
        <Table.Td>{element.Email}</Table.Td>
        <Table.Td>{element.Role}</Table.Td>
        <Table.Td>{element.Status == "Active"?(
          <div>
          <Button variant="filled" color="rgb(110, 193, 228)" onClick={() => {StaffAc(element.id) }} >{element.Status}</Button>
          </div>
        ):(
          <div>
          <Button variant="filled" color="rgb(255, 105, 0)" onClick={() => {StaffAc(element.id) }} >{element.Status}</Button> 
          </div>
        )}
      </Table.Td>
        
      </Table.Tr>
    ));

 
    

    const [QuestionQues, setQuestion] = useState([
      {
        Question:"",
      }
    ]);

    const [QuestionB, setQuestionB] = useState([
      {
        Question: "",
       
      }
    ]);
    const [QuestionC, setQuestionC] = useState([
      {
        Question:"",
       
      }
    ]);

    const [QuestionD, setQuestionD] = useState([
      {
        Question:"",
       
      }
    ]);

    async function StaffLoadData() {
      const { error, data } = await supabase.from("Staff-Info").select();
      setStaff(data) 
  
    }

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

    async function submit1() {

      
      const QuestionAdd = document.getElementById("AddQuestion").value
      
  
      if(!QuestionAdd) {
        return alert("All field is required")
      }
  
      const { error } = await supabase.from(anyQuesttrow).insert({
        Question: QuestionAdd,
      })
  
      if(error) {
        console.log(error.message)
      }else{
        document.getElementById("AddQuestion").value = ""
        setQ("")
        
        loadData()
        loadDataB()
        loadDataC()
        loadDataD()
        console.log("Success!")
        setIsModalOpen(false)
      }
     
      
  
    }

    async function deleteQuestion1() {
      
      await supabase.from(anyQuesttrow).delete().eq("id", IDs)
      await loadData()
      await loadDataB()
      await loadDataC()
      await loadDataD()
      setIsModalOpenVerify(false)
      console.log("Delete Success")
      setID("")
      setQ("")
      
    }

  
  

      useEffect(() => {
        loadData()
        loadDataB()
        loadDataC()
        loadDataD()
        StaffLoadData()

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

        const Staffselection = supabase
        .channel("realtime:Staff")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "Staff-Info" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              StaffLoadData((prev) => [
                payload.new,
                ...prev,
              ]);
            } else if (payload.eventType === "UPDATE") {
              StaffLoadData((prev) =>
                prev.map((item) =>
                  item.id === payload.new.id
                    ? (payload.new)
                    : item
                )
              );
            } else if (payload.eventType === "DELETE") {
              StaffLoadData((prev) =>
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
          supabase.removeChannel(Staffselection)
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
      <div className='Response'><Input id='AddQuestion' radius="md" placeholder="Enter Question" /></div> 
      <Button className='Button-done' onClick={submit1}>Add</Button>

        
   
    </Modal>

    <Modal marginTop={20} radius={20} centered='true' opened={isModalOpenVerify} onClose={() => { setIsModalOpenVerify(false)}}>
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
      <div className='Response'></div> 
      <div style={{display:'flex' , justifyContent: 'space-evenly'}}>
      <Button  onClick={() => {setIsModalOpenVerify(false) }} >NO</Button>
      <Button  onClick={deleteQuestion1}>Yes</Button>
      </div>
        
   
    </Modal>

    <Modal marginTop={20} radius={20} centered='true' opened={StaffS} onClose={() => { setStaffS(false)}}>
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
      <div className='Response'></div> 
      <div style={{display:'flex' , justifyContent: 'space-evenly'}}>
      <Button color='rgb(110, 193, 228)'  onClick={() => {StaffStatus("Active") }} >Active</Button>
      <Button color='rgb(255, 105, 0)' onClick={() => {StaffStatus("InActive") }}>InActive</Button>
      </div>
        
   
    </Modal>
     
    
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
    
    <Tabs color='	rgb(241, 101, 41)'  size='xl' variant="pills"  defaultValue="gallery" orientation="vertical" >
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
          <div style={{width: '1295px'}} >
          <div style={{backgroundColor:'	rgb(255, 105, 0)' , border: '5px solid 	rgb(255, 105, 0)' , marginTop:'-3px'}} >
            <h2 style={{marginLeft:'30px' , display:'flex' ,color: 'white' }}>Staff
            <Input style={{display:'flex' , marginLeft: '420px' , justifyContent:'center' }} leftSection={<IconSearch size={16} />} variant="filled" size="md" radius="xl" placeholder="Search" />
            <label style={{marginLeft:'400px' , marginTop:'5px'}}>Leo</label>
            <ThemeIcon  size="xl" color="tranfarent" autoContrast>
            <IconUser size={30} />
            </ThemeIcon>
            
            </h2> 
          </div>

          <div>
          <ScrollArea  h={600} style={{borderTop:'2px solid black', backgroundColor:'	rgb(240, 235, 235)'}}>
          <div style={{backgroundColor:'white', margin:'20px'} }>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>First Name</Table.Th>
                  <Table.Th>Last Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Status</Table.Th>
               </Table.Tr>
              </Table.Thead>
             <Table.Tbody>{rows}</Table.Tbody>
           </Table>
          </div>
          </ScrollArea>
          </div>
          </div>
      </Tabs.Panel>

      <Tabs.Panel  value="Maintenance">
        <div style={{width: '1295px'}} >
          <div style={{backgroundColor:'	rgb(255, 105, 0)' , border: '5px solid 	rgb(255, 105, 0)' , marginTop:'-3px'}} >
            <h2 style={{marginLeft:'30px' , display:'flex' ,color: 'white' }}>Maintenance
            <Input style={{display:'flex' , marginLeft: '290px' , justifyContent:'center' }} leftSection={<IconSearch size={16} />} variant="filled" size="md" radius="xl" placeholder="Search" />
            <label style={{marginLeft:'400px' , marginTop:'5px'}}>Leo</label>
            <ThemeIcon  size="xl" color="tranfarent" autoContrast>
            <IconUser size={30} />
            </ThemeIcon>
            
            </h2> 
          </div>
          <ScrollArea  h={600} style={{borderTop:'2px solid black', backgroundColor:'	rgb(240, 235, 235)'}}>
            {
          <div   style={{ marginRight: '-17px' , height:'600px' }}>
            <div style={{ backgroundColor: 'whitesmoke', border:'2px solid black' , margin:'50px'}}>
              <h2 style={{display:'flex' , justifyContent: 'center'}}>Training Evaluation</h2>
              <div style={{marginLeft:'10px'}}>
              <div style={{display:'flex'}}>
              
                <h3>A.Services</h3><Button style={{display:'flex' , justifyContent: 'center', marginLeft:'950px' , marginTop:'13'}} onClick={() => {Identify('A.Services') }} rightSection={<IconPlus size={14} />}  variant="filled" radius="md">Add</Button>
                </div>
                <div>
                {QuestionQues.map((keys) => {
          return (
            <div className='item'>
              <div>{keys.Question}</div>
              <div>
              <ActionIcon color="red" 
              onClick={() => {handleID(keys.id) , setQ('A.Services')}}     
                   >
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
              <div style={{display:'flex'}}>
                <h3>B.Facilities</h3><Button style={{display:'flex' , justifyContent: 'center', marginLeft:'950px' , marginTop:'13'}} onClick={() => {Identify('B.Facilities') }} rightSection={<IconPlus size={14} />} variant="filled" radius="md">Add</Button>
                </div>
                <div>
                {QuestionB.map((keyb) => {
          return (
            <div className='item'>
              <div>{keyb.Question}</div>
              <div>
              <ActionIcon color="red" 
              onClick={() => {handleID(keyb.id) , setQ('B.Facilities')}}>
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
              <div style={{display:'flex'}}>
                <h3>C.Course</h3><Button style={{display:'flex' , justifyContent: 'center', marginLeft:'950px' , marginTop:'13'}} onClick={() => {Identify('C.Course') }} rightSection={<IconPlus size={14} />} variant="filled" radius="md">Add</Button>
                </div>
                <div>
                {QuestionC.map((keyc) => {
          return (
            <div className='item'>
              <div>{keyc.Question}</div>
              <div>
              <ActionIcon color="red" 
              onClick={() => {handleID(keyc.id) , setQ('C.Course')}}>
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
              <div style={{display:'flex'}}>
                <h3>D.Instructor</h3><Button style={{display:'flex' , justifyContent: 'center', marginLeft:'950px' , marginTop:'13'}} onClick={() => {Identify('D.Instructor') }} rightSection={<IconPlus size={14} />} variant="filled" radius="md">Add</Button>
                </div>
                <div>
                {QuestionD.map((keyD) => {
          return (
            <div className='item'>
              <div>{keyD.Question}</div>
              <div>
              <ActionIcon color="red" 
              onClick={() => {handleID(keyD.id)  , setQ('D.Instructor')}}>
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
  </>
  )
}

export default Admin