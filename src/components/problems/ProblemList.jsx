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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

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


const ProblemListSkeleton = () => {
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
            {[...Array(10)].map((_, index) => (
              <TableRow key={index} className="border-border">
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-16" />
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

const ProblemList = ({ filters, page, onPageChange }) => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [problemPagination, setProblemPagination] = useState({
    page: 1,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        const params = { page };
        // Thêm filters vào params nếu có giá trị
        if (filters?.name) params.name = filters.name;
        if (filters?.tag) params.tag = filters.tag;
        if (filters?.difficulty) params.difficulty = filters.difficulty;

        const response = await getProblems(params);
        const paginationData = response?.data || {};
        const totalPages = Number(paginationData.totalPages) || 0;

        if (totalPages > 0 && page > totalPages) {
          onPageChange(totalPages);
          return;
        }

        if (totalPages === 0 && page !== 1) {
          onPageChange(1);
          return;
        }

        setProblems(Array.isArray(paginationData.content) ? paginationData.content : []);
        setProblemPagination(paginationData);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [page, filters, onPageChange]);

  if (isLoading) {
    return <ProblemListSkeleton />;
  }

  const totalPages = Number(problemPagination?.totalPages) || 0;

  return (
    <div className="w-full space-y-3">
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Problems List
        </h2>
      </div>
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
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination className={"cursor-pointer"}>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => (page > 1 ? onPageChange(page - 1) : null)}
                  />
                </PaginationItem>
                {
                  Array.from({ length: totalPages }, (_, index) => {
                    const targetPage = index + 1;
                    return (
                      <PaginationItem key={targetPage}>
                        <PaginationLink
                          onClick={() => onPageChange(targetPage)}
                          isActive={targetPage === page}
                        >
                          {targetPage}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })
                }
                <PaginationItem>
                  <PaginationNext
                    onClick={() => (page < totalPages ? onPageChange(page + 1) : null)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
};


export default ProblemList