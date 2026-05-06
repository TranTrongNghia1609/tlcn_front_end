import UpcomingContests from "@/components/home/SidebarComponent/UpcomingContests";
import ProblemFilter from "./ProblemFilter";
import RecommendedProblems from "@/components/features/recommendation/RecommendedProblems";

const ProblemSideBar = ({ filters, onFilterChange }) => {
  return (
    <div className="space-y-6">
      <ProblemFilter filters={filters} onFilterChange={onFilterChange} />
      <RecommendedProblems />
      <UpcomingContests />
    </div>
  );
};

export default ProblemSideBar;