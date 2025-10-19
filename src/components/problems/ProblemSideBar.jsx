import UpcomingContests from "@/components/home/SidebarComponent/UpcomingContests";
import ProblemFilter from "./ProblemFilter";

const ProblemSideBar = () => {
  return (
    <div className="space-y-6">
      <ProblemFilter />
      {/* Upcoming Contests Component */}
      <UpcomingContests />
    </div>
  );
}

export default ProblemSideBar
