import UpcomingContests from "@/components/home/SidebarComponent/UpcomingContests";
import ProblemFilter from "./ProblemFilter";

const ProblemSideBar = ({ onFilterChange }) => {
  return (
    <div className="space-y-6">
      <ProblemFilter onFilterChange={onFilterChange} />
      <UpcomingContests />
    </div>
  );
};

export default ProblemSideBar;