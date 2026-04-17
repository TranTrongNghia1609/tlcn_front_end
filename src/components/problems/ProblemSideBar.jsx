import UpcomingContests from "@/components/home/SidebarComponent/UpcomingContests";
import ProblemFilter from "./ProblemFilter";

const ProblemSideBar = ({ filters, onFilterChange }) => {
  return (
    <div className="space-y-6">
      <ProblemFilter filters={filters} onFilterChange={onFilterChange} />
      <UpcomingContests />
    </div>
  );
};

export default ProblemSideBar;