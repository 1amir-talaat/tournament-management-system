/* eslint-disable react/no-unescaped-entities */
import { Card, CardHeader, CardBody, Flex, Heading, Text, CardFooter, Input, FormControl } from "@chakra-ui/react";
import { HiMiniUserGroup } from "react-icons/hi2";
import { MdPerson } from "react-icons/md";
import useAuth from "../hook/useAuth";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Spinner, Divider, Badge } from "@chakra-ui/react";
import { Button } from "./ui/button";
import { Step, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps, Box } from "@chakra-ui/react";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import PropTypes from "prop-types";

const Events = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5002/event/all", {
          method: "GET",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          toast.error("Network response was not ok");
        }

        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchEvents();
  }, [token]);

  return (
    <>
      {loading ? (
        <div style={{ height: "86vh" }} className="w-full flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Toaster position="bottom-right" reverseOrder={false} />
          {events.length > 0 ? (
            <Flex flexWrap={"wrap"} gap={7} margin={"auto"}>
              {events.map((event) => (
                <Card key={event.id} maxW={"25%"}>
                  <CardHeader pb={3}>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                      {user && user.isTeam ? <HiMiniUserGroup size={50} /> : <MdPerson size={50} />}
                      <Heading size="md">{event.eventType} Event</Heading>
                      <div className="flex items-center "></div>
                    </Flex>
                  </CardHeader>
                  <Divider borderColor={"#e7e7e7"} />
                  <CardBody pt={3}>
                    <Text mb={1} fontSize="22px">
                      {event.name}
                    </Text>
                    <Text fontSize="lg">
                      has
                      <Badge mx={1} rounded="full" ml="1" size={"lg"} fontSize="1em" colorScheme="green">
                        {event.numParticipations}
                      </Badge>
                      participants
                    </Text>
                  </CardBody>
                  <CardFooter pt={0}>
                    <Questions questions={event.questions} eventId={event.id}>
                      <DialogTrigger asChild>
                        <Button variant="blue">Join Event</Button>
                      </DialogTrigger>
                    </Questions>
                  </CardFooter>
                </Card>
              ))}
            </Flex>
          ) : (
            <div style={{ height: "calc(100vh - 120px)" }} className="w-full flex justify-center items-center">
              <Heading size={"xl"}>No events found</Heading>
            </div>
          )}
        </>
      )}
    </>
  );
};

function Questions({ questions, eventId, children }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: questions.length,
  });
  const [answer, setAnswer] = useState("");
  const [answerError, setAnswerError] = useState("");
  const answers = useRef([]);
  const { token, refreshToken, logout } = useAuth();

  const handleInputChange = (event) => {
    setAnswer(event.target.value);
    setAnswerError("");
  };

  const handleNext = () => {
    if (!answer) {
      setAnswerError("Answer is required");
      return;
    }

    let questionId = questions[activeStep].id;
    answers.current.push({ id: questionId, answer: answer });
    setAnswer("");
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = async () => {
    if (!answer) {
      setAnswerError("Answer is required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5002/participation/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          eventId,
          answers: answers.current,
        }),
      });

      try {
        await refreshToken();
      } catch (error) {
        toast.error(error.message);
        logout();
        return;
      }

      let error = false;

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error);
        error = true;
      }

      setLoading(false);
      setAnswer("");
      setOpen(false);
      if (!error) {
        toast.success("Successfully participated in event");
      }
      setActiveStep(0);
    } catch (error) {
      toast.error("Error participating in event", error.massage);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
        <DialogContent className="max-w-[93%]">
          <Box className="mb-5">
            <Stepper size="lg" pe={3} index={activeStep}>
              {questions.map((question, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle>Question {index + 1}</StepTitle>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>
          <Text className="text-2xl mt-2">
            Question
            <Badge style={{ padding: "0 7px" }} px={1} rounded="full" ml="1" size={"lg"} fontSize="1em" colorScheme="green">
              {activeStep + 1}
            </Badge>{" "}
            : {questions[activeStep].text}
          </Text>
          <div className="flex gap-3">
            <Label htmlFor="answer" className="text-right text-lg pt-1">
              Answer
            </Label>
            <FormControl id="text" isInvalid={!!answerError}>
              <Input autoFocus type="text" value={answer} onChange={handleInputChange} />
              <Box color="red" fontSize="sm">
                {answerError}
              </Box>
            </FormControl>
          </div>
          <DialogFooter>
            {activeStep < questions.length - 1 ? (
              <Button variant="blue" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="blue" onClick={handleSubmit}>
                {loading ? <Spinner /> : "Submit"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

Questions.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  children: PropTypes.node,
};

export default Events;
