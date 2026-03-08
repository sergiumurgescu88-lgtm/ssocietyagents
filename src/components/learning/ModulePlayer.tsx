import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { LearningModuleDB, QuizDB, QuizQuestion } from "@/lib/learning-api";
import { fetchQuizForModule, updateModuleProgress, submitQuiz } from "@/lib/learning-api";
import { categoryMeta } from "@/lib/learning-api";
import { QuizComponent } from "@/components/learning/QuizComponent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft, ArrowRight, BookOpen, Clock, Zap, CheckCircle2,
  ListChecks, ExternalLink, GraduationCap, ChevronLeft,
} from "lucide-react";

interface Props {
  module: LearningModuleDB;
  userProgress: number;
  userStatus: string;
  onBack: () => void;
  onProgressUpdate: () => void;
}

type PlayerTab = "content" | "quiz" | "resources";

export function ModulePlayer({ module: mod, userProgress, userStatus, onBack, onProgressUpdate }: Props) {
  const { toast } = useToast();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [activeTab, setActiveTab] = useState<PlayerTab>("content");
  const [quiz, setQuiz] = useState<QuizDB | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);

  const lessons = (mod.content as any[]) || [];
  const cat = categoryMeta[mod.category] || { label: mod.category, color: "bg-secondary text-muted-foreground", icon: "📚" };

  useEffect(() => {
    fetchQuizForModule(mod.id).then(setQuiz).catch(() => {});
  }, [mod.id]);

  const progress = Math.round(((currentLesson + 1) / lessons.length) * 100);

  const handleLessonChange = async (idx: number) => {
    setCurrentLesson(idx);
    const newProgress = Math.round(((idx + 1) / lessons.length) * 100);
    try {
      await updateModuleProgress(mod.id, newProgress, newProgress >= 100 ? "completed" : "in_progress");
      onProgressUpdate();
    } catch {}
  };

  const handleQuizComplete = async (score: number, passed: boolean, answers: number[]) => {
    if (quiz) {
      try {
        await submitQuiz(quiz.id, answers, score, passed);
        if (passed) {
          setQuizPassed(true);
          await updateModuleProgress(mod.id, 100, "completed");
          onProgressUpdate();
          toast({ title: "Quiz promovat! 🎉", description: `Scor: ${score}% — Ai câștigat ${mod.xp_reward} XP!` });
        }
      } catch {}
    }
  };

  const lesson = lessons[currentLesson];

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 mt-0.5">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", cat.color)}>
              {cat.icon} {cat.label}
            </span>
            <Badge variant="secondary" className="text-[10px]">{mod.difficulty}</Badge>
          </div>
          <h1 className="text-xl font-bold">{mod.title}</h1>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{mod.estimated_minutes} min</span>
            <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{mod.xp_reward} XP</span>
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{lessons.length} lecții</span>
          </div>
        </div>
      </div>

      {/* Sticky progress */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-3 pt-1">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Lecția {currentLesson + 1} din {lessons.length}</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary">
          <div
            className="h-full rounded-full gradient-money transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-2">
        {(["content", "quiz", "resources"] as PlayerTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            {t === "content" ? "📖 Conținut" : t === "quiz" ? "📝 Quiz" : "🔗 Resurse"}
          </button>
        ))}
      </div>

      {/* Content tab */}
      {activeTab === "content" && lesson && (
        <div className="space-y-6">
          {/* Lesson navigation pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {lessons.map((l: any, i: number) => (
              <button
                key={i}
                onClick={() => handleLessonChange(i)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors border",
                  i === currentLesson
                    ? "border-primary bg-primary/10 text-primary"
                    : i <= currentLesson
                      ? "border-primary/30 text-primary/70"
                      : "border-border text-muted-foreground hover:bg-secondary"
                )}
              >
                {i < currentLesson && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                {l.title?.slice(0, 25) || `Lecția ${i + 1}`}
              </button>
            ))}
          </div>

          {/* Lesson content */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold mb-4">{lesson.title}</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{lesson.body || ""}</ReactMarkdown>
            </div>
          </div>

          {/* Key takeaways (show on last lesson) */}
          {currentLesson === lessons.length - 1 && mod.key_takeaways?.length > 0 && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Key Takeaways
              </h3>
              <ul className="space-y-2">
                {mod.key_takeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action items (show on last lesson) */}
          {currentLesson === lessons.length - 1 && mod.action_items?.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <ListChecks className="h-4 w-4 text-primary" />
                Action Items
              </h3>
              <ul className="space-y-2">
                {mod.action_items.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => handleLessonChange(currentLesson - 1)}
              disabled={currentLesson === 0}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>
            {currentLesson < lessons.length - 1 ? (
              <Button onClick={() => handleLessonChange(currentLesson + 1)} className="gap-1.5">
                Următor
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => setActiveTab("quiz")} className="gap-1.5">
                <GraduationCap className="h-4 w-4" />
                Dă Quiz-ul
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Quiz tab */}
      {activeTab === "quiz" && (
        <div className="rounded-xl border border-border bg-card p-6">
          {quiz ? (
            <>
              <h3 className="text-base font-semibold mb-1">Quiz: {mod.title}</h3>
              <p className="text-xs text-muted-foreground mb-6">
                {quiz.questions.length} întrebări · Scor minim: {quiz.passing_score}%
              </p>
              <QuizComponent
                questions={quiz.questions as QuizQuestion[]}
                passingScore={quiz.passing_score}
                onComplete={handleQuizComplete}
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nu există quiz disponibil pentru acest modul.
            </p>
          )}
        </div>
      )}

      {/* Resources tab */}
      {activeTab === "resources" && (
        <div className="space-y-4">
          {mod.resources && (mod.resources as any[]).length > 0 ? (
            (mod.resources as any[]).map((r: any, i: number) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-card-hover"
              >
                <ExternalLink className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-medium">{r.name}</span>
              </a>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Nicio resursă disponibilă.</p>
          )}
        </div>
      )}
    </div>
  );
}
