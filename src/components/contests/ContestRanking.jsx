import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Trophy, User, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
const getRankStyle = (index) => {
  switch (index) {
    case 0: // Top 1
      return {
        icon: <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500 animate-pulse" />,
        rowClass: "bg-purple-50/40 border-l-4 border-l-yellow-400",
        rankClass: "text-yellow-600 font-extrabold text-xl",
      };
    case 1: // Top 2
      return {
        icon: <Medal className="h-5 w-5 text-slate-400 fill-slate-200" />,
        rowClass: "bg-slate-50/50 border-l-4 border-l-slate-300",
        rankClass: "text-slate-500 font-bold text-lg",
      };
    case 2: // Top 3
      return {
        icon: <Medal className="h-5 w-5 text-amber-600 fill-amber-100" />,
        rowClass: "bg-orange-50/30 border-l-4 border-l-amber-600",
        rankClass: "text-amber-700 font-bold text-lg",
      };
    default: // Các thứ hạng còn lại
      return {
        icon: <span className="font-mono font-medium text-muted-foreground">#{index + 1}</span>,
        rowClass: "hover:bg-purple-50/30 border-l-4 border-l-transparent",
        rankClass: "text-muted-foreground",
      };
  }
};

function RankingContest({ leaderboard = [], problems = [], contestCode, onProblemClick }) {
  const navigate = useNavigate();
  console.log('RankingContest leaderboard:', leaderboard);

  // Format ngày giờ
  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Helper: Tìm điểm của user cho 1 bài cụ thể
  const getProblemData = (userEntry, problemId) => {
    return userEntry.problemScores?.find((p) => p.problemId === problemId);
  };

  // Helper: Format điểm số cho gọn (vd: 30.769... -> 30.77)
  const formatScore = (score) => {
    if (score === undefined || score === null) return 0;
    return Number.isInteger(score) ? score : score.toFixed(2);
  };

  const handleProblemClick = (e, contestCode, problemShortId) => {
    navigate(`/contest/${contestCode}/problem/${problemShortId}`);
    if (onProblemClick) {
      onProblemClick();
    }
  };

  return (
    <div className="p-2 h-full min-h-0 overflow-hidden">

      <Card className="w-full shadow-md border-border overflow-hidden">
        {/* Header với Gradient hồng tím */}
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-clip-text text-black">
                  Bảng Xếp Hạng
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Cập nhật theo thời gian thực
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-auto">
          {/* Wrapper div để table có thể scroll ngang trên màn hình nhỏ */}
          <div className="min-w-[800px]"> 
            <Table>
              <TableHeader className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent border-b border-gray-200 shadow-sm">
                  <TableHead className="w-[70px] text-center font-bold text-black">Rank</TableHead>
                  <TableHead className="min-w-[200px] font-bold text-black">Contestant</TableHead>
                  
                  {/* Render Dynamic Problem Columns */}
                  {problems.map((prob, index) => (
                    <TableHead key={prob._id || index} 
                      className="text-center font-bold text-purple-900/60 min-w-[80px]"
                      >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-xs cursor-pointer text-black px-2 py-1 rounded hover:bg-purple-200 hover:text-purple-700 transition-colors"
                              onClick={(e) => handleProblemClick(e, contestCode, prob.shortId)}>
                              {prob.shortId || String.fromCharCode(65 + index)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{prob.name || "Problem Name"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold text-pink-600 w-[100px]">Total</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {leaderboard.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3 + problems.length} className="h-32 text-center text-muted-foreground">
                        Chưa có dữ liệu xếp hạng
                    </TableCell>
                  </TableRow>
                ) : (
                  leaderboard.map((entry, index) => {
                    const { icon, rowClass, rankClass } = getRankStyle(index);
                    
                    return (
                      <TableRow key={entry.id} className={cn("transition-colors", rowClass)}>
                        {/* Rank */}
                        <TableCell className="text-center py-3">
                          <div className={cn("flex justify-center items-center", rankClass)}>
                            {icon}
                          </div>
                        </TableCell>

                        {/* User Info */}
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                              <AvatarImage src={entry.user.avatar} alt={entry.user.userName} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-xs">
                                {entry.user.fullName?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className={cn("font-semibold text-sm", index === 0 ? "text-purple-900" : "text-gray-700")}>
                                {entry.user.fullName}
                              </span>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                @{entry.user.userName}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Dynamic Problem Scores */}
                        {problems.map((prob) => {
                          const pData = getProblemData(entry, prob._id);
                          const score = pData ? pData.bestScore : 0;
                          const isSolved = score > 0; // Logic đơn giản: > 0 là có làm
                          const isMaxScore = score === prob.point; // Nếu bạn có thông tin max point

                          return (
                            <TableCell key={prob._id} className="text-center py-3 border-l border-dashed border-gray-100">
                              <div className="flex flex-col items-center">
                                <span className={cn(
                                  "font-mono font-bold text-sm transition-all",
                                  isSolved ? "text-purple-600" : "text-gray-300",
                                  isMaxScore && "text-green-600 scale-110" // Nếu max điểm thì màu xanh
                                )}>
                                  {isSolved ? formatScore(score) : "-"}
                                </span>
                                
                                {/* Hiển thị số lần thử (Attempts) nếu có */}
                                {isSolved && pData.attempts > 0 && (
                                  <span className="text-[10px] text-muted-foreground mt-0.5 bg-gray-100 px-1.5 rounded-full">
                                    {pData.attempts} try
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          );
                        })}

                        {/* Total Score */}
                        <TableCell className="text-center py-3">
                          <div className="flex flex-col items-center justify-center">
                              <span className="font-black text-base text-green-600">
                                  {formatScore(entry.score)}
                              </span>
                              {index === 0 && <Trophy className="h-3 w-3 text-yellow-500 mt-0.5" />}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RankingContest;