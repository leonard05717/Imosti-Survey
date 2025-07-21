import { BarChart, PieChart } from "@mantine/charts";
import { ActionIcon, Menu, Text, ThemeIcon } from "@mantine/core";
import {
  IconChevronDown,
  IconClipboard,
  IconDotsVertical,
  IconFileDescription,
  IconSchool,
  IconUser,
  IconWallpaperOff,
} from "@tabler/icons-react";
import { useState } from "react";
import DashboardItem from "./components/DashboardItem";
import PieCourseItem from "./components/PieCourseItem";

const barChartData = [
  { services: "A. Services", Value: 23 },
  { services: "B. Facilities", Value: 45 },
  { services: "C. Course", Value: 12 },
  { services: "D. Instructor", Value: 34 },
];

const pieData = [
  { name: "Course 1", value: 400, color: "green.6" },
  { name: "Course 2", value: 300, color: "blue.6" },
  { name: "Course 3", value: 300, color: "red.6" },
];

function Analytics({ stafflog, adminData }) {
  const [selectedFilter, setSelectedFilter] = useState("");

  return (
    <div>
      <div
        style={{
          backgroundColor: "	rgb(255, 105, 0)",
          border: "5px solid 	rgb(255, 105, 0)",
          marginTop: "-3px",
        }}
      >
        <h2
          style={{
            marginLeft: "30px",
            display: "flex",
            color: "white",
          }}
        >
          Analytics
          <label style={{ marginLeft: "1020px", marginTop: "5px" }}>
            {stafflog
              .filter((v) => v.Role === adminData.Role && v.id === adminData.id)
              .map((c) => {
                return c.Role;
              })}
          </label>
          <ThemeIcon
            size='xl'
            color='tranfarent'
            autoContrast
          >
            <IconUser size={30} />
          </ThemeIcon>
        </h2>
      </div>

      <div
        style={{
          paddingTop: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            paddingRight: 20,
            position: "relative",
          }}
        >
          <Menu
            arrowSize={15}
            withArrow
            styles={{
              arrow: {
                borderTop: "1px solid #0005",
                borderLeft: "1px solid #0005",
              },
            }}
          >
            <Menu.Target>
              <div
                className='clickable-element'
                style={{
                  position: "absolute",
                  top: 0,
                  left: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                  }}
                >
                  Today
                </span>
                <IconChevronDown size={18} />
              </div>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                border: "1px solid #0005",
                boxShadow: "1px 2px 3px #0005",
              }}
              w={190}
            >
              <Menu.Label>Filter</Menu.Label>
              <Menu.Item>Today</Menu.Item>
              <Menu.Item>Last Week</Menu.Item>
              <Menu.Item>Last Month</Menu.Item>
              <Menu.Item>Last Year</Menu.Item>
              <Menu.Item>By Specific Month</Menu.Item>
              <Menu.Sub>
                <Menu.Sub.Target>
                  <Menu.Sub.Item>By Specific Year</Menu.Sub.Item>
                </Menu.Sub.Target>
                <Menu.Sub.Dropdown w={100}>
                  <Menu.Item>2021</Menu.Item>
                  <Menu.Item>2022</Menu.Item>
                  <Menu.Item>2023</Menu.Item>
                  <Menu.Item>2024</Menu.Item>
                  <Menu.Item>2025</Menu.Item>
                </Menu.Sub.Dropdown>
              </Menu.Sub>
            </Menu.Dropdown>
          </Menu>

          <BarChart
            h={500}
            w='calc(100% - 30rem)'
            data={barChartData}
            dataKey='services'
            series={[{ name: "Value", color: "blue.6" }]}
            tickLine='y'
            withLegend
          />
          <div>
            <div
              style={{
                width: "30rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <DashboardItem
                Icon={IconFileDescription}
                label='Total Survey'
                value={10}
              />
              <DashboardItem
                Icon={IconSchool}
                label='Total Courses'
                value={10}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  paddingBottom: 10,
                  height: 250,
                }}
              >
                <div
                  style={{
                    textWrap: "nowrap",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Training per Course
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
                  <PieCourseItem
                    color='#00ff00'
                    label='Course 1'
                  />
                  <PieCourseItem
                    color='#0000ff'
                    label='Course 2'
                  />
                  <PieCourseItem
                    color='#ff0000'
                    label='Course 3'
                  />
                </div>
              </div>
              <PieChart
                withTooltip
                tooltipDataSource='segment'
                data={pieData}
                size={250}
                withLabelsLine
                withLabels
                labelsPosition='outside'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
