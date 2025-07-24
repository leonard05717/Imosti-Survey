import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import { ActionIcon, Button, Modal, Table, TextInput } from "@mantine/core";
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
  const [students, setStudents] = useState([]);
  const [modalState, { open: openModalState, close: closeModalState }] =
    useDisclosure(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  async function fetchData() {
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
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
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
            <div>
              <h2>Survey Details</h2>
              <p>
                <strong>Course -</strong> {selectedStudent.course.Course}
              </p>
            </div>
            <div>
              {staticData.map((v) => {
                return (
                  <div>
                    <h3 className='font-semibold text-gray-800 mb-2'>
                      {v.key}. {v.description}
                    </h3>
                    {scores
                      .filter(
                        (v) =>
                          v.training_id.toString() ===
                          selectedStudent.id.toString(),
                      )
                      .filter((c) => c.question.Criteria === v.key)
                      .map((sc) => {
                        return (
                          <div>
                            <div className='mb-6'>
                              <ul className='space-y-1 pl-4'>
                                <li className='Questiong-answer'>
                                  <span>{sc.question.Question}</span>
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
      <Table>
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
          {students
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
            })
            .map((stud, i) => {
              return (
                <Table.Tr>
                  <Table.Td>{i + 1}</Table.Td>
                  <Table.Td>{stud.Name}</Table.Td>
                  <Table.Td>
                    {convertDateRangeToString(stud.TrainingD)}
                  </Table.Td>
                  <Table.Td>{stud.Reg}</Table.Td>
                  <Table.Td>{stud.Instructor}</Table.Td>
                  <Table.Td>{new Date(stud.DateN).toDateString()}</Table.Td>
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
    </PageContainer>
  );
}

export default CourseInfo;
