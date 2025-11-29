import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"
import { useState } from "react";
import ProblemContestList from "./ContestProblemList";
import { contestStore } from "@/zustand/contestStore";

export default function ContestContent() {
  const [isOpen, setIsOpen] = useState(true);
  const contest = contestStore((state) => state.contest)
  const problems = contestStore((state) => state.contestProblems)

  const checkStarted = () => {
    const now = new Date()
    const startTime = new Date(contest.startTime)
    return now >= startTime
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Chào mừng bạn đến với {contest.title}</h2>
        <p className="text-foreground/80 leading-relaxed">
          {contest.description}
        </p>
      </div>
      <ProblemContestList 
      isStarted={checkStarted()}
      problems={problems} />
    </div>
  )
}
