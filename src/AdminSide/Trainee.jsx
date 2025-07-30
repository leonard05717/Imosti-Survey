import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  LoadingOverlay,
  Modal,
  Portal,
  ScrollAreaAutosize,
  Table,
  Text,
  TextInput,
  Tooltip,
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
  const [storageData, setStorageData] = useState({
    revision_number: "",
    form_number: "",
  });

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
    const revisionData = (
      await supabase
        .from("storage")
        .select()
        .in("key", ["revision_number", "form_number"])
    ).data;
    setStorageData({
      revision_number:
        revisionData.find((r) => r.key === "revision_number")?.value || "",
      form_number:
        revisionData.find((r) => r.key === "form_number")?.value || "",
    });
    const courseData = (await supabase.from("Course").select("*")).data;
    setCourses(courseData);
    setScores(scoreData);
    setFeedbacks(feedbackData);
    setStudents(studentData.map((v) => ({ ...v, checked: false })));
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

  const handleSinglePrint = () => {
    if (!selectedStudent) return;

    const printWindow = window.open("", "_blank");

    const studentScores = scores.filter(
      (v) => v.training_id.toString() === selectedStudent.id.toString(),
    );
    const studentFeedbacks = feedbacks.filter(
      (v) => v.training_id === selectedStudent.id,
    );

    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${toProper(selectedStudent.Name)} - Survey Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .student-report { padding: 10px; }
          .header { text-align: center; margin-bottom: 30px; }
          .student-info { margin-bottom: 30px; border-top: 2px solid #333; border-bottom: 2px solid #333; padding: 20px 0; }
          .student-name { font-size: 20px; font-weight: bold; margin-bottom: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 0 auto; }
          .survey-section { margin-bottom: 30px; }
          .criteria-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #333; }
          .question-item { display: flex; justify-content: space-between; padding: 8px 15px; border-bottom: 1px solid #ddd; }
          .feedback-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .feedback-table th, .feedback-table td { border: 1px solid #333; padding: 12px; text-align: left; }
          .feedback-table th { background-color: #f5f5f5; font-weight: bold; }
          .print-footer { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #000; }
          .footer-table { width: 100%; border-collapse: collapse; font-size: 12px; }
          .footer-table th, .footer-table td { border: 1px solid #000; padding: 4px 8px; text-align: center; }
          .footer-table th { background-color: rgba(0,0,0,0.1); }
          @page { margin-bottom: 60px; }
          .content-with-footer { padding-bottom: 60px; }
        </style>
      </head>
      <body>
        <div class="student-report">
          <div class="content-with-footer">
            <div class="header">
              <img src="/images/Admin-Logo.png" style="height: 70px;" />
            </div>
            
            <div class="student-info">
              <div class="student-name">${toProper(selectedStudent.Name)}</div>
              <div class="info-grid">
                <div>
                  <p><strong>Code:</strong> ${selectedStudent.course?.Code || ""}</p>
                  <p><strong>Company:</strong> ${selectedStudent.Reg}</p>
                  <p><strong>Instructor:</strong> ${selectedStudent.Instructor}</p>
                </div>
                <div>
                  <p><strong>Training Date:</strong> ${convertDateRangeToString(selectedStudent.TrainingD)}</p>
                  <p><strong>Survey Date:</strong> ${new Date(selectedStudent.DateN).toDateString()}</p>
                </div>
              </div>
            </div>

            <div class="survey-section">
              <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">Survey Responses</h3>
              ${staticData
                .map((criteria) => {
                  const filteredData = studentScores.filter(
                    (c) => c.question.Criteria === criteria.key,
                  );
                  return `
                    <div style="margin-bottom: 25px;">
                      <div class="criteria-title">
                        ${criteria.key}. ${criteria.description}
                        ${filteredData.length === 0 ? '<span style="font-size: 14px; font-weight: normal; color: #666;"> - No Data Found</span>' : ""}
                      </div>
                      ${filteredData
                        .map(
                          (sc, i) => `
                        <div class="question-item">
                          <span>${i + 1}. ${sc.question.Question}</span>
                          <span style="font-weight: bold;">Score: ${sc.score}/5</span>
                        </div>
                      `,
                        )
                        .join("")}
                    </div>
                  `;
                })
                .join("")}
            </div>

          </div>
          
          <div class="print-footer">
            <table class="footer-table">
              <tbody>
                <tr>
                  <th rowspan="2">INTERNAL</th>
                  <th style="background-color: rgba(0,0,0,0.1);">Form Number:</th>
                  <td>${storageData.form_number}</td>
                  <th rowspan="2" style="background-color: rgba(0,0,0,0.1);">Date Issued:</th>
                  <td rowspan="2">${new Date().toDateString()}</td>
                </tr>
                <tr>
                  <th style="background-color: rgba(0,0,0,0.1);">Revision Number:</th>
                  <td>${storageData.revision_number}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Second Page - Feedback -->
        <div class="student-report" style="page-break-before: always;">
          <div class="content-with-footer">
            <div class="header">
              <img src="/images/Admin-Logo.png" style="height: 70px;" />
            </div>
            
            <div class="student-info">
              <div class="student-name">${toProper(selectedStudent.Name)} - Additional Feedback</div>
            </div>

            <div class="survey-section">
              <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">Additional Feedback</h3>
              ${
                studentFeedbacks.length > 0
                  ? `
                <table class="feedback-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${studentFeedbacks
                      .map(
                        (feedback) => `
                      <tr>
                        <td style="vertical-align: top;">${feedback.feedback.QuestionFeedback}</td>
                        <td>${feedback.answer || "-"}</td>
                      </tr>
                    `,
                      )
                      .join("")}
                  </tbody>
                </table>
              `
                  : '<p style="color: #666; font-style: italic;">No feedback responses found.</p>'
              }
            </div>
          </div>
          
          <div class="print-footer">
            <table class="footer-table">
              <tbody>
                <tr>
                  <th rowspan="2">INTERNAL</th>
                  <th style="background-color: rgba(0,0,0,0.1);">Form Number:</th>
                  <td>${storageData.form_number}</td>
                  <th rowspan="2" style="background-color: rgba(0,0,0,0.1);">Date Issued:</th>
                  <td rowspan="2">${new Date().toDateString()}</td>
                </tr>
                <tr>
                  <th style="background-color: rgba(0,0,0,0.1);">Revision Number:</th>
                  <td>${storageData.revision_number}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  const handlePrint = () => {
    const printStudents = students.filter((v) => v.checked);

    const printWindow = window.open("", "_blank");

    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Reports</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .page-break { page-break-after: always; }
          .student-report { padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .student-info { margin-bottom: 30px; border-top: 2px solid #333; border-bottom: 2px solid #333; padding: 20px 0; }
          .student-name { font-size: 24px; font-weight: bold; margin-bottom: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 0 auto; }
          .survey-section { margin-bottom: 30px; }
          .criteria-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; }
          .question-item { display: flex; justify-content: space-between; padding: 8px 15px; border-bottom: 1px solid #ddd; }
          .feedback-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .feedback-table th, .feedback-table td { border: 1px solid #333; padding: 12px; text-align: left; }
          .feedback-table th { background-color: #f5f5f5; font-weight: bold; }
          .print-footer { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #000; }
          .footer-table { width: 100%; border-collapse: collapse; font-size: 12px; }
          .footer-table th, .footer-table td { border: 1px solid #000; padding: 4px 8px; text-align: center; }
          .footer-table th { background-color: rgba(0,0,0,0.1); }
          @page { margin-bottom: 60px; }
          .content-with-footer { padding-bottom: 60px; }
        </style>
      </head>
      <body>
    `;

    printStudents.forEach((student, index) => {
      const studentScores = scores.filter(
        (v) => v.training_id.toString() === student.id.toString(),
      );
      const studentFeedbacks = feedbacks.filter(
        (v) => v.training_id === student.id,
      );

      printContent += `
        <div class="student-report ${index < printStudents.length - 1 ? "page-break" : ""}">
          <div class="content-with-footer">
            <div class="header">
              <img src="/images/Admin-Logo.png" style="height: 100px;" />
            </div>
            
            <div class="student-info">
              <div class="student-name">${toProper(student.Name)}</div>
              <div class="info-grid">
                <div>
                  <p><strong>Code:</strong> ${student.course?.Code || ""}</p>
                  <p><strong>Company:</strong> ${student.Reg}</p>
                  <p><strong>Instructor:</strong> ${student.Instructor}</p>
                </div>
                <div>
                  <p><strong>Training Date:</strong> ${convertDateRangeToString(student.TrainingD)}</p>
                  <p><strong>Survey Date:</strong> ${new Date(student.DateN).toDateString()}</p>
                </div>
              </div>
            </div>

            <div class="survey-section">
              <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">Survey Responses</h3>
              ${staticData
                .map((criteria) => {
                  const filteredData = studentScores.filter(
                    (c) => c.question.Criteria === criteria.key,
                  );
                  return `
                  <div style="margin-bottom: 25px;">
                    <div class="criteria-title">
                      ${criteria.key}. ${criteria.description}
                      ${filteredData.length === 0 ? '<span style="font-size: 14px; font-weight: normal; color: #666;"> - No Data Found</span>' : ""}
                    </div>
                    ${filteredData
                      .map(
                        (sc, i) => `
                      <div class="question-item">
                        <span>${i + 1}. ${sc.question.Question}</span>
                        <span style="font-weight: bold;">Score: ${sc.score}/5</span>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                `;
                })
                .join("")}
            </div>

            <div class="survey-section">
              <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">Additional Feedback</h3>
              ${
                studentFeedbacks.length > 0
                  ? `
                <table class="feedback-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${studentFeedbacks
                      .map(
                        (feedback) => `
                      <tr>
                        <td style="vertical-align: top;">${feedback.feedback.QuestionFeedback}</td>
                        <td>${feedback.answer || "-"}</td>
                      </tr>
                    `,
                      )
                      .join("")}
                  </tbody>
                </table>
              `
                  : '<p style="color: #666; font-style: italic;">No feedback responses found.</p>'
              }
            </div>
          </div>
          
          <div class="print-footer">
            <table class="footer-table">
              <tbody>
                <tr>
                  <th rowspan="2">INTERNAL</th>
                  <th style="background-color: rgba(0,0,0,0.1);">Form Number:</th>
                  <td>${storageData.form_number}</td>
                  <th rowspan="2" style="background-color: rgba(0,0,0,0.1);">Date Issued:</th>
                  <td rowspan="2">${new Date().toDateString()}</td>
                </tr>
                <tr>
                  <th style="background-color: rgba(0,0,0,0.1);">Revision Number:</th>
                  <td>${storageData.revision_number}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    });

    printContent += `
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

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
        <div className='flex items-center'>
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftSection={<IconSearch size={18} />}
            placeholder='Search'
          />
          <ActionIcon
            disabled={students.every((v) => !v.checked)}
            onClick={handlePrint}
            color='blue'
            size='lg'
          >
            <Tooltip
              position='bottom'
              withArrow
              label={`Print ${students.filter((v) => v.checked).length} Student(s)`}
            >
              <IconPrinter size={20} />
            </Tooltip>
          </ActionIcon>
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
              <div className='mb-2 flex items-center justify-between'>
                <p className='text-xl font-black'>Survey Details</p>
                <Button
                  leftSection={<IconPrinter size={18} />}
                  variant='outline'
                  size='xs'
                  onClick={handleSinglePrint}
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
                      <Table.Tr
                        style={{ verticalAlign: "top" }}
                        key={i}
                      >
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
            <Table.Th w={10}>
              <Checkbox
                checked={filteredStudents.every((v) => v.checked)}
                onChange={(e) => {
                  setStudents((curr) =>
                    curr.map((v) => {
                      if (search && filteredStudents.length > 0) {
                        if (filteredStudents.some((fs) => fs.id === v.id)) {
                          return { ...v, checked: e.currentTarget.checked };
                        }
                        return v;
                      }

                      return { ...v, checked: e.currentTarget.checked };
                    }),
                  );
                }}
              />
            </Table.Th>
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
                <Table.Td>
                  <Checkbox
                    onChange={(e) => {
                      setStudents((curr) =>
                        curr.map((v) => {
                          if (v.id === stud.id) {
                            return { ...v, checked: e.currentTarget.checked };
                          }
                          return v;
                        }),
                      );
                    }}
                    checked={stud.checked}
                  />
                </Table.Td>
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
