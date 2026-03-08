import { useState } from "react";
import type { QuizQuestion } from "@/lib/learning-api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";

interface Props {
  questions: QuizQuestion[];
  passingScore: number;
  onComplete: (score: number, passed: boolean, answers: number[]) => void;
}

export function QuizComponent({ questions, passingScore, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];
  const isCorrect = selected === question?.correct;

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setShowFeedback(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected!];
    setAnswers(newAnswers);
    setSelected(null);
    setShowFeedback(false);

    if (currentQ + 1 >= questions.length) {
      const correct = newAnswers.filter((a, i) => a === questions[i].correct).length;
      const score = Math.round((correct / questions.length) * 100);
      const passed = score >= passingScore;
      setFinished(true);
      onComplete(score, passed, newAnswers);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setShowFeedback(false);
    setFinished(false);
  };

  if (finished) {
    const correct = answers.filter((a, i) => a === questions[i].correct).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= passingScore;

    return (
      <div className="flex flex-col items-center py-8 text-center">
        {passed ? (
          <Trophy className="h-16 w-16 text-primary mb-4" />
        ) : (
          <XCircle className="h-16 w-16 text-destructive mb-4" />
        )}
        <h3 className="text-xl font-bold">
          {passed ? "Felicitări! 🎉" : "Mai încearcă!"}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Scor: <span className={cn("font-bold", passed ? "text-primary" : "text-destructive")}>{score}%</span> ({correct}/{questions.length} corecte)
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Necesar pentru promovare: {passingScore}%
        </p>
        {!passed && (
          <Button onClick={handleRetry} className="mt-4 gap-2">
            <RotateCcw className="h-4 w-4" />
            Încearcă din nou
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Întrebarea {currentQ + 1} din {questions.length}</span>
          <span>{Math.round(((currentQ) / questions.length) * 100)}% completat</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary">
          <div
            className="h-full rounded-full gradient-money transition-all duration-300"
            style={{ width: `${((currentQ) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h4 className="text-base font-semibold mb-4">{question.question}</h4>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, idx) => {
          let optionStyle = "border-border bg-card hover:bg-secondary/50";
          if (showFeedback) {
            if (idx === question.correct) optionStyle = "border-primary bg-primary/10";
            else if (idx === selected) optionStyle = "border-destructive bg-destructive/10";
          } else if (idx === selected) {
            optionStyle = "border-primary bg-primary/5";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={cn(
                "w-full rounded-lg border p-3 text-left text-sm transition-all flex items-center gap-3",
                optionStyle
              )}
            >
              <span className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                idx === selected && !showFeedback ? "border-primary text-primary" : "border-border text-muted-foreground",
                showFeedback && idx === question.correct && "border-primary bg-primary text-primary-foreground",
                showFeedback && idx === selected && idx !== question.correct && "border-destructive bg-destructive text-destructive-foreground"
              )}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
              {showFeedback && idx === question.correct && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
              {showFeedback && idx === selected && idx !== question.correct && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Action */}
      <div className="mt-6 flex justify-end">
        {!showFeedback ? (
          <Button onClick={handleConfirm} disabled={selected === null}>
            Confirmă răspunsul
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentQ + 1 >= questions.length ? "Vezi rezultatul" : "Următoarea întrebare"}
          </Button>
        )}
      </div>
    </div>
  );
}
