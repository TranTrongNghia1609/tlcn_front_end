import { getSubmissionStatusChart } from '@/services/submissionService';
import React, { useEffect, useState } from 'react'
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter }
from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { color } from 'framer-motion';

function SubmissionPieChart({userId}) {
  const [chartData, setChartData] = useState();
  const statusColors = {
    "Accepted": "var(--color-ac)",
    "Wrong Answer": "var(--color-wa)",
    "Time Limit Exceeded": "var(--color-tle)",
    "Compilation Error": "var(--color-ce)",
    "Runtime Error": "var(--color-re)",
    "Internal Error": "var(--color-re)",
    "Memory Limit Exceeded": "var(--color-mle)"
  };
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const fetchStatusChart = async () => {
      const response = await getSubmissionStatusChart(userId);
      const data = response.data.chart;
      for (let i = 0; i < data.length; i++) {
        data[i].fill = statusColors[data[i].status] || "var(--color-re)";
      }
      setChartData(data);
      setTotal(response.data.total);
    }
    fetchStatusChart();
  }, []) 

  const chartConfig = {
    Accepted: {
      label: "AC",
    },
    "Wrong Answer": {
      label: "WA",
    },
    "Time Limit Exceeded": {
      label: "TLE",
    },
    "Compilation Error": {
      label: "CE",
    },
    "Runtime Error": {
      label: "RE",
    },
    "Memory Limit Exceeded": {
      label: "MLE",
    },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Submission Chart</CardTitle>
        <CardDescription>All submission</CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[300px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" label nameKey="status"
              isAnimationActive={true}
              stroke="white"
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total: {total}
        </div>
      </CardFooter>
    </Card>
  )
}

export default SubmissionPieChart