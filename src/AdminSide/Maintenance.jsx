import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import supabase, { getAccount } from "../supabase";
import { staticData } from "../data";
import {
  ActionIcon,
  AspectRatio,
  Button,
  Image,
  Input,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
} from "@mantine/core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

function Maintenance() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [submitEvaluationLoading, setSubmitEvaluationLoading] = useState(false);
  const [
    evaluationState,
    { open: openEvaluationState, close: closeEvaluationState },
  ] = useDisclosure(false);
  const [
    feedbackState,
    { open: openFeedbackState, close: closeFeedbackState },
  ] = useDisclosure(false);
  const [
    deleteEvaluationState,
    { open: openDeleteEvaluationState, close: closeDeleteEvaluationState },
  ] = useDisclosure(false);
  const [
    EditCriteria,
    { open: openEditCriteria, close: closeEditCriteria },
  ] = useDisclosure(false);
  const [
    editCourse,
    { open: openeditCourse, close: closeeditCourse },
  ] = useDisclosure(false);
  const [
    CriteriaAdd,
    { open: openCriteriaAdd, close: closeCriteriaAdd },
  ] = useDisclosure(false);

  const [
    CourseAdd,
    { open: openCourseAdd, close: closeCourseAdd },
  ] = useDisclosure(false);
  
  const [
    deleteFeedbackState,
    { open: openDeleteFeedbackState, close: closeDeleteFeedbackState },
  ] = useDisclosure(false);
  const [
    deleteCriteriaState,
    { open: openDeleteCriteriaState, close: closeDeleteCriteriaState },
  ] = useDisclosure(false);
  const [
    deleteCourse,
    { open: opendeleteCourse, close: closedeleteCourse },
  ] = useDisclosure(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedFeedbackDeleteId, setSelectedFeedbackDeleteId] =
    useState(null);
  const [selectedIDCriteria, setselectedIDCriteria] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteFeedbackLoading, setDeleteFeedbackLoading] = useState(false);
  const [deleteCriteriaLoading, setDeleteCriteriaLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [submitFeedbackLoading, setSubmitFeedbackLoading] = useState(false);
  const [CriteriaQ , setCriteriaQ] = useState([]);
  const [listcourses , setlistcourses] = useState([]);
  const [submitCretiraLoading, setsubmitCretiraLoading] = useState(false);
  const [CriteriaT, setCriteriaT] = useState("")
  const [labeladd, setlabeladd] = useState("")
  const account = getAccount();

  const evaluationForm = useForm({
    mode: "controlled",
    initialValues: {
      criteria: "",
      question: "",
    },
  });

  const feedbackForm = useForm({
    mode: "controlled",
    initialValues: {
      feedback: "",
    },
  });

  const CriteriaForm = useForm({
    mode: "controlled",
    initialValues: {
      Criterias: "",
      label:"",
    },
  });

  const CourseForm = useForm({
    mode: "controlled",
    initialValues: {
      Course: "",
    
    },
  });

 

  async function submitEvaluationEvent(evaluation) {
    try {
      setSubmitEvaluationLoading(true);

      const { data: criteriaData, error: criteriaError } = await supabase
         .from('Criteria-Questioner')
         .select('id')
         .eq('label', evaluation.criteria);

      if (criteriaError) {
         console.error('Error fetching Criteria ID:', criteriaError);
       return;
        }

        const Criteria_ids = criteriaData[0]?.id;

      const { error: insertError } = await supabase.from("Questioner").insert({
        Criteria: evaluation.criteria,
        Question: evaluation.question,
        created_at: new Date(),
        Criteria_id: Criteria_ids,
      });

      const { error: deletehistory } = await supabase
      .from("history")
      .insert({
        transaction: "Add Criteria Question",
        Account: account?.Email,
        created_at: new Date(),
      });


      if (deletehistory) {
        console.log(`Something Error: ${deletehistory.message}`);
        return;
      }

      if (insertError) {
        console.log(`Something Error: ${insertError.message}`);
        return;
      }
      await fetchData();
      evaluationForm.setFieldValue("question", "");
      console.log("Success");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitEvaluationLoading(false);
    }
  }

  async function submitFeedbackEvent(feedback) {
    try {
      setSubmitFeedbackLoading(true);

      const { error: insertError } = await supabase
        .from("Feedback-Question")
        .insert({
          QuestionFeedback: feedback.feedback,
          created_at: new Date(),
        });

        const { error: deletehistory } = await supabase
        .from("history")
        .insert({
          transaction: "Add Feedback Question",
          Account: account?.Email,
          created_at: new Date(),
        });


         if (deletehistory) {
          console.log(`Something Error: ${deletehistory.message}`);
          return;
        }


      if (insertError) {
        console.log(`Something Error: ${insertError.message}`);
        return;
      }
      await fetchData();
      feedbackForm.setFieldValue("feedback", "");
      console.log("Success");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitFeedbackLoading(false);
    }
  }

  async function submitCriteriaAdd(Criterias) {
    try {
      setSubmitFeedbackLoading(true);

      const { error: insertError } = await supabase
        .from("Criteria-Questioner")
        .insert({
          CQuestion: Criterias.Criterias,
          label: Criterias.label,
          created_at: new Date(),
        });

        const { error: deletehistory } = await supabase
        .from("history")
        .insert({
          transaction: "Add Criteria",
          Account: account?.Email,
          created_at: new Date(),
        });


         if (deletehistory) {
          console.log(`Something Error: ${deletehistory.message}`);
          return;
        }


      if (insertError) {
        console.log(`Something Error: ${insertError.message}`);
        return;
      }
      await fetchData();
      CriteriaForm.setFieldValue("Criterias", "");
      CriteriaForm.setFieldValue("label", "");
      console.log("Success");
      closeCriteriaAdd();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitFeedbackLoading(false);
    }
  }

  async function submitCourseAdd(Courses) {
    try {
      setSubmitFeedbackLoading(true);

      const { error: insertError } = await supabase
        .from("Course")
        .insert({
          Course: Courses.Course,
          created_at: new Date(),
        });
        const { error: deletehistory } = await supabase
        .from("history")
        .insert({
          transaction: "Add Course",
          Account: account?.Email,
          created_at: new Date(),
        });
        if (deletehistory) {
          console.log(`Something Error: ${deletehistory.message}`);
          return;
        }


      if (insertError) {
        console.log(`Something Error: ${insertError.message}`);
        return;
      }
      await fetchData();
      CriteriaForm.setFieldValue("Course", "");
      console.log("Success");
      closeCourseAdd();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitFeedbackLoading(false);
    }
  }

  async function SubmitCriteriaEdit() {
    if (!selectedIDCriteria) return;
    setsubmitCretiraLoading(true);
    const { error: deleteError } = await supabase
      .from("Criteria-Questioner")
      .update({
        CQuestion : CriteriaT,
        label : labeladd 
      })
      .eq("id", selectedIDCriteria);

      const { error: deletehistory } = await supabase
      .from("history")
      .insert({
        transaction: "Edit Criteria",
        Account: account?.Email,
        created_at: new Date(),
      });


      if (deletehistory) {
        console.log(`Something Error: ${deletehistory.message}`);
        return;
      }


    if (deleteError) {
      setsubmitCretiraLoading(false);
      console.log(`Something Error: ${deleteError.message}`);
      return;
    }
    await fetchData();
    closeEditCriteria();
    console.log("Edit Success");
    setsubmitCretiraLoading(false);
  }

  async function SubmiteditCourse() {
    if (!selectedIDCriteria) return;
    setsubmitCretiraLoading(true);
    const { error: deleteError } = await supabase
      .from("Course")
      .update({
        Course : CriteriaT,
      })
      .eq("id", selectedIDCriteria);

      const { error: deletehistory } = await supabase
      .from("history")
      .insert({
        transaction: "Edit Course",
        Account: account?.Email,
        created_at: new Date(),
      });

      if (deletehistory) {
        console.log(`Something Error: ${deletehistory.message}`);
        return;
      }


    if (deleteError) {
      setsubmitCretiraLoading(false);
      console.log(`Something Error: ${deleteError.message}`);
      return;
    }
    await fetchData();
    closeeditCourse();
    console.log("Edit Success");
    setsubmitCretiraLoading(false);
  }

  async function deleteCourses() {
    if (!selectedIDCriteria) return;
    setDeleteCriteriaLoading(true);
    const { error: deleteError } = await supabase
      .from("Course")
      .delete()
      .eq("id", selectedIDCriteria);
      const { error: deletehistory } = await supabase
      .from("history")
      .insert({
        transaction: "Delete Course",
        Account: account?.Email,
        created_at: new Date(),
      });
      if (deletehistory) {
        console.log(`Something Error: ${deletehistory.message}`);
        return;
      }

    if (deleteError) {
      setDeleteCriteriaLoading(false);
      console.log(`Something Error: ${deleteError.message}`);
      return;
    }
    await fetchData();
    closedeleteCourse();
    console.log("Delete Success");
    setDeleteCriteriaLoading(false);
  }

  async function deleteCriteria() {
    if (!selectedIDCriteria) return;
    setDeleteCriteriaLoading(true);
    const { error: deleteError } = await supabase
      .from("Criteria-Questioner")
      .delete()
      .eq("id", selectedIDCriteria);

      const { error: deletehistory } = await supabase
      .from("history")
      .insert({
        transaction: "Delete Criteria",
        Account: account?.Email,
        created_at: new Date(),
      });


      if (deletehistory) {
        console.log(`Something Error: ${deletehistory.message}`);
        return;
      }


    if (deleteError) {
      setDeleteCriteriaLoading(false);
      console.log(`Something Error: ${deleteError.message}`);
      return;
    }
    await fetchData();
    closeDeleteCriteriaState();
    console.log("Delete Success");
    setDeleteCriteriaLoading(false);
  }

  async function deleteEventHandler() {
    if (!selectedDeleteId) return;
    setDeleteLoading(true);
    const { error: deleteError } = await supabase
      .from("Questioner")
      .delete()
      .eq("id", selectedDeleteId);

      const { error: deletehistory } = await supabase
      .from("history")
      .insert({
        transaction: "Delete Criteria Question",
        Account: account?.Email,
        created_at: new Date(),
      });


      if (deletehistory) {
        console.log(`Something Error: ${deletehistory.message}`);
        return;
      }


    
    if (deleteError) {
      setDeleteLoading(false);
      console.log(`Something Error: ${deleteError.message}`);
      return;
    }
    await fetchData();
    closeDeleteEvaluationState();
    console.log("Delete Success");
    setDeleteLoading(false);
  }

  async function deleteFeedbackEventHandler() {
    if (!selectedFeedbackDeleteId) return;
    setDeleteFeedbackLoading(true);
    const { error: deleteError } = await supabase
      .from("Feedback-Question")
      .delete()
      .eq("id", selectedFeedbackDeleteId);

      const { error: deletehistory } = await supabase
      .from("history")
      .insert({
        transaction: "Delete Feedback Question",
        Account: account?.Email,
        created_at: new Date(),
      });


        if (deletehistory) {
        console.log(`Something Error: ${deletehistory.message}`);
        return;
      }


    if (deleteError) {
      setDeleteFeedbackLoading(false);
      console.log(`Something Error: ${deleteError.message}`);
      return;
    }
    await fetchData();
    closeDeleteFeedbackState();
    console.log("Delete Success");
    setDeleteFeedbackLoading(false);
  }

  async function fetchData() {
    const questionData = (await supabase.from("Questioner").select()).data;
    const feedbackData = (await supabase.from("Feedback-Question").select()).data;
    const CriteriaData = (await supabase.from("Criteria-Questioner").select()).data;
    const courselist = (await supabase.from("Course").select()).data;
    setlistcourses(courselist);
    setQuestions(questionData);
    setFeedbacks(feedbackData);
    setCriteriaQ(CriteriaData)
    setLoadingPage(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      title='Maintenance'
      outsideChildren={
        <LoadingOverlay
          loaderProps={{ type: "dots" }}
          visible={loadingPage}
        />
      }
    >
      {/* Delete Question */}
      <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Delete Question</span>}
        opened={deleteEvaluationState}
        onClose={() => {
          closeDeleteEvaluationState();
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <div className='Response'></div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button onClick={closeDeleteEvaluationState}>NO</Button>
          <Button
            onClick={deleteEventHandler}
            loading={deleteLoading}
          >
            Yes
          </Button>
        </div>
      </Modal>

        {/* AddQuestion*/}
      <Modal
        radius={20}
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Add Question</span>}
        centered='true'
        opened={evaluationState}
        onClose={() => {
          closeEvaluationState();
          // setIsModalOpen(false);
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <form onSubmit={evaluationForm.onSubmit(submitEvaluationEvent)}>
          <div className='Response'>
            <TextInput
              required
              id='AddQuestion'
              {...evaluationForm.getInputProps("question")}
              radius='md'
              placeholder='Enter Question'
            />
          </div>
          <Button
            loading={submitEvaluationLoading}
            className='Button-done'
            type='submit'
            style={{ width: "fit-content" }}
          >
            Add
          </Button>
        </form>
      </Modal>

        {/*Criteria Edit*/}
      <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Edit Criteria</span>}
        opened={EditCriteria}
        onClose={() => {
          closeEditCriteria();
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
      
          <div className='Response'>
          <TextInput
              required
              maxLength={1}
              id='Addlabel'
              onChange={(e) => {
                setlabeladd(e.target.value.toUpperCase())
              }}
              styles={{
                   input: {
                       textTransform: 'uppercase'
                     }}}
              radius='md'        
              placeholder={CriteriaQ.filter((v) => v.id === selectedIDCriteria).map((c) =>{
                 return c.label;
              })}
            />
        
            <TextInput
              required
              id='AddQuestion'
              onChange={(e) => {
                setCriteriaT(e.target.value)
              }}
              radius='md'        
              placeholder={CriteriaQ.filter((v) => v.id === selectedIDCriteria).map((c) =>{
                 return c.CQuestion;
              })}
            />
            
          </div>
          <Button
            loading={submitCretiraLoading}
            className='Button-done'
            style={{ width: "fit-content" }}
            onClick={SubmitCriteriaEdit}
          >
            Save
          </Button>
     
      </Modal>

        {/*Add Criteria */}
      <Modal
        title={<span style={{ color: "white" , paddingLeft: '165px' }}>Add Criteria</span>}
        radius={20}
        centered='true'
        opened={CriteriaAdd}
        onClose={() => {
          closeCriteriaAdd();
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <form onSubmit={CriteriaForm.onSubmit(submitCriteriaAdd)}>
          <div className='Response'>
          <TextInput
              required
              id='Addlabel'
              {...CriteriaForm.getInputProps("label")}
              radius='md'
              placeholder='e.g A-Z'
              maxLength={1}
              styles={{
                 input: {
                  textTransform: 'uppercase'
                       }
              }}
            />
            <TextInput
              required
              id='AddQuestion'
              {...CriteriaForm.getInputProps("Criterias")}
              radius='md'
              placeholder='Enter Criteria Questioner'
            />
            
          </div>
          <Button
            loading={submitCretiraLoading}
            className='Button-done'
            type='submit'
            style={{ width: "fit-content" }}
          >
            Add
          </Button>
        </form>
      </Modal>
      
      {/* Delete Criteria */}
      <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Delete Criteria</span>}
        opened={deleteCriteriaState}
        onClose={() => {
          closeDeleteCriteriaState();
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <div className='Response'></div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button onClick={closeDeleteCriteriaState}>NO</Button>
          <Button
            onClick={deleteCriteria}
            loading={deleteCriteriaLoading}
          >
            Yes
          </Button>
        </div>
      </Modal>

      {/* add Feedback */}
      <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Add Feedback</span>}
        opened={feedbackState}
        onClose={() => {
          closeFeedbackState();
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <form onSubmit={feedbackForm.onSubmit(submitFeedbackEvent)}>
          <div className='Response'>
            <TextInput
              required
              id='AddQuestion'
              {...feedbackForm.getInputProps("feedback")}
              radius='md'
              placeholder='Enter Feedback'
            />
          </div>
          <Button
            loading={submitFeedbackLoading}
            className='Button-done'
            type='submit'
            style={{ width: "fit-content" }}
          >
            Add
          </Button>
        </form>
      </Modal>

      {/* delete feedback */}
      <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Delete Feedback</span>}
        opened={deleteFeedbackState}
        onClose={() => {
          closeDeleteFeedbackState();
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <div className='Response'></div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button onClick={closeDeleteFeedbackState}>NO</Button>
          <Button
            onClick={deleteFeedbackEventHandler}
            loading={deleteFeedbackLoading}
          >
            Yes
          </Button>
        </div>
      </Modal>

      {/*Edit Course*/}
      <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Edit Course</span>}
        opened={editCourse}
        onClose={() => {
          closeeditCourse();
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
      
          <div className='Response'>
            <TextInput
              required
              id='AddCourse'
              onChange={(e) => {
                setCriteriaT(e.target.value)
              }}
              radius='md'        
              placeholder={listcourses.filter((v) => v.id === selectedIDCriteria).map((c) =>{
                 return c.Course;
              })}
            />
            
          </div>
          <Button
            loading={submitCretiraLoading}
            className='Button-done'
            style={{ width: "fit-content" }}
            onClick={SubmiteditCourse}
          >
            Save
          </Button>
     
      </Modal>

      {/* Delete Course */}
      <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Delete Course</span>}
        opened={deleteCourse}
        onClose={() => {
          closedeleteCourse();
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <div className='Response'></div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button onClick={closedeleteCourse}>NO</Button>
          <Button
            onClick={deleteCourses}
            loading={deleteCriteriaLoading}
          >
            Yes
          </Button>
        </div>
      </Modal>

        {/*Add Course */}
        <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Add Course</span>}
        opened={CourseAdd}
        onClose={() => {
          closeCourseAdd();
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <form onSubmit={CourseForm.onSubmit(submitCourseAdd)}>
          <div className='Response'>
    
            <TextInput
              required
              id='AddQuestion'
              {...CourseForm.getInputProps("Course")}
              radius='md'
              placeholder='Enter Course'
            />
            
          </div>
          <Button
            loading={submitCretiraLoading}
            className='Button-done'
            type='submit'
            style={{ width: "fit-content" }}
          >
            Add
          </Button>
        </form>
      </Modal>


      {CriteriaQ.sort((a, b) => a.label.localeCompare(b.label)).map((data, i) => {
        const items = questions.filter((v) => v.Criteria === data.label);

        return (
          <div
            key={i}
            style={{
              border: "2px solid black",
              padding: 20,
              marginBottom: 50,
            }}
          >
            <Text
              ta='center'
              fw='bold'
              size='xl'
            >
              Criteria Question
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                fw='bold'
                size='lg'
              >
                {data.label}. {data.CQuestion}
              </Text>
              <Button
                size='xs'
                leftSection={<IconPlus size={18} />}
                onClick={() => {
                  evaluationForm.setValues({
                    criteria: data.label,
                    question: "",
                  });
                  openEvaluationState();
                }}
              >
                Add {data.CQuestion}
              </Button>
            </div>
            <div style={{ marginTop: 10 }}>
              {items.map((item, ii) => {
                return (
                  <div
                    key={ii}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid #0005",
                      padding: 10,
                      marginBottom: 5,
                    }}
                  >
                    <Text size='lg'>
                      {ii + 1}. {item.Question}
                    </Text>
                    <ActionIcon
                      onClick={() => {
                        setSelectedDeleteId(item.id);
                        openDeleteEvaluationState();
                      }}
                      color='red'
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

        {/*Feed Back*/}
      <div
        style={{
          border: "2px solid black",
          padding: 20,
          marginBottom: 50,
        }}
      >
        <Text
          ta='center'
          fw='bold'
          size='xl'
        >
          Additional Feedback
        </Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            fw='bold'
            size='lg'
          >
            Feedback
          </Text>
          <Button
            size='xs'
            leftSection={<IconPlus size={18} />}
            onClick={() => {
              feedbackForm.setValues({
                feedback: "",
              });
              openFeedbackState();
            }}
          >
            Add Feedback
          </Button>
        </div>
        <div style={{ marginTop: 10 }}>
          {feedbacks.map((feed, ii) => {
            return (
              <div
                key={ii}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #0005",
                  padding: 10,
                  marginBottom: 5,
                }}
              >
                <Text size='md'>
                  {ii + 1}. {feed.QuestionFeedback}
                </Text>
                <ActionIcon
                  onClick={() => {
                    setSelectedFeedbackDeleteId(feed.id);
                    openDeleteFeedbackState();
                  }}
                  color='red'
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </div>
            );
          })}
        </div>
      </div>

          {/*Criteria*/}
      <div
        style={{
          border: "2px solid black",
          padding: 20,
          marginBottom: 50,
        }}
      >
        <Text
          ta='center'
          fw='bold'
          size='xl'
        >
          Criteria
        </Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            fw='bold'
            size='lg'
          >
            Questioner
          </Text>
          <Button
            size='xs'
            leftSection={<IconPlus size={18} />}
            onClick={() => {
              CriteriaForm.setValues({
                Criterias: "",
                label: "",
              });
              openCriteriaAdd();
            }}
          >
            Add Criteria
          </Button>

        </div>
        <div style={{ marginTop: 10 }}>
          {CriteriaQ.sort((a , b) => a.label.localeCompare(b.label)).map((CQ, ii) => {
            return (
              <div
                key={ii}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #0005",
                  padding: 10,
                  marginBottom: 5,
                }}
              >
                <Text size='md'>
                  {CQ.label}. {CQ.CQuestion}
                </Text>
                <div style={{display: 'flex' , justifyContent: 'flex-end' , gap: '20px'}}>
                <ActionIcon
                  onClick={() => {
                    setselectedIDCriteria(CQ.id);
                    openEditCriteria();
                  }}
                  color='blue'
                >
                  <IconEdit size={18} />
                </ActionIcon>
                
                <ActionIcon
                  onClick={() => {
                    setselectedIDCriteria(CQ.id);
                    openDeleteCriteriaState();
                  }}
                  color='red'
                >
                  <IconTrash size={18} />
                </ActionIcon>
                </div>
              </div>
            );
          })}
        </div>
      </div>

          {/*Course*/}
          <div
        style={{
          border: "2px solid black",
          padding: 20,
          marginBottom: 50,
        }}
      >
        <Text
          ta='center'
          fw='bold'
          size='xl'
        >
          Course List
        </Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            fw='bold'
            size='lg'
          >
            Course
          </Text>
          <Button
            size='xs'
            leftSection={<IconPlus size={18} />}
            onClick={() => {
              CourseForm.setValues({
                Course: "",
              });
              openCourseAdd();
            }}
          >
            Add Course
          </Button>

        </div>
        <div style={{ marginTop: 10 }}>
          {listcourses.sort((a , b) => a.Course.localeCompare(b.Course)).map((CQ, ii) => {
            return (
              <div
                key={ii}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #0005",
                  padding: 10,
                  marginBottom: 5,
                }}
              >
                <Text size='md'>
                  {ii+1}. {CQ.Course}
                </Text>
                <div style={{display: 'flex' , justifyContent: 'flex-end' , gap: '20px'}}>
                <ActionIcon
                  onClick={() => {
                    setselectedIDCriteria(CQ.id);
                    openeditCourse();
                  }}
                  color='blue'
                >
                  <IconEdit size={18} />
                </ActionIcon>
                
                <ActionIcon
                  onClick={() => {
                    setselectedIDCriteria(CQ.id);
                    opendeleteCourse();
                  }}
                  color='red'
                >
                  <IconTrash size={18} />
                </ActionIcon>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}

export default Maintenance;
