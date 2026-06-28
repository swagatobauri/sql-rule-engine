import PracticeProvider from "@/components/practice/PracticeProvider";
import SessionTopBar from "@/components/practice/SessionTopBar";
import PromptPanel from "@/components/practice/PromptPanel";
import SqlEditor from "@/components/practice/SqlEditor";
import TimerCard from "@/components/practice/TimerCard";
import EvaluationCard from "@/components/practice/EvaluationCard";
import AnswerForm from "@/components/practice/AnswerForm";

export default function PracticeSessionPage() {
  return (
    <PracticeProvider>
      <div className="min-h-screen flex flex-col bg-[#F3F4F7] mx-auto w-full max-w-[1280px]">
        <SessionTopBar />

        <main className="flex-1 p-4">
          <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr_320px] gap-4 items-start">
            <PromptPanel />
            <SqlEditor />
            <div className="space-y-4">
              <TimerCard />
              <EvaluationCard />
              <AnswerForm />
            </div>
          </div>
        </main>
      </div>
    </PracticeProvider>
  );
}
