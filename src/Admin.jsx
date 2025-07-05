import {useEffect, useState } from 'react'
import './Admin.css';
import { createClient } from '@supabase/supabase-js'
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
  

  } from '@mantine/core';
import { IconBrandBlackberry, IconCalendar , IconCertificate, IconChartHistogram, IconExposureMinus1, IconMassage, IconMessage2Cog, IconSettings, IconUserMinus, IconUserShare,} from '@tabler/icons-react';

import { DatePicker ,  DatePickerInput } from '@mantine/dates';
import { Label, PieChart } from 'recharts';
import { data, useNavigate } from 'react-router-dom';
import { size } from 'lodash';
import { AreaChart } from '@mantine/charts';
import '@mantine/core/styles.css';


const elements = [
    { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  ];

function Admin() {

    const navigate = useNavigate()
    const rows = elements.map((element) => (
        <Table.Tr key={element.name}>
          <Table.Td>{element.position}</Table.Td>
          <Table.Td>{element.name}</Table.Td>
          <Table.Td>{element.symbol}</Table.Td>
          <Table.Td>{element.mass}</Table.Td>
        </Table.Tr>
      ));

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
    
    <Tabs size='xl' variant="pills"  defaultValue="gallery" orientation="vertical">
    <Tabs.List >
      <div style={{paddingRight:'55px', paddingLeft:'50px' , borderBottom:'2px solid black'}}><Tabs.Tab className='tab-list' leftSection={<IconChartHistogram  size={20}/>} value="Analytics">Analytics</Tabs.Tab></div>
      <div style={{paddingRight:'63px', paddingLeft:'50px' , borderBottom:'2px solid black'}} className='Line-tab'><Tabs.Tab className='tab-list' leftSection={<IconCertificate  size={20}/>} value="Course">Courses</Tabs.Tab></div>
      <div style={{paddingRight:'90px', paddingLeft:'50px' , borderBottom:'2px solid black'}} className='Line-tab'><Tabs.Tab className='tab-list' leftSection={<IconUserShare   size={20}/>} value="Staff">Staff</Tabs.Tab></div>
      <div style={{paddingRight:'23px', paddingLeft:'50px' , borderBottom:'2px solid black'}} className='Line-tab'><Tabs.Tab className='tab-list' leftSection={<IconMessage2Cog  size={20}/>} value="Maintenance">Maintenance</Tabs.Tab></div>
      <div style={{paddingRight:'61.5px', paddingLeft:'50px' , borderBottom:'2px solid black'}} className='Line-tab'><Tabs.Tab className='tab-list' leftSection={<IconSettings  size={20}/>} value="Settings">Settings</Tabs.Tab></div>
    </Tabs.List>
            
       
  </Tabs>
  
  </div>
  
  <div >

        <div style={{}} >

        </div>
    

  </div>
        
  
  </div>
  )
}

export default Admin