import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

const initialQuestions = [
  "Is personal data being collected?",
  "Is any special category data involved?",
  "Is the data being shared externally?"
];

const secondQuestions = [
  "Is the data anonymised before analysis?",
  "Will data be transferred outside the UK?",
  "Is there a data retention policy in place?"
];

export default function DPIAForm() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [nextStep, setNextStep] = useState(false);
  const [secondAnswers, setSecondAnswers] = useState({});
  const [exportReady, setExportReady] = useState(false);

  const handleAnswer = (index, value, setFn, state) => {
    setFn({ ...state, [index]: value });
  };

  const allAnswered = (questions, state) => {
    return questions.every((_, i) => state[i] !== undefined);
  };

  const yesCount = Object.values(answers).filter((a) => a === "yes").length;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("DPIA Questionnaire Answers", 10, 10);
    let y = 20;
    initialQuestions.forEach((q, i) => {
      doc.text(`${q}: ${answers[i]}`, 10, y);
      y += 10;
    });
    if (nextStep) {
      secondQuestions.forEach((q, i) => {
        doc.text(`${q}: ${secondAnswers[i]}`, 10, y);
        y += 10;
      });
    }
    doc.save("DPIA_Answers.pdf");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {!showResult && (
        <div>
          <h2 className="text-xl font-bold mb-4">Initial Questions</h2>
          {initialQuestions.map((q, i) => (
            <div key={i} className="mb-4">
              <p>{q}</p>
              <Button
                className="mr-2"
                variant={answers[i] === "yes" ? "default" : "outline"}
                onClick={() => handleAnswer(i, "yes", setAnswers, answers)}
              >
                Yes
              </Button>
              <Button
                variant={answers[i] === "no" ? "default" : "outline"}
                onClick={() => handleAnswer(i, "no", setAnswers, answers)}
              >
                No
              </Button>
            </div>
          ))}
          {allAnswered(initialQuestions, answers) && (
            <Button className="mt-4" onClick={() => setShowResult(true)}>
              Submit
            </Button>
          )}
        </div>
      )}

      {showResult && !nextStep && (
        <div className="mt-6">
          <p className="text-lg">
            {yesCount > 1
              ? "You need to create a DPIA."
              : "You don’t need to create a DPIA."}
          </p>
          {yesCount > 1 && (
            <Button className="mt-4" onClick={() => setNextStep(true)}>
              Continue to DPIA Questions
            </Button>
          )}
        </div>
      )}

      {nextStep && !exportReady && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">DPIA Questions</h2>
          {secondQuestions.map((q, i) => (
            <div key={i} className="mb-4">
              <p>{q}</p>
              <Button
                className="mr-2"
                variant={secondAnswers[i] === "yes" ? "default" : "outline"}
                onClick={() => handleAnswer(i, "yes", setSecondAnswers, secondAnswers)}
              >
                Yes
              </Button>
              <Button
                variant={secondAnswers[i] === "no" ? "default" : "outline"}
                onClick={() => handleAnswer(i, "no", setSecondAnswers, secondAnswers)}
              >
                No
              </Button>
            </div>
          ))}
          {allAnswered(secondQuestions, secondAnswers) && (
            <Button className="mt-4" onClick={() => setExportReady(true)}>
              Complete DPIA
            </Button>
          )}
        </div>
      )}

      {exportReady && (
        <div className="mt-6">
          <p className="mb-4">You have completed all DPIA questions.</p>
          <Button onClick={generatePDF}>Export as PDF</Button>
        </div>
      )}
    </div>
  );
}
