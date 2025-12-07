import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CheckCircle2, 
  Lock, 
  Megaphone, 
  Clock, 
  Trophy, 
  ArrowRight 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { contestStore } from "@/zustand/contestStore";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils"; // Đảm bảo bạn có hàm cn để merge class2

function ProblemContestList({ isStarted = false, onProblemClick, problems = null, announcements, currentProblemId = null }) {
  
  const ProblemListSkeleton = () => (
    <div className="w-full space-y-4">
       {/* Skeleton Header */}
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Card className="border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Problem Name</TableHead>
              <TableHead className="w-[100px]">Points</TableHead>
              <TableHead className="text-right">Solved</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                <TableCell className="flex justify-end"><Skeleton className="h-4 w-10" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  if (!problems) return <ProblemListSkeleton />;

  const { code } = useParams();
  const navigate = useNavigate();
  const contest = contestStore((state) => state.contest);

  const handleRowClick = (problemShortId) => {
    if (!isStarted) return;
    
    if (contest.userParticipation?.isStarted) {
      navigate(`/contest/${code}/problem/${problemShortId}`);
    } else {
      navigate(`/problemset/problem/${problemShortId}`);
    }

    if (onProblemClick) onProblemClick();
  };
  const checkingLocked = () => {
    if (!isStarted) return true;
    return contest.userParticipation?.id === null;
  }
  const isLocked = checkingLocked();
  const problemListSection = () => {
    return (
      <div className="p-2">
        <Card className="shadow-sm border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-muted/40 border-b border-border">
                <TableHead className="w-[90px] font-bold text-foreground/70">ID</TableHead>
                <TableHead className="font-bold text-foreground/70">Challenge</TableHead>
                <TableHead className="font-bold text-foreground/70">Points</TableHead>
                <TableHead className="text-right font-bold text-foreground/70 w-[160px]">
                  <div className="flex items-center justify-end gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Solved</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((problem, index) => {
                const isHighlighted = !isLocked && currentProblemId && problem.shortId === currentProblemId;
                
                return (
                  <TableRow
                  key={problem.shortId || index}
                  className={cn(
                  "group transition-all duration-200 border-border",
                  !isLocked && "cursor-pointer hover:bg-accent/50",
                  isLocked && "opacity-60 bg-muted/10 cursor-not-allowed",
                  isHighlighted && "bg-primary/10 border-l-4 border-l-primary"
                  )}
                  onClick={() => handleRowClick(problem.shortId)}
                  >
                  {/* Column: ID */}
                  <TableCell className="font-mono font-medium py-4">
                  <div className="flex items-center gap-2">
                  {isLocked ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Badge 
                    variant="outline" 
                    className={cn(
                    "font-mono font-bold bg-background text-foreground/80 h-7 min-w-[2.5rem] justify-center",
                    isHighlighted && "bg-primary text-primary-foreground border-primary"
                    )}
                    >
                    {problem.shortId || String.fromCharCode(65 + index)}
                    </Badge>
                  )}
                  </div>
                  </TableCell>

                  {/* Column: Name */}
                  <TableCell className="py-4">
                  <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className={cn(
                    "font-semibold text-base", 
                    isLocked && "blur-[3px] select-none",
                    isHighlighted && "text-primary"
                    )}>
                    {isLocked ? "Hidden Problem Name" : problem.name}
                    </span>
                    {isLocked && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Content locked
                    </span>
                    )}
                  </div>
                  
                  {/* Action Icon on Hover */}
                  {!isLocked && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-2" />
                  )}
                  </div>
                  </TableCell>

                  {/* Column: Points */}
                  <TableCell className="font-mono py-4">
                  {isLocked ? (
                  "---"
                  ) : (
                  <div className={cn(
                    "flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors",
                    isHighlighted && "text-primary"
                  )}>
                    <Trophy className="h-3.5 w-3.5" />
                    {problem.point}
                  </div>
                  )}
                  </TableCell>

                  {/* Column: Solved Count */}
                  <TableCell className="text-right font-mono py-4">
                  {isLocked ? (
                    "---"
                    ) : (
                    <div className="inline-flex flex-col items-end">
                      <span className={cn(
                        "font-medium text-foreground/80",
                        isHighlighted && "text-primary font-bold"
                        )}>
                        {problem.noOfSolved?.toLocaleString() || 0}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Users
                      </span>
                    </div>
                    )}
                    </TableCell>
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    )
  }
  const announcementSection = () => {
    if (announcements == null || announcements.length === 0) return null;
    return (
      <div className="p-2">
        <Card className="border-l-4 border-l-primaryshadow-sm overflow-hidden">
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Megaphone className="h-5 w-5" />
              <h3 className="font-bold text-base tracking-tight">Thông báo từ BTC</h3>
            </div>
            <div className="space-y-3 pl-1">
              {announcements.map((announcement, index) => (
                <div key={index} className="group relative pl-6 border-l border-border/60 pb-1 last:pb-0">
                  {/* Timeline dot */}
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground mb-1">
                    <span className="flex items-center gap-1 font-mono bg-background px-1.5 py-0.5 rounded border">
                      <Clock className="h-3 w-3" />
                      {new Date(announcement.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>{new Date(announcement.time).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {announcement.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

    )
  }
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Contest Announcements Section - Style lại mềm mại hơn */}
      {announcementSection()}

      {/* Problem List */}
      {problemListSection()}
    </div>
  );
}

export default ProblemContestList;