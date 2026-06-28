import PracticeStatsCard from "./PracticeStatsCard";
import SolvedExamplesCard from "./SolvedExamplesCard";
import LiveInterviewCard from "./LiveInterviewCard";

export default function Sidebar() {
  return (
    <aside className="space-y-5">
      <PracticeStatsCard />
      <SolvedExamplesCard />
      <LiveInterviewCard />
    </aside>
  );
}
