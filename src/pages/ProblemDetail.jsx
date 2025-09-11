import React, { useEffect, useState } from 'react'
import ProblemHeader from '../components/problems/ProblemHeader';
import { useParams } from 'react-router-dom';
import { problemService } from '../services/problemService';
import ProblemStatement from '@/components/problems/ProblemStatement';
import ProblemExamples from '@/components/problems/ProblemExamples';
const ProblemDetail = () => {
  const {id} = useParams();
  const [problem, setProblem] = useState("")
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchData() {
      // You can await here
      const response = await problemService.getProblemById(id);
      console.log('Problem detail: ', response.data);
      setProblem(response.data)
      setLoading(false)
    }
    fetchData();
  }, []); // 

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
  //       <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
  //         {/* Header skeleton */}
  //         <div className="space-y-4">
  //           <div className="flex items-center justify-between">
  //             <Skeleton className="h-8 w-3/4" />
  //             <Skeleton className="h-6 w-16" />
  //           </div>
  //           <div className="flex gap-4">
  //             <Skeleton className="h-4 w-24" />
  //             <Skeleton className="h-4 w-28" />
  //           </div>
  //           <div className="flex gap-2">
  //             <Skeleton className="h-6 w-20" />
  //             <Skeleton className="h-6 w-16" />
  //             <Skeleton className="h-6 w-24" />
  //           </div>
  //         </div>
          
  //         {/* Content skeleton */}
  //         <div className="border border-border/50 rounded-lg p-6 space-y-4">
  //           <Skeleton className="h-6 w-48" />
  //           <div className="space-y-2">
  //             <Skeleton className="h-4 w-full" />
  //             <Skeleton className="h-4 w-5/6" />
  //             <Skeleton className="h-4 w-4/5" />
  //             <Skeleton className="h-4 w-full" />
  //             <Skeleton className="h-4 w-3/4" />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div>
        <div className="flex-col justify-center items-center content-center">
          <div>
            <ProblemHeader title={problem.name} tags={problem.tags} time={problem.time} memory={problem.memory}/>
          </div>
          <ProblemStatement statement={problem.statement} input={problem.input} output={problem.output}/>
          <ProblemExamples examplesInput={problem.examplesInput} examplesOutput={problem.examplesOutput}/>
        </div>
    </div>
  )
}

export default ProblemDetail