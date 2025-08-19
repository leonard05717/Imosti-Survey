import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import {
  ActionIcon,
  AspectRatio,
  Button,
  Checkbox,
  Divider,
  LoadingOverlay,
  Menu,
  Modal,
  PasswordInput,
  Portal,
  ScrollAreaAutosize,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import supabase, { getAccount } from "../supabase";
import {
  IconArrowLeft,
  IconChevronDown,
  IconDotsVertical,
  IconPrinter,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { staticData } from "../data";
import "./styles/courseinfo.style.css";
import { toProper } from "../helpers/helper";
import { DatePicker, MonthPicker, YearPicker } from "@mantine/dates";
import AdminMainPage from "./AdminMainPage";


function convertDateRangeToString(dateRange) {
  const [f, s] = dateRange.substring(2, dateRange.length - 2).split('","');
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return `${new Date(f).toLocaleDateString("en-US", options)} to ${new Date(s).toLocaleDateString("en-US", options)}`;
}
function Trainee() {
  const { id: course_id } = useParams();
  const [loadingPage, setLoadingPage] = useState(true);
  const [students, setStudents] = useState([]);
  const [modalState, { open: openModalState, close: closeModalState }] =
    useDisclosure(false);

  const [DeleteRecord, { open: openDeleteRecord, close: closeDeleteRecord }] =
    useDisclosure(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [scores, setScores] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();
  const [Criterias, setCriterias] = useState([]);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Select");
  const [comfirmdelete, setcomfirmdelete] = useState();
  const [mapingAdmin, setmapingAdmin] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(
    [null, null],
    [null],
  );
  const account = getAccount();
  const [filterState, { open: openFilterState, close: closeFilterState }] =
    useDisclosure(false);
  const [storageData, setStorageData] = useState({
    revision_number: "",
    form_number: "",
    issued_date: "",
  });

  async function DeleteRecords() {
    const checkedStudents = students.filter((student) => student.checked);

    const studentIds = checkedStudents.map((s) => s.id);

    if (students.every((v) => !v.checked)) {
      console.log("No Student Checked");
      alert("You need at least 1 Student Check");
      return;
    }

    for (const sc of mapingAdmin.filter((v) => v.Role === "superadmin")) {
      if (sc.Password === comfirmdelete) {
        const { error: deleteError } = await supabase
          .from("Info-Training")
          .delete()
          .in("id", studentIds);

          const { error: deletehistory } = await supabase
          .from("history")
          .insert({
            transaction: "Delete Learners Record",
            Account: account?.Email,
            created_at: new Date(),
          });

          if (deletehistory) {
            console.log(`Something Error: ${deletehistory.message}`);
            return;
          }

        if (deleteError) {
          console.log(`Something Error: ${deleteError.message}`);
          return;
        }
      
        await fetchData();
        closeDeleteRecord();
        console.log("Delete Success");
        console.log(selectedDateRange[0], selectedDateRange[1]);
        console.log(checkedStudents);
        return;
      }
    }

    alert("Password Incorrect or not matched with any superadmin.");
  }

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
        .in("key", ["revision_number", "form_number", "issued_date"])
    ).data;
    setStorageData({
      revision_number:
        revisionData.find((r) => r.key === "revision_number")?.value || "",
      form_number:
        revisionData.find((r) => r.key === "form_number")?.value || "",
      issued_date:
        revisionData.find((r) => r.key === "issued_date")?.value || "",
    });
    const courseData = (await supabase.from("Course").select("*")).data;
    const CriteriaData = (
      await supabase.from("Criteria-Questioner").select().order("label")
    ).data;
    const AdminStaff = (await supabase.from("Staff-Info").select()).data;
    setmapingAdmin(AdminStaff);
    setCourses(courseData);
    setCriterias(CriteriaData);
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
        <title>${toProper(selectedStudent.Name)} - Evaluation Report</title>
        <style>
          @page {
            size: A4;
            margin: 0.75in 0.5in 0.75in 0.5in;
          }
          @media print {
            @page {
              size: A4;
              margin: 0.75in 0.5in 0.75in 0.5in;
            }
          }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            font-size: 15px;
            line-height: 1.3;
          }
          .student-report { 
            padding: 15px 20px; 
            max-width: 100%;
            box-sizing: border-box;
          }
          .header { 
            text-align: center; 
            margin-bottom: 20px; 
          }
          .student-info { 
            margin-bottom: 20px; 
            border-top: 2px solid #333; 
            border-bottom: 2px solid #333; 
            padding: 15px 0; 
          }
          .student-name { 
            font-size: 18px; 
            font-weight: bold; 
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 10px; 
            margin: 0 auto; 
          }
          .info-grid p {
            margin: 4px 0;
          }
          .survey-section { 
            margin-bottom: 20px; 
          }
          .criteria-title { 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 8px; 
            color: #333; 
            page-break-after: avoid;
          }
          .question-item { 
            display: flex; 
            justify-content: space-between; 
            padding: 4px 8px; 
            border-bottom: 1px solid #ddd; 
            page-break-inside: avoid;
          }
          .feedback-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 15px; 
          }
          .feedback-table th, .feedback-table td { 
            border: 1px solid #333; 
            padding: 6px 8px; 
            text-align: left; 
            vertical-align: top;
          }
          .feedback-table th { 
            background-color: #f5f5f5; 
            font-weight: bold; 
          }
          .print-footer { 
            position: fixed; 
            bottom: 0; 
            left: 0; 
            right: 0; 
            background: white; 
            border-top: 1px solid #000; 
            z-index: 1000;
          }
          .footer-table { 
            width: 100%; 
            border-collapse: collapse;  
          }
          .footer-table th, .footer-table td { 
            border: 1px solid #000; 
            padding: 3px 6px; 
            text-align: center; 
          }
          .footer-table th { 
            background-color: rgba(0,0,0,0.1); 
          }
         
          .content-with-footer { 
            padding-bottom: 50px; 
          }
          h3 {
            font-size: 16px;
            margin: 15px 0 10px 0;
            page-break-after: avoid;
          }
          /* Legal paper support */
          @media print and (max-height: 14in) {
            @page {
              size: legal;
              margin: 0.75in 0.5in 0.75in 0.5in;
            }
          }
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
                  <p><strong>Course:</strong> ${selectedStudent.course?.Course || ""}</p>
                  <p><strong>Company:</strong> ${selectedStudent.Reg}</p>
                  <p><strong>Instructor:</strong> ${selectedStudent.Instructor}</p>
                </div>
                <div>
                  <p><strong>Training Date:</strong> ${convertDateRangeToString(selectedStudent.TrainingD)}</p>
                  <p><strong>Evaluation Date:</strong> ${new Date(selectedStudent.DateN).toDateString()}</p>
                </div>
              </div>
            </div>

            <div class="survey-section">
              <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">Evaluation Responses</h3>
              ${Criterias.sort((a, b) => a.label.localeCompare(b.label))
                .map((criteria) => {
                  const filteredData = studentScores.filter(
                    (c) => c.question.Criteria === criteria.label,
                  );
                  return `
                    <div style="margin-bottom: 25px;">
                      <div class="criteria-title">
                        ${criteria.label}. ${criteria.CQuestion}
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
                  <td rowspan="2">${new Date(
                    storageData.issued_date,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</td>
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
                  <td rowspan="2">${new Date(
                    storageData.issued_date,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</td>
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

  const handlePrintToAverage = () => {
    const printWindow = window.open("", "_blank");

    // Get only checked students to calculate averages
    const checkedStudents = students.filter((student) => student.checked);

    if (checkedStudents.length === 0) {
      alert("Please select at least one student to calculate averages.");
      printWindow.close();
      return;
    }

    // Get all scores for checked students only
    const checkedScores = scores.filter((score) =>
      checkedStudents.some((student) => student.id === score.training_id),
    );

    // Calculate averages by criteria
    const calculateAveragesByCriteria = () => {
      const criteriaAverages = {};
      const questionAverages = {};

      Criterias.forEach((criteria) => {
        const criteriaScores = checkedScores.filter(
          (score) => score.question?.Criteria === criteria.label,
        );

        if (criteriaScores.length > 0) {
          const total = criteriaScores.reduce(
            (sum, score) => sum + score.score,
            0,
          );
          criteriaAverages[criteria.label] = (
            total / criteriaScores.length
          ).toFixed(2);

          // Group by question for detailed breakdown
          const questionGroups = {};
          criteriaScores.forEach((score) => {
            const questionId = score.question?.id;
            if (questionId) {
              if (!questionGroups[questionId]) {
                questionGroups[questionId] = {
                  question: score.question.Question,
                  scores: [],
                };
              }
              questionGroups[questionId].scores.push(score.score);
            }
          });

          // Calculate average for each question
          Object.keys(questionGroups).forEach((questionId) => {
            const questionData = questionGroups[questionId];
            const avg =
              questionData.scores.reduce((sum, score) => sum + score, 0) /
              questionData.scores.length;
            questionAverages[questionId] = {
              question: questionData.question,
              average: avg.toFixed(2),
              criteria: criteria.label,
            };
          });
        } else {
          criteriaAverages[criteria.label] = "0.00";
        }
      });

      return { criteriaAverages, questionAverages };
    };

    const { criteriaAverages, questionAverages } =
      calculateAveragesByCriteria();

    // Calculate overall average
    const overallAverage = Object.values(criteriaAverages)
      .filter((avg) => parseFloat(avg) > 0)
      .reduce((sum, avg, _, arr) => sum + parseFloat(avg) / arr.length, 0)
      .toFixed(2);

    // Get course information from first checked student
    const courseInfo = checkedStudents[0]?.course || {};
    const currentDate = new Date().toISOString().split("T")[0];

    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Evaluation Average Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #000;
            position: relative;
          }

          .watermark {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 100%;
            transform: translate(-50%, -50%);
            opacity: 0.1;
            z-index: 0;
          }

          .logo-container {
            display: grid;
            place-items: center;
            margin-top: 20px;
            z-index: 1;
          }

          .divider {
            margin: 30px 0;
            border-top: 1px solid #0003;
          }

          .content {
            padding: 0 30px 30px 30px;
            z-index: 1;
            position: relative;
            margin-top: -25px;
          }

          .course-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .course-title {
            font-weight: bold;
            font-size: 20px;
            margin: 0;
          }

          .course-description {
            font-size: 15px;
            margin: 0 0 5px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }

          th, td {
            font-size: 15px;
            padding: 6px 0;
          }

          thead th {
            text-align: left;
            padding-bottom: 8px;
          }

          tbody td, tbody th {
            padding-right: 20px;
          }

          .criteria-title {
            font-weight: bold;
            padding-top: 10px;
          }

          .total-average {
            display: flex;
            justify-content: end;
            margin-top: 10px;
          }

          .stats-info {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <img class="watermark" src="/images/Logo.png" alt="Watermark" />
        <div class="logo-container">
          <img src="/images/Admin-Logo.png" alt="Logo" style="height: 70px;" />
        </div>
        <div class="divider"></div>
        <div class="content">
          <div class="course-header">
            <p class="course-title">${checkedStudents.length} Learners Evaluation</p>
            <p>${new Date().toDateString()}</p>
          </div>
          <p class="course-description">
            - An Evaluation summary based on Company ${checkedStudents[0]?.Reg.toLocaleUpperCase()}.
          </p>

          <table>
            <thead>
              <tr>
                <th>CRITERIA</th>
                <th style="text-align: right;">Average</th>
              </tr>
            </thead>
            <tbody>
              ${Criterias.map(
                (criteria) => `
                <tr>
                  <th style="text-align: left;">${criteria.label}. ${criteria.CQuestion}</th>
                  <td style="text-align: right; padding-right: 20px">${criteriaAverages[criteria.label] || "0.00"}</td>
                </tr>
              `,
              ).join("")}
              <tr>
                <td colspan="2" style="text-align: right;">
                  <div style="width: 100%; display: flex; justify-content: end;">
                    <div style="border-top: 1px solid #0009; padding: 6px 0 0 20px; width: fit-content;"><strong>${overallAverage}</strong></div>
                  </div>
                </td>
              </tr>

              ${Criterias.sort((a, b) => a.label.localeCompare(b.label))
                .map((criteria) => {
                  const criteriaQuestions = Object.values(
                    questionAverages,
                  ).filter((q) => q.criteria === criteria.label);

                  if (criteriaQuestions.length === 0) return "";

                  return `
                  <tr><td class="criteria-title">${criteria.label}. ${criteria.CQuestion}</td><td></td></tr>
                  ${criteriaQuestions
                    .map(
                      (q, index) => `
                    <tr>
                      <td style="padding-left: 20px; padding-right: 20px;">${index + 1}. ${q.question}</td>
                      <td style="text-align: right;">${q.average}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                `;
                })
                .join("")}
            </tbody>
          </table>
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
          @page {
            size: A4;
            margin: 0.75in 0.5in 0.75in 0.5in;
          }
          @media print {
            @page {
              size: A4;
              margin: 0.75in 0.5in 0.75in 0.5in;
            }
          }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            font-size: 15px;
            line-height: 1.3;
          }
          .student-report { 
            padding: 15px 20px; 
            max-width: 100%;
            box-sizing: border-box;
          }
          .header { 
            text-align: center; 
            margin-bottom: 20px; 
          }
          .student-info { 
            margin-bottom: 20px; 
            border-top: 2px solid #333; 
            border-bottom: 2px solid #333; 
            padding: 15px 0; 
          }
          .student-name { 
            font-size: 18px; 
            font-weight: bold; 
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 10px; 
            margin: 0 auto; 
          }
          .info-grid p {
            margin: 4px 0;
          }
          .survey-section { 
            margin-bottom: 20px; 
          }
          .criteria-title { 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 8px; 
            color: #333; 
            page-break-after: avoid;
          }
          .question-item { 
            display: flex; 
            justify-content: space-between; 
            padding: 4px 8px; 
            border-bottom: 1px solid #ddd; 
            page-break-inside: avoid;
          }
          .feedback-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 15px; 
          }
          .feedback-table th, .feedback-table td { 
            border: 1px solid #333; 
            padding: 6px 8px; 
            text-align: left; 
            vertical-align: top;
          }
          .feedback-table th { 
            background-color: #f5f5f5; 
            font-weight: bold; 
          }
          .print-footer { 
            position: fixed; 
            bottom: 0; 
            left: 0; 
            right: 0; 
            background: white; 
            border-top: 1px solid #000; 
            z-index: 1000;
          }
          .footer-table { 
            width: 100%; 
            border-collapse: collapse;  
          }
          .footer-table th, .footer-table td { 
            border: 1px solid #000; 
            padding: 3px 6px; 
            text-align: center; 
          }
          .footer-table th { 
            background-color: rgba(0,0,0,0.1); 
          }
          .content-with-footer { 
            padding-bottom: 50px; 
          }
          h3 {
            font-size: 16px;
            margin: 15px 0 10px 0;
            page-break-after: avoid;
          }
          /* Legal paper support */
          @media print and (max-height: 14in) {
            @page {
              size: legal;
              margin: 0.75in 0.5in 0.75in 0.5in;
            }
          }
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

      // First page - Student info and survey responses
      printContent += `
        <div class="student-report">
          <div class="content-with-footer">
            <div class="header">
              <img src="/images/Admin-Logo.png" style="height: 70px;" />
            </div>
            
            <div class="student-info">
              <div class="student-name">${toProper(student.Name)}</div>
              <div class="info-grid">
                <div>
                  <p><strong>Course:</strong> ${student.course?.Course || ""}</p>
                  <p><strong>Company:</strong> ${student.Reg}</p>
                  <p><strong>Instructor:</strong> ${student.Instructor}</p>
                </div>
                <div>
                  <p><strong>Training Date:</strong> ${convertDateRangeToString(student.TrainingD)}</p>
                  <p><strong>Evaluation Date:</strong> ${new Date(student.DateN).toDateString()}</p>
                </div>
              </div>
            </div>

            <div class="survey-section">
              <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">Evaluation Responses</h3>
              ${Criterias.sort((a, b) => a.label.localeCompare(b.label))
                .map((criteria) => {
                  const filteredData = studentScores.filter(
                    (c) => c.question.Criteria === criteria.label,
                  );
                  return `
                    <div style="margin-bottom: 25px;">
                      <div class="criteria-title">
                        ${criteria.label}. ${criteria.CQuestion}
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
                  <td rowspan="2">${new Date(
                    storageData.issued_date,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</td>
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
              <div class="student-name">${toProper(student.Name)} - Additional Feedback</div>
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
                  <td rowspan="2">${new Date(
                    storageData.issued_date,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</td>
                </tr>
                <tr>
                  <th style="background-color: rgba(0,0,0,0.1);">Revision Number:</th>
                  <td>${storageData.revision_number}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        ${index < printStudents.length - 1 ? '<div style="page-break-before: always;"></div>' : ""}
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

  const checkedStudents = students.filter((v) => v.checked);

  return (
    <PageContainer
      outsideChildren={
        <LoadingOverlay
          loaderProps={{ type: "dots" }}
          visible={loadingPage}
        />
      }
      title='Learners'
      rightSection={
        <div className='flex items-center'>
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftSection={<IconSearch size={18} />}
            placeholder='Search'
          />
          <Menu
            withArrow
            arrowSize={17}
            styles={{
              arrow: {
                borderTop: "1px solid #0005",
                borderLeft: "1px solid #0005",
              },
            }}
          >
            <Menu.Target>
              <ActionIcon
                disabled={students.every((v) => !v.checked)}
                color='blue'
                size='lg'
              >
                <IconPrinter size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                boxShadow: "1px 2px 3px #0005",
                border: "1px solid #0005",
              }}
            >
              <Menu.Item
                leftSection={<IconPrinter size={20} />}
                onClick={handlePrint}
              >
                Print Learners ({checkedStudents.length})
              </Menu.Item>
              <Menu.Item
                leftSection={<IconPrinter size={20} />}
                onClick={handlePrintToAverage}
              >
                Print To Average
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      }
    >
      <Modal
        title={<span style={{ color: "white" }}>{selectedStudent?.Name}</span>}
        opened={modalState}
        onClose={closeModalState}
      >
        {selectedStudent && (
          <div>
            <div className='pt-5'>
              <div className='mb-2 flex items-center justify-between'>
                <p className='text-xl font-black'>Evaluation Details</p>
                <Button
                  leftSection={<IconPrinter size={18} />}
                  variant='outline'
                  size='xs'
                  onClick={handleSinglePrint}
                >
                  Print
                </Button>
              </div>
              <p className='mt-2 text-sm'>
                <strong>Course -</strong> {selectedStudent.course.Course}
              </p>
            </div>
            <div className='pt-3'>
              {Criterias.map((v, i) => {
                const filteredData = scores
                  .filter(
                    (v) =>
                      v.training_id.toString() ===
                      selectedStudent.id.toString(),
                  )
                  .filter((c) => c.question.Criteria === v.label);

                return (
                  <div
                    key={i}
                    className='mb-5'
                  >
                    <h3 className='font-semibold text-gray-800 mb-2'>
                      {v.label}. {v.CQuestion}{" "}
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

      {/*Delete*/}
      <Modal
        radius={20}
        centered='true'
        opened={DeleteRecord}
        onClose={() => {
          closeDeleteRecord();
        }}
      >
        <div className='Response'>
        <Text fw={700}>Confirm Deletion</Text>
        </div>
        <PasswordInput
          required
          type='Password'
          radius='md'
          placeholder='Enter Password'
          onChange={(e) => {
            setcomfirmdelete(e.target.value);
          }}
        />
        <Button
          onClick={DeleteRecords}
          className='Button-done'
          type='submit'
          style={{ width: "fit-content" }}
        >
          Delete
        </Button>
      </Modal>

      {/* Filter Modal */}
      <Modal
        opened={filterState}
        onClose={closeFilterState}
        title={selectedFilter || "Date Picker"}
        // size='md'
        size='sm'
      >
        <div className='flex items-center justify-center py-5'>
          {selectedFilter === "By Date Range" && (
            <div>
              <YearPicker
                type='range'
                value={selectedDateRange}
                allowSingleDateInRange
                label='Select Year'
                onChange={setSelectedDateRange}
              />
            </div>
          )}
        </div>
      </Modal>

      <Button
        onClick={() => {
          openDeleteRecord();
        }}
        size='xs'
        leftSection={<IconTrash size={19} />}
        mb={10}
        disabled={mapingAdmin.every((v) => v.Role !== "superadmin")}
      
      >
        Delete
      </Button>

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
                  {new Date(stud.DateN).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
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
