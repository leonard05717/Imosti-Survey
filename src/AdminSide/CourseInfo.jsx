import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import {
  ActionIcon,
  Button,
  LoadingOverlay,
  Modal,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import supabase from "../supabase";
import {
  IconArrowLeft,
  IconDotsVertical,
  IconSearch,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { staticData } from "./data";

function convertDateRangeToString(dateRange) {
  const [f, s] = dateRange.substring(2, dateRange.length - 2).split('","');
  return `${new Date(f).toDateString()} to ${new Date(s).toDateString()}`;
}

function CourseInfo() {
  const { id: course_id } = useParams();
  const [loadingPage, setLoadingPage] = useState(true);
  const [students, setStudents] = useState([]);
  const [modalState, { open: openModalState, close: closeModalState }] =
    useDisclosure(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  async function fetchData() {
    setLoadingPage(true);
    const studentData = (
      await supabase.from("Info-Training").select("*, course:course_id(*)")
    ).data;
    const scoreData = (
      await supabase
        .from("scores")
        .select("*, question:Questioner(*), traning:Info-Training(*)")
    ).data;
    setScores(scoreData);
    setStudents(studentData);
    setLoadingPage(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStudents = students
    .filter((v) => v.course_id.toString() === course_id)
    .filter((v) => {
      if (!search) return true;
      const s = search.toLowerCase().trim();
      return (
        v.Name.toLowerCase().includes(s) ||
        convertDateRangeToString(v.TrainingD).includes(s) ||
        v.Reg.toLowerCase().includes(s) ||
        v.Instructor.toLowerCase().includes(s) ||
        new Date(v.DateN).toDateString().includes(s)
      );
    });

  return (
    <PageContainer
      outsideChildren={
        <LoadingOverlay
          loaderProps={{ type: "dots" }}
          visible={loadingPage}
        />
      }
      title='Course Info'
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
        title={selectedStudent?.Name}
        opened={modalState}
        onClose={closeModalState}
      >
        {selectedStudent && (
          <div>
            <div className='pt-5'>
              <p className='text-xl font-black mb-2'>Survey Details</p>
              <p>
                <strong>Course -</strong> {selectedStudent.course.Course}
              </p>
            </div>
            <div className='pt-3'>
              {staticData.map((v) => {
                const filteredData = scores
                  .filter(
                    (v) =>
                      v.training_id.toString() ===
                      selectedStudent.id.toString(),
                  )
                  .filter((c) => c.question.Criteria === v.key);

                return (
                  <div className='mb-5'>
                    <h3 className='font-semibold text-gray-800 mb-2'>
                      {v.key}. {v.description}{" "}
                      {filteredData.length === 0 && (
                        <Text size='sm'>- No Data Found</Text>
                      )}
                    </h3>

                    {filteredData.map((sc, i) => {
                      return (
                        <div>
                          <div className='mb-2'>
                            <ul className='space-y-1 pl-4'>
                              <li className='Questiong-answer'>
                                <span>
                                  {i + 1}. {sc.question.Question}
                                </span>
                                <span>{sc.score}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>

      <Button
        onClick={() => {
          navigate("/admin2/courses");
        }}
        size='xs'
        leftSection={<IconArrowLeft size={19} />}
        mb={10}
      >
        Back
      </Button>

      <Table
        style={{
          alignStart: "top",
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Training Date</Table.Th>
            <Table.Th>Company</Table.Th>
            <Table.Th>Instructor</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>View</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredStudents.map((stud, i) => {
            return (
              <Table.Tr>
                <Table.Td>{i + 1}</Table.Td>
                <Table.Td style={{ minWidth: 150 }}>{stud.Name}</Table.Td>
                <Table.Td style={{ minWidth: 150 }}>
                  {convertDateRangeToString(stud.TrainingD)}
                </Table.Td>
                <Table.Td>{stud.Reg}</Table.Td>
                <Table.Td style={{ minWidth: 120 }}>{stud.Instructor}</Table.Td>
                <Table.Td style={{ minWidth: 150 }}>
                  {new Date(stud.DateN).toDateString()}
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    onClick={() => {
                      setSelectedStudent(stud);
                      openModalState();
                    }}
                    variant='subtle'
                    color='dark'
                  >
                    <IconDotsVertical size={20} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      {filteredStudents.length === 0 && (
        <Text
          ff='cursive'
          ta='center'
          mt={100}
        >
          {loadingPage ? "Loading..." : "No Data Found"}
        </Text>
      )}
    </PageContainer>
  );
}

export default CourseInfo;
