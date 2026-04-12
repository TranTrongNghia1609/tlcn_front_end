import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getSubmissionDifficultyChart } from '@/services/submissionService';
import { toLower } from 'lodash';

const chartConfig = {
  "count": {
    label: "No: ",
    color: "green",
  },
};

const DifficultyChart = ({ userId }) => {
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSubmissionDifficultyChart(userId);
        if (response.success) {
          const dataWithColors = response.data.chart.map(item => ({
            ...item,
            fill: `var(--color-${toLower(item.difficulty)})`
          }));
          setChartData(dataWithColors);
          setTotal(response.data.total);
        }
      } catch (error) {
        console.error("Error fetching difficulty chart:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Distribution</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={'h-full'}>
      <CardHeader>
        <CardTitle>Difficulty Distribution</CardTitle>
        <CardDescription>Total problems solved: {total}</CardDescription>
      </CardHeader>
      <CardContent className={'mt-5'}>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="difficulty"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DifficultyChart;
