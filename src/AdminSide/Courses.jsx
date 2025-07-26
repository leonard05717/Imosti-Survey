import {
  ActionIcon,
  LoadingOverlay,
  Modal,
  ScrollAreaAutosize,
  Table,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import { IconDotsVertical, IconSearch } from "@tabler/icons-react";
import supabase from "../supabase";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { staticData } from "./data";

function Courses() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [scores, setScores] = useState();
  const [questions, setQuestions] = useState([]);
  const [modalState, { open: openModalState, close: closeModalState }] =
    useDisclosure(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);

  async function fetchData() {
    setLoadingPage(true);
    const courseData = (await supabase.from("Course").select()).data;
    const scoreData = (
      await supabase
        .from("scores")
        .select("*, question:Questioner(*), traning:Info-Training(*)")
    ).data;
    const questionData = (await supabase.from("Questioner").select()).data;
    console.log(scoreData[0]);
    setScores(scoreData);
    setQuestions(questionData);
    setCourses(courseData);
    setLoadingPage(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      outsideChildren={
        <LoadingOverlay
          loaderProps={{ type: "dots" }}
          visible={loadingPage}
        />
      }
      title='Courses'
      rightSection={
        <div>
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftSection={<IconSearch size={18} />}
            placeholder='Search'
          />
        </div>
      }
    >
      <Modal
        title='Data'
        opened={modalState}
        onClose={closeModalState}
      >
        {selectedCourse && (
          <div>
            <p className='text-xl font-black mt-4 mb-2'>Survey Details</p>
            <div>
              <strong>Course -</strong> {selectedCourse.Course}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px 0",
              }}
            >
              <Table
                w={200}
                withRowBorders={false}
              >
                <Table.Thead>
                  <Table.Th>Criteria</Table.Th>
                  <Table.Th ta='center'>Average</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {staticData.map((data, i) => {
                    const filteredScores = scores.filter(
                      (s) =>
                        s.traning.course_id === selectedCourse.id &&
                        data.key === s.question.Criteria,
                    );

                    const sum = filteredScores.reduce((t, c) => {
                      return t + c.score;
                    }, 0);

                    const ave = sum / filteredScores.length;

                    return (
                      <Table.Tr key={i}>
                        <Table.Th>
                          {data.key}. {data.description}
                        </Table.Th>
                        <Table.Td ta='center'>
                          {ave ? ave.toFixed(2) : 0}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </div>

            {staticData.map((data, i) => {
              return (
                <div
                  key={i}
                  className='mb-4'
                >
                  <p className='font-bold text-lg mb-1'>
                    {data.key}. {data.description}
                  </p>
                  {questions
                    .filter((q) => q.Criteria === data.key)
                    .map((question, i) => {
                      // filtered
                      const filteredScores = scores.filter(
                        (s) =>
                          s.traning.course_id === selectedCourse.id &&
                          question.id === s.question.id,
                      );

                      const sum = filteredScores.reduce((t, c) => {
                        return t + c.score;
                      }, 0);

                      const av = sum / filteredScores.length;

                      return (
                        <div
                          className='mb-1 pl-3'
                          key={question.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            {i + 1}. {question.Question}
                          </div>
                          <div>{av ? av.toFixed(2) : 0}</div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      <div
        style={{
          backgroundColor: "white",
        }}
      >
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Code</Table.Th>
              <Table.Th>Course</Table.Th>
              <Table.Th>View</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {courses
              .filter((c) => {
                if (!search) return true;
                const text = search.toLowerCase().trim();
                const len = text.length;
                return (
                  c.Code.toLowerCase().substring(0, len) === text ||
                  c.Course.toLowerCase().includes(text)
                );
              })
              .map((course, i) => {
                return (
                  <Table.Tr key={course.id}>
                    <Table.Td>{i + 1}</Table.Td>
                    <Table.Td style={{ minWidth: 200 }}>{course.Code}</Table.Td>
                    <Table.Td style={{ minWidth: 350 }}>
                      <Link
                        style={{ color: "black", textDecoration: "none" }}
                        to={course.id.toString()}
                      >
                        <span className='hover:underline'>{course.Course}</span>
                      </Link>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        variant='subtle'
                        color='dark'
                        onClick={() => {
                          setSelectedCourse(course);
                          openModalState();
                        }}
                      >
                        <IconDotsVertical size={20} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>
      </div>
    </PageContainer>
  );
}

export default Courses;
