import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import {
  ActionIcon,
  Button,
  Divider,
  LoadingOverlay,
  Modal,
  Portal,
  ScrollAreaAutosize,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import supabase from "../supabase";
import {
  IconArrowLeft,
  IconDotsVertical,
  IconPrinter,
  IconSearch,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { staticData } from "../data";
import "./styles/courseinfo.style.css";
import { toProper } from "../helpers/helper";

function convertDateRangeToString(dateRange) {
  const [f, s] = dateRange.substring(2, dateRange.length - 2).split('","');
  return `${new Date(f).toDateString()} to ${new Date(s).toDateString()}`;
}
function Trainee() {
  const { id: course_id } = useParams();
  const [loadingPage, setLoadingPage] = useState(true);
  const [students, setStudents] = useState([]);
  const [modalState, { open: openModalState, close: closeModalState }] =
    useDisclosure(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [scores, setScores] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);

  async function fetchData() {
    setLoadingPage(true);
    const studentData = (
      await supabase
        .from("Info-Training")
        .select("*, course:course_id(*)")
        .order("DateN", { ascending: false })
    ).data;
    const scoreData = (
      await supabase
        .from("scores")
        .select("*, question:Questioner(*), traning:Info-Training(*)")
    ).data;
    const feedbackData = (
      await supabase
        .from("feedback_answer")
        .select("*, feedback:feedback_id(*)")
    ).data;
    const courseData = (await supabase.from("Course").select("*")).data;
    setCourses(courseData);
    setScores(scoreData);
    setFeedbacks(feedbackData);
    setStudents(studentData);
    setLoadingPage(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStudents = students.filter((v) => {
    if (!search) return true;
    const s = search.toLowerCase().trim();
    return (
      v.Name.toLowerCase().includes(s) ||
      convertDateRangeToString(v.TrainingD).includes(s) ||
      v.Reg.toLowerCase().includes(s) ||
      new Date(v.DateN).toDateString().includes(s)
    );
  });

  const filteredFeedbacks = feedbacks.filter(
    (v) => v.training_id === selectedStudent?.id,
  );

  const handlePrint = () => {
    window.setTimeout(() => {
      window.print();
    }, 100);
  };

  const crs = courses.find((v) => v.id.toString() === course_id);

  return (
    <PageContainer
      outsideChildren={
        <LoadingOverlay
          loaderProps={{ type: "dots" }}
          visible={loadingPage}
        />
      }
      title='Trainee'
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
      <Portal>
        <div className='printable'>
          {selectedStudent && (
            <div>
              <div className='flex justify-center'>
                <img
                  style={{ height: 100 }}
                  src='/images/Admin-Logo.png'
                />
              </div>
              <div className='p-8 max-w-4xl mx-auto'>
                {/* Header Section */}
                <div className='mb-8 border-y-2 border-gray-300 py-6'>
                  <h2 className='text-2xl font-semibold mb-4'>
                    {toProper(selectedStudent.Name)}
                  </h2>
                  <div className='grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto'>
                    <div>
                      <p>
                        <strong>Code:</strong> {selectedStudent.course?.Code}
                      </p>
                      <p>
                        <strong>Company:</strong> {selectedStudent.Reg}
                      </p>
                      <p>
                        <strong>Instructor:</strong>{" "}
                        {selectedStudent.Instructor}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Training Date:</strong>{" "}
                        {convertDateRangeToString(selectedStudent.TrainingD)}
                      </p>
                      <p>
                        <strong>Survey Date:</strong>{" "}
                        {new Date(selectedStudent.DateN).toDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Survey Responses Section */}
                <div className='mb-8'>
                  <h3 className='text-xl font-bold mb-4'>Survey Responses</h3>
                  {staticData.map((criteria, index) => {
                    const filteredData = scores
                      .filter(
                        (v) =>
                          v.training_id.toString() ===
                          selectedStudent.id.toString(),
                      )
                      .filter((c) => c.question.Criteria === criteria.key);

                    return (
                      <div
                        key={index}
                        className='mb-6 break-inside-avoid'
                      >
                        <h4 className='font-semibold text-lg mb-3 text-gray-800'>
                          {criteria.key}. {criteria.description}
                          {filteredData.length === 0 && (
                            <span className='text-sm font-normal text-gray-500'>
                              {" "}
                              - No Data Found
                            </span>
                          )}
                        </h4>
                        {filteredData.map((sc, i) => (
                          <div
                            key={i}
                            className='flex justify-between items-center py-2 px-4 border-b border-gray-200'
                          >
                            <span className='flex-1 pr-4'>
                              {i + 1}. {sc.question.Question}
                            </span>
                            <span className='font-bold text-right min-w-20'>
                              Score: {sc.score}/5
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Additional Feedback Section */}
                <div className='mb-8'>
                  <h3 className='text-xl font-bold mb-4'>
                    Additional Feedback
                  </h3>
                  {filteredFeedbacks.length > 0 ? (
                    <table className='w-full border-collapse border border-gray-800'>
                      <thead>
                        <tr className='bg-gray-100'>
                          <th className='border border-gray-800 p-3 text-left font-bold'>
                            Question
                          </th>
                          <th className='border border-gray-800 p-3 text-left font-bold'>
                            Answer
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFeedbacks.map((feedback, i) => (
                          <tr key={i}>
                            <td className='border border-gray-800 p-3 align-top'>
                              {feedback.feedback.QuestionFeedback}
                            </td>
                            <td className='border border-gray-800 p-3'>
                              {feedback.answer || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className='text-gray-600 italic'>
                      No feedback responses found.
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className='text-center text-sm text-gray-500 border-t border-gray-300 pt-4 mt-8'>
                  <p>
                    Generated on {new Date().toLocaleDateString()} at{" "}
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Portal>

      <Modal
        title={selectedStudent?.Name}
        opened={modalState}
        onClose={closeModalState}
      >
        {selectedStudent && (
          <div>
            <div className='pt-5'>
              <div className='mb-2 flex items-center justify-between'>
                <p className='text-xl font-black'>Survey Details</p>
                <Button
                  leftSection={<IconPrinter size={18} />}
                  variant='outline'
                  size='xs'
                  onClick={handlePrint}
                >
                  Print
                </Button>
              </div>
              <p>
                <strong>Code -</strong> {selectedStudent.course.Code}
              </p>
              <p className='mt-2 text-sm'>
                <strong>Course -</strong> {selectedStudent.course.Course}
              </p>
            </div>
            <div className='pt-3'>
              {staticData.map((v, i) => {
                const filteredData = scores
                  .filter(
                    (v) =>
                      v.training_id.toString() ===
                      selectedStudent.id.toString(),
                  )
                  .filter((c) => c.question.Criteria === v.key);

                return (
                  <div
                    key={i}
                    className='mb-5'
                  >
                    <h3 className='font-semibold text-gray-800 mb-2'>
                      {v.key}. {v.description}{" "}
                      {filteredData.length === 0 && (
                        <Text size='sm'>- No Data Found</Text>
                      )}
                    </h3>

                    {filteredData.map((sc, ixx) => {
                      return (
                        <div key={ixx}>
                          <div className='mb-2'>
                            <ul className='space-y-1 pl-4'>
                              <li className='Questiong-answer'>
                                <span>
                                  {ixx + 1}. {sc.question.Question}
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
            <Divider />
            <ScrollAreaAutosize>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Question</Table.Th>
                    <Table.Th>Answer</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredFeedbacks.map((v, i) => {
                    return (
                      <Table.Tr key={i}>
                        <Table.Td className='text-sm'>
                          {v.feedback.QuestionFeedback}
                        </Table.Td>
                        <Table.Td className='text-sm'>
                          {v.answer || "-"}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
              {filteredFeedbacks.length === 0 && (
                <Text
                  size='sm'
                  ta='center'
                  pt={10}
                >
                  No Data Found
                </Text>
              )}
            </ScrollAreaAutosize>
          </div>
        )}
      </Modal>

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
          {filteredStudents.map((stud, i) => {
            return (
              <Table.Tr
                style={{
                  verticalAlign: "top",
                }}
                key={i}
              >
                <Table.Td>{i + 1}</Table.Td>
                <Table.Td style={{ minWidth: 150 }}>
                  {toProper(stud.Name)}
                </Table.Td>
                <Table.Td style={{ minWidth: 150 }}>
                  {convertDateRangeToString(stud.TrainingD)}
                </Table.Td>
                <Table.Td>{stud.Reg}</Table.Td>
                <Table.Td style={{ minWidth: 120 }}>
                  {toProper(stud.Instructor)}
                </Table.Td>
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
export default Trainee;
