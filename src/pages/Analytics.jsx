import { BarChart, PieChart } from "@mantine/charts";
import {
  ActionIcon,
  ActionIconGroupSection,
  Button,
  Checkbox,
  CloseButton,
  Divider,
  LoadingOverlay,
  Menu,
  Modal,
  Popover,
  Portal,
  ScrollAreaAutosize,
  Select,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconChevronDown,
  IconClipboard,
  IconDotsVertical,
  IconFileDescription,
  IconMoodSad,
  IconPrinter,
  IconSchool,
  IconUser,
  IconWallpaperOff,
} from "@tabler/icons-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import DashboardItem from "./components/DashboardItem";
import PieCourseItem from "./components/PieCourseItem";
import supabase from "../supabase";
import { useDidUpdate, useDisclosure } from "@mantine/hooks";
import {
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  constructFrom,
} from "date-fns";
import {
  MonthPicker,
  YearPicker,
  DatePicker,
  DatePickerInput,
} from "@mantine/dates";
import { modals } from "@mantine/modals";
import ReactToPrint from "react-to-print";
import PrintableSurvey from "./components/PrintableSurvey";
import PageContainer from "../components/PageContainer";
import { staticData } from "../data";
import { sample } from "lodash";

const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

function calculateAverageScore(questionId, scores) {
  const questionScores = scores.filter((s) => s.question_id === questionId);
  if (questionScores.length === 0) return 0;
  const sum = questionScores.reduce((acc, cur) => acc + cur.score, 0);
  return parseFloat((sum / questionScores.length).toFixed(2));
}

