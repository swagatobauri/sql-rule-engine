import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureBar from "@/components/FeatureBar";
import QuestionExplorer from "@/components/QuestionExplorer";
import Sidebar from "@/components/sidebar/Sidebar";
import BottomBanner from "@/components/BottomBanner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col mx-auto w-full max-w-[1280px]">
      <Navbar />

      <main className="flex-1">
        <div className="px-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7 pb-10">
          {/* Primary column */}
          <div>
            <Hero />
            <FeatureBar />
            <QuestionExplorer />
          </div>

          {/* Right rail */}
          <div className="lg:pt-9">
            <Sidebar />
          </div>
        </div>
      </main>

      <BottomBanner />
    </div>
  );
}
