import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProblems } from "@/services/problemService";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const getDifficultyVariant = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "easy";
    case "Medium":
      return "medium";
    case "Hard":
      return "hard";
    default:
      return "default";
  }
};

const ProblemList = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await getProblems();
        setProblems(response.data.content);
        console.log('Fetched problems:', response.data.content);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    }
    fetchProblems();
  }, []);

  return (
    <div className="w-full">
      <Card className="border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-[100px] font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Problem</TableHead>
              <TableHead className="font-semibold">Difficulty</TableHead>
              <TableHead className="font-semibold">Tags</TableHead>
              <TableHead className="text-right font-semibold w-[140px]">
                <div className="flex items-center justify-end gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Solved
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow
                key={problem.shortId}
                className="cursor-pointer hover:bg-muted/50 transition-colors border-border"
                onClick={() => navigate(`problem/${problem.shortId}`)}
              >
                <TableCell className="font-mono text-muted-foreground font-medium">
                  #{problem.shortId}
                </TableCell>
                <TableCell className="font-medium">
                  {problem.name}
                </TableCell>
                <TableCell>
                  <Badge variant={getDifficultyVariant(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {problem.tags.length === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        No Tags
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-success">
                      {problem.numberOfAccepted.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {problem.numberOfSubmissions.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};


export default ProblemList