function Analytics() {
  const [mainData, setMainData] = useState({
    scores: [],
    courses: [],
    students: [],
  });
  const [loadingPage, setLoadingPage] = useState(true);
  const [printState, { close: closePrintState, open: openPrintState }] =
    useDisclosure(false);
  const [filterState, { open: openFilterState, close: closeFilterState }] =
    useDisclosure(false);
  const [dashboardData, setDashboardData] = useState({
    totalSurvey: 0,
    totalCourse: 0,
  });

  const [filterBarchart, setFilterBarchart] = useState([
    new Date(),
    new Date(),
  ]);
  const [selectedMonthYear, setSelectedMonthYear] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [Criterias, setCriterias] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [surveyData, setSurveyData] = useState({
    title: "",
    description: "",
    totalAverage: 0,
    list: [],
    date: "",
    student: "",
  });

  async function printEventHandler() {
    try {
      setLoadingPrint(true);

      const questions = (await supabase.from("Questioner").select()).data;

      let start;
      let end;
      let date = "";
      const now = new Date();

      switch (selectedFilter) {
        case "Today":
          start = new Date(now);
          start.setHours(0, 0, 0, 0);

          end = new Date(now);
          end.setHours(23, 59, 59, 999);

          date = now.toDateString();
          break;

        case "By Specific Day":
          if (!selectedDay) return;

          start = startOfDay(new Date(selectedDay));
          end = endOfDay(new Date(selectedDay));

          date = new Date(selectedDay).toDateString();
          break;

        case "By Date Range":
          if (
            !selectedDateRange ||
            !selectedDateRange[0] ||
            !selectedDateRange[1]
          ) {
            window.alert("No Selected Specific Date");
            return;
          }

          start = startOfDay(new Date(selectedDateRange[0]));
          end = endOfDay(new Date(selectedDateRange[1]));

          date = `${new Date(selectedDateRange[0]).toDateString()} to ${new Date(selectedDateRange[1]).toDateString()}`;
          break;

        case "By Specific Month":
          if (!selectedMonthYear) return;

          const my1 = new Date(selectedMonthYear);

          start = new Date(my1.getFullYear(), my1.getMonth(), 1);
          end = new Date(
            my1.getFullYear(),
            my1.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          );

          date = my1.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          break;

        case "By Specific Year":
          if (!selectedMonthYear) return;

          const my2 = new Date(selectedMonthYear);

          start = new Date(my2.getFullYear(), 0, 1);
          end = new Date(my2.getFullYear(), 11, 31, 23, 59, 59, 999);

          date = my2.getFullYear().toString();
          break;

        default:
          return;
      }

      let filteredScores = mainData.scores;
      let selectedCourse = null;
      let filteredStudents = mainData.students;
      

      if (selectedCourseCode) {
        selectedCourse = mainData.courses.find(
          (c) => c.Course === selectedCourseCode,
        );

        console.log(selectedCourseCode);

        if (selectedCourse) {
          filteredScores = mainData.scores.filter(
            (s) => s.traning.course_id === selectedCourse.id,
          );
        }
        if(selectedCourse){
          filteredStudents = mainData.students.filter(
            (f) => f.course_id === selectedCourse.id

          )
        }
      }

      const studentCount = filteredStudents.length;

      filteredScores = filteredScores.filter((s) => {
        const created = new Date(s.traning.DateN);
        return created >= start && created <= end;
      });

      const crs = Criterias.reduce((acc, item) => {
        acc[item.label] = {
          sum: 0,
          len: 0,
          average: 0,
          questions: [],
          name: `${item.label}. ${item.CQuestion}`,
        };
        return acc;
      }, {});

      filteredScores.forEach((score) => {
        if (crs[score.question.Criteria]) {
          crs[score.question.Criteria].len += 1;
          crs[score.question.Criteria].sum += score.score;
        }
      });

      Criterias.forEach((key) => {
        if (crs[key.label]) {
          crs[key.label].average = crs[key.label].sum / crs[key.label].len || 0;
        }
      });

      questions.forEach((q) => {
        if (crs[q.Criteria]) {
          crs[q.Criteria].questions.push(q);
        }
      });

      const list = Object.entries(crs).map(([key, value]) => ({
        name: crs[key].name,
        average: parseFloat(value.average.toFixed(2)),
        subItems: value.questions.map((q) => ({
          name: q.Question,
          average: calculateAverageScore(q.id, filteredScores),
        })),
      }));

      const totalAverage =
        list.reduce((sum, item) => sum + item.average, 0) / list.length;

      const newSurveyData = {
        title: selectedCourse?.Course || "All Courses",
        description: selectedCourse?.Course || "Report",
        totalAverage: totalAverage,
        list: list,
        date: date,
        barChartData: barChartData, // Include current bar chart data
        listcriteria: selectedCriteria,
        student: studentCount,
      };

      setSurveyData(newSurveyData);

      await new Promise((res, rej) => {
        window.setTimeout(() => {
          window.print();
          res(true);
        }, 1000);
      });
    } catch (error) {
      console.log("Something Error");
    } finally {
      setLoadingPrint(false);
    }
  }

  async function fetchAllData() {
    try {
      setLoadingPage(true);
      const scoreData = (
        await supabase
          .from("scores")
          .select("*, question:Questioner(*), traning:Info-Training(*)")
      ).data;

      const studentData = (await supabase.from("Info-Training").select()).data;
      const courseData = (await supabase.from("Course").select()).data;
      const CriteriaData = (await supabase.from("Criteria-Questioner").select())
        .data;

      const courseCount =
        (await supabase.from("Course").select("*")).data.length || 0;
      const surveyCount =
        (await supabase.from("Info-Training").select("*")).data.length || 0;

      setCriterias(CriteriaData);

      setMainData({
        scores: scoreData,
        courses: courseData,
        students: studentData,
      });

      setDashboardData({
        totalCourse: courseCount,
        totalSurvey: surveyCount,
      });
    } catch (error) {
      window.alert(error.toString());
    } finally {
      setLoadingPage(false);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!mainData.scores.length) return;

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

      case "By Specific Day":
        if (!selectedDay) return;

        start = new Date(selectedDay);
        start.setHours(0, 0, 0, 0);

        end = new Date(selectedDay);
        end.setHours(23, 59, 59, 999);
        break;

      case "By Date Range":
        if (!selectedDateRange[0] || !selectedDateRange[1]) return;

        start = new Date(selectedDateRange[0]);
        start.setHours(0, 0, 0, 0);

        end = new Date(selectedDateRange[1]);
        end.setHours(23, 59, 59, 999);
        break;

      case "By Specific Month":
        if (!selectedMonthYear) return;

        const my1 = new Date(selectedMonthYear);

        start = new Date(my1.getFullYear(), my1.getMonth(), 1);
        end = new Date(
          my1.getFullYear(),
          my1.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        break;

      case "By Specific Year":
        if (!selectedMonthYear) return;

        const my2 = new Date(selectedMonthYear);

        start = new Date(my2.getFullYear(), 0, 1);
        end = new Date(my2.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;

      default:
        return;
    }

    setFilterBarchart([start, end]);

    const filtered = mainData.scores.filter((item) => {
      const dateN = item.traning?.DateN;
      if (!dateN) return false;
      const trainingDate = new Date(dateN);
      const crs = mainData.courses.find(
        (cr) => cr.Course === selectedCourseCode,
      );

      if (!crs) return trainingDate >= start && trainingDate <= end;

      return (
        crs.id === item.traning?.course_id &&
        trainingDate >= start &&
        trainingDate <= end
      );
    });

    const grouped = Criterias.reduce((acc, item) => {
      acc[item.label] = 0;
      return acc;
    }, {});

    const count = Criterias.reduce((acc, item) => {
      acc[item.label] = 0;
      return acc;
    }, {});

    filtered.forEach((item) => {
      const criteria = item.question?.Criteria;
      if (grouped[criteria] !== undefined) {
        grouped[criteria] += item.score;
        count[criteria] += 1;
      }
    });

    const average = Criterias.reduce((acc, item) => {
      acc[item.label] = count[item.label]
        ? grouped[item.label] / count[item.label]
        : 0;
      return acc;
    }, {});

    const barChartData = Criterias.sort((a, b) =>
      a.label.localeCompare(b.label),
    ).map((item) => {
      return {
        name: `${item.label}`,
        Average: average[item.label],
      };
    });

    const listCriterias = Criterias.sort((a, b) =>
      a.label.localeCompare(b.label),
    ).map((item) => {
      return {
        name: `${item.label}. ${item.CQuestion}`,
      };
    });

    setSelectedCriteria(listCriterias);
    setBarChartData(barChartData);
  }, [
    selectedFilter,
    selectedMonthYear,
    selectedDay,
    selectedDateRange,
    mainData,
    selectedCourseCode,
  ]);

  const pieChartData = useMemo(() => {
    return mainData.courses.map((course, index) => {
      const count = mainData.students.filter(
        (student) => student.course_id === course.id,
      ).length;

      return {
        name: course.Course,
        value: count,
        color: colors[index % colors.length],
      };
    });
  }, [mainData.courses, mainData.students]);

  return (
    <PageContainer
      title='Analytics'
      outsideChildren={
        <LoadingOverlay
          loaderProps={{ type: "dots" }}
          visible={loadingPage}
        />
      }
    >
      <Portal>
        <div id='print-area'>
          <PrintableSurvey
            courseTitle={surveyData.title}
            description={surveyData.description}
            criteria={surveyData.list}
            totalAverage={surveyData.totalAverage}
            date={surveyData.date}
            barChartData={surveyData.barChartData}
            listcriteria={surveyData.listcriteria}
            student={surveyData.student}
          />
        </div>
      </Portal>

      {/* Filter Modal */}
      <Modal
        opened={filterState}
        onClose={closeFilterState}
        title={selectedFilter || "Date Picker"}
        // size='md'
        size='sm'
      >
        <div className='flex items-center justify-center py-5'>
          {selectedFilter === "By Specific Month" && (
            <MonthPicker
              value={selectedMonthYear}
              onChange={setSelectedMonthYear}
              label='Select Month and Year'
              maxDate={new Date()}
            />
          )}

          {selectedFilter === "By Specific Year" && (
            <YearPicker
              value={selectedMonthYear}
              onChange={setSelectedMonthYear}
              label='Select Year'
              maxDate={new Date()}
            />
          )}

          {selectedFilter === "By Specific Day" && (
            <DatePicker
              value={selectedDay}
              onChange={setSelectedDay}
              label='Select Specific Day'
              maxDate={new Date()}
            />
          )}

          {selectedFilter === "By Date Range" && (
            <div>
              <DatePicker
                type='range'
                label='Select Date Range'
                placeholder='Pick dates range'
                value={selectedDateRange}
                maxDate={new Date()}
                onChange={setSelectedDateRange}
              />
            </div>
          )}
        </div>
      </Modal>

      <div
        style={{
          padding: 20,
          height: "100%",
        }}
        className='analytic-page'
      >
        <div className='grid md:grid-cols-2 grid-cols-1 relative h-full gap-10'>
          {/* left */}
          <div className='md:h-full h-[calc(100vh-20rem)]'>
            <div className='flex items-center justify-between h-[50px] md:pl-[15px] pl-0'>
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
                    <span style={{ fontSize: 15 }}>
                      {selectedFilter === "By Specific Month" &&
                      selectedMonthYear
                        ? `By Specific Month (${new Date(selectedMonthYear).getFullYear()}, ${new Date(
                            selectedMonthYear,
                          ).toLocaleString("default", {
                            month: "long",
                          })})`
                        : selectedFilter === "By Specific Year" &&
                            selectedMonthYear
                          ? `By Specific Year (${new Date(selectedMonthYear).getFullYear()})`
                          : selectedFilter === "By Specific Day" && selectedDay
                            ? `By Specific Day (${new Date(selectedDay).toLocaleDateString()})`
                            : selectedFilter === "By Date Range" &&
                                selectedDateRange[0] &&
                                selectedDateRange[1]
                              ? `By Date Range (${new Date(selectedDateRange[0]).toLocaleDateString()} - ${new Date(selectedDateRange[1]).toLocaleDateString()})`
                              : selectedFilter}
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
                  <Menu.Item
                    onClick={() => {
                      setSelectedFilter("By Specific Day");
                      setSelectedDay(new Date());
                      openFilterState();
                    }}
                  >
                    By Specific Day
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setSelectedFilter("By Date Range");
                      setSelectedDateRange([null, null]);
                      openFilterState();
                    }}
                  >
                    By Date Range
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setSelectedFilter("By Specific Month");
                      setSelectedMonthYear(new Date());
                      openFilterState();
                    }}
                  >
                    By Specific Month
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setSelectedMonthYear(new Date());
                      setSelectedFilter("By Specific Year");
                      openFilterState();
                    }}
                  >
                    By Specific Year
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Popover
                opened={printState}
                onClose={closePrintState}
                withArrow
                arrowSize={15}
                styles={{
                  dropdown: {
                    border: "1px solid #0005",
                    boxShadow: "1px 2px 3px #0005",
                  },
                  arrow: {
                    borderTop: "1px solid #0005",
                    borderLeft: "1px solid #0005",
                  },
                }}
              >
                <Popover.Target>
                  <ActionIcon
                    onClick={openPrintState}
                    variant='subtle'
                    color='dark'
                  >
                    <IconDotsVertical size={20} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown miw={300}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        size='sm'
                        fw='bold'
                      >
                        Print Options:
                      </Text>
                      <CloseButton onClick={closePrintState} />
                    </div>
                    <Divider my={10} />
                    <Select
                      checkIconPosition='right'
                      label='Filter By Course'
                      placeholder='Select Course'
                      searchable
                      value={selectedCourseCode}
                      clearable
                      onChange={setSelectedCourseCode}
                      data={[
                        ...new Map(
                          mainData.courses.map((c) => [
                            c.Course,
                            {
                              label: c.Course,
                              value: c.Course,
                            },
                          ]),
                        ).values(),
                      ]}
                    />
                    {selectedCourseCode ? (
                      <Button
                        mt={10}
                        variant='outline'
                        leftSection={<IconPrinter size={16} />}
                        onClick={printEventHandler}
                        loading={loadingPrint}
                      >
                        PRINT ({selectedCourseCode})
                      </Button>
                    ) : (
                      <Button
                        onClick={printEventHandler}
                        loading={loadingPrint}
                        mt={10}
                        variant='outline'
                        leftSection={<IconPrinter size={16} />}
                      >
                        Print Overall Record
                      </Button>
                    )}
                  </div>
                </Popover.Dropdown>
              </Popover>
            </div>

            <div
              style={{
                height: "calc(100% - 50px)",
                width: "100%",
              }}
            >
              {barChartData.every((v) => v.Value === 0) ? (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <IconMoodSad
                      size={100}
                      style={{
                        maxHeight: 100,
                        maxWidth: 100,
                      }}
                    />
                    <Text
                      fw='bold'
                      size='xl'
                      ff='poppins,cursive'
                    >
                      No Data Found ({selectedFilter})
                    </Text>
                  </div>
                </div>
              ) : (
                <BarChart
                  withTooltip
                  withBarValueLabel
                  h='100%'
                  w='100%'
                  valueFormatter={(v) => v.toFixed(2)}
                  data={barChartData}
                  dataKey='name'
                  yAxisProps={{
                    tickCount: 4,
                  }}
                  series={[{ name: "Average", color: "blue.6" }]}
                />
              )}
            </div>
          </div>

          {/* right */}
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                height: 200,
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
            <div className='flex items-center md:flex-row flex-col-reverse overflow-hidden h-[calc(100%-200px)]'>
              <div className='flex flex-col justify-between pb-[10px] h-full md:pt-[20px] pt-0'>
                <div
                  style={{
                    textWrap: "nowrap",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  Training per Course
                </div>
                <div className='md:w-[220px] w-full h-[200px]'>
                  <ScrollAreaAutosize
                    mah={200}
                    // w={220}
                  >
                    {mainData.courses.map((course, index) => {
                      const color = colors[index % colors.length];

                      return (
                        <PieCourseItem
                          key={course.id}
                          color={color}
                          label={course.Course}
                        />
                      );
                    })}
                  </ScrollAreaAutosize>
                </div>
              </div>
              <div className='w-[283px] h-[283px]'>
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
    </PageContainer>
  );
}

export default Analytics;
