import { BarChart, PieChart } from "@mantine/charts";
import {
  ActionIcon,
  Button,
  Menu,
  ScrollAreaAutosize,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconChevronDown,
  IconClipboard,
  IconDotsVertical,
  IconFileDescription,
  IconPrinter,
  IconSchool,
  IconUser,
  IconWallpaperOff,
} from "@tabler/icons-react";
import { useEffect, useLayoutEffect, useState } from "react";
import DashboardItem from "./components/DashboardItem";
import PieCourseItem from "./components/PieCourseItem";
import supabase from "../supabase";
import { useDidUpdate } from "@mantine/hooks";
import { subWeeks, subMonths, subYears, isAfter, isBefore } from "date-fns";

const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

function Analytics({ stafflog, adminData, scores, courses, students }) {
  const [dashboardData, setDashboardData] = useState({
    totalSurvey: 0,
    totalCourse: 0,
  });

  const [filterBarchart, setFilterBarchart] = useState([
    new Date(),
    new Date(),
  ]);

  const [selectedFilter, setSelectedFilter] = useState("Last Week");

  const [barChartData, setBarChartData] = useState([
    { services: "A. Services", Value: 0 },
    { services: "B. Facilities", Value: 0 },
    { services: "C. Course", Value: 0 },
    { services: "D. Instructor", Value: 0 },
  ]);

  async function fetchDashboardData() {
    try {
      const courseCount =
        (await supabase.from("Course").select("*")).data.length || 0;
      const surveyCount =
        (await supabase.from("Info-Training").select("*")).data.length || 0;
      setDashboardData((curr) => ({
        totalCourse: courseCount,
        totalSurvey: surveyCount,
      }));
    } catch (error) {
      console.error("Error", error);
    }
  }

  useLayoutEffect(() => {
    console.log(courses);
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const now = new Date();
    let start;
    let end;

    switch (selectedFilter) {
      case "Today":
        start = new Date(now);
        start.setHours(0, 0, 0, 0);

        end = new Date(now);
        end.setHours(23, 59, 59, 999);
        break;

      case "Last Week":
        start = subWeeks(now, 1);
        end = now;
        break;

      case "Last Month":
        start = subMonths(now, 1);
        end = now;
        break;

      case "Last Year":
        start = subYears(now, 1);
        end = now;
        break;

      default:
        return; // for modals (specific month/year)
    }

    setFilterBarchart([start, end]);

    const filtered = scores.filter((item) => {
      const dateN = item.traning?.DateN;
      if (!dateN) return false;

      const trainingDate = new Date(dateN);
      return trainingDate >= start && trainingDate <= end;
    });

    const grouped = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    filtered.forEach((item) => {
      const criteria = item.question?.Criteria;
      if (grouped[criteria] !== undefined) {
        grouped[criteria] += item.score;
      }
    });

    setBarChartData([
      { services: "A. Services", Value: grouped.A },
      { services: "B. Facilities", Value: grouped.B },
      { services: "C. Course", Value: grouped.C },
      { services: "D. Instructor", Value: grouped.D },
    ]);
  }, [selectedFilter]);

  const pieChartData = courses.map((course, index) => {
    const count = students.filter(
      (student) => student.course_id === course.id,
    ).length;

    return {
      name: course.Code,
      value: count,
      color: colors[index % colors.length],
    };
  });

  console.log(pieChartData);

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
          <div
            style={{
              height: 500,
              width: "calc(100% - 30rem)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 50,
                paddingLeft: 30,
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
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
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
                  <Menu.Item onClick={() => setSelectedFilter("Today")}>
                    Today
                  </Menu.Item>
                  <Menu.Item onClick={() => setSelectedFilter("Last Week")}>
                    Last Week
                  </Menu.Item>
                  <Menu.Item onClick={() => setSelectedFilter("Last Month")}>
                    Last Month
                  </Menu.Item>
                  <Menu.Item onClick={() => setSelectedFilter("Last Year")}>
                    Last Year
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => setSelectedFilter("By Specific Month")}
                  >
                    By Specific Month
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => setSelectedFilter("By Specific Year")}
                  >
                    By Specific Year
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Button
                size='xs'
                leftSection={<IconPrinter size={17} />}
                variant='outline'
                color='dark'
              >
                Print
              </Button>
            </div>

            <BarChart
              h={450}
              w='100%'
              data={barChartData}
              dataKey='services'
              series={[{ name: "Value", color: "blue.6" }]}
              tickLine='y'
            />
          </div>
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
                <ScrollAreaAutosize
                  mah={150}
                  w={220}
                >
                  {courses.map((course, index) => {
                    const color = colors[index % colors.length];

                    return (
                      <PieCourseItem
                        key={course.id}
                        color={color}
                        label={course.Code}
                      />
                    );
                  })}
                </ScrollAreaAutosize>
              </div>
              <PieChart
                withTooltip
                tooltipDataSource='segment'
                data={pieChartData}
                size={200}
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
