import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import supabase from "../supabase";
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
  ] = useDisclosure(false)
  const [
    deleteFeedbackState,
    { open: openDeleteFeedbackState, close: closeDeleteFeedbackState },
  ] = useDisclosure(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedFeedbackDeleteId, setSelectedFeedbackDeleteId] =
    useState(null);
  const [selectedIDCriteria, setselectedIDCriteria] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteFeedbackLoading, setDeleteFeedbackLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [submitFeedbackLoading, setSubmitFeedbackLoading] = useState(false);
  const [CriteriaQ , setCriteriaQ] = useState([]);
  const [submitCretiraLoading, setsubmitCretiraLoading] = useState(false);
  const [CriteriaT, setCriteriaT] = useState("")

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

 

  async function submitEvaluationEvent(evaluation) {
    try {
      setSubmitEvaluationLoading(true);

      const { error: insertError } = await supabase.from("Questioner").insert({
        Criteria: evaluation.criteria,
        Question: evaluation.question,
        created_at: new Date(),
      });

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

  async function SubmitCriteriaEdit() {
    if (!selectedIDCriteria) return;
    setsubmitCretiraLoading(true);
    const { error: deleteError } = await supabase
      .from("Criteria-Questioner")
      .update({
        CQuestion : CriteriaT
      })
      .eq("id", selectedIDCriteria);
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

  async function deleteEventHandler() {
    if (!selectedDeleteId) return;
    setDeleteLoading(true);
    const { error: deleteError } = await supabase
      .from("Questioner")
      .delete()
      .eq("id", selectedDeleteId);
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
      <Modal
        radius={20}
        centered='true'
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

      <Modal
        radius={20}
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
        {/*Criteria*/}
      <Modal
        radius={20}
        centered='true'
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

      {/* add Feedback */}
      <Modal
        radius={20}
        centered='true'
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

      {staticData.map((data, i) => {
        const items = questions.filter((v) => v.Criteria === data.key);

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
              Training Evaluation
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
                {data.key}. {data.description}
              </Text>
              <Button
                size='xs'
                leftSection={<IconPlus size={18} />}
                onClick={() => {
                  evaluationForm.setValues({
                    criteria: data.key,
                    question: "",
                  });
                  openEvaluationState();
                }}
              >
                Add {data.description}
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
          Criteria Questioner
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

        </div>
        <div style={{ marginTop: 10 }}>
          {CriteriaQ.map((CQ, ii) => {
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
                <ActionIcon
                  onClick={() => {
                    setselectedIDCriteria(CQ.id);
                    openEditCriteria();
                  }}
                  color='blue'
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}

export default Maintenance;
