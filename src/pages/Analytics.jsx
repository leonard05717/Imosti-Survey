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
import { useEffect, useLayoutEffect, useState } from "react";
import DashboardItem from "./components/DashboardItem";
import PieCourseItem from "./components/PieCourseItem";
import supabase from "../supabase";

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
  const [dashboardData, setDashboardData] = useState({
    totalSurvey: 0,
    totalCourse: 0,
  });
  const [selectedFilter, setSelectedFilter] = useState("Last Week");

  async function fetchDashboardData() {
    try {
      const courseCount =
        (await supabase.from("Course").select("*")).data.length || 0;
      const surveyCount =
        (await supabase.from("Info-Training").select("*")).data.length || 0;

      console.log("run");
      setDashboardData((curr) => ({
        totalCourse: courseCount,
        totalSurvey: surveyCount,
      }));
    } catch (error) {
      console.error("Error", error);
    }
  }

  useLayoutEffect(() => {
    fetchDashboardData();
  }, []);

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
      <button onClick={fetchDashboardData}>hello</button>

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
                  {selectedFilter}
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
              <Menu.Item onClick={(e) => setSelectedFilter("Last Week")}>
                Last Week
              </Menu.Item>
              <Menu.Item onClick={(e) => setSelectedFilter("Last Month")}>
                Last Month
              </Menu.Item>
              <Menu.Item onClick={(e) => setSelectedFilter("Last Year")}>
                Last Year
              </Menu.Item>
              <Menu.Item
                onClick={(e) => setSelectedFilter("By Specific Month")}
              >
                By Specific Month
              </Menu.Item>
              <Menu.Item onClick={(e) => setSelectedFilter("By Specific Year")}>
                By Specific Year
              </Menu.Item>
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
                value={dashboardData.totalSurvey}
              />
              <DashboardItem
                Icon={IconSchool}
                label='Total Courses'
                value={dashboardData.totalCourse}
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
