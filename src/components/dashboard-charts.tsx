

"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Label, PolarRadiusAxis, RadialBar, RadialBarChart, Cell } from "recharts";
import { TrendingUp, FileText } from 'lucide-react';
import { YearlyProgressChart } from "./yearly-progress-chart";

const chartColors = ['#9b59b6', '#e91e63', '#3498db', '#2980b9', '#1abc9c', '#f1c40f', '#e74c3c'];

const weeklySalesData = [
  { week: "Week 1", sales: 150, fill: chartColors[0] },
  { week: "Week 2", sales: 180, fill: chartColors[1] },
  { week: "Week 3", sales: 220, fill: chartColors[2] },
  { week: "Week 4", sales: 200, fill: chartColors[3] },
]

const chartConfig = {
    sales: {
      label: "Sales",
    },
    "chart-1": {
        label: "Chart 1",
        color: chartColors[0],
    },
    "chart-2": {
        label: "Chart 2",
        color: chartColors[1],
    },
    "chart-3": {
        label: "Chart 3",
        color: chartColors[2],
    },
    "chart-4": {
        label: "Chart 4",
        color: chartColors[3],
    },
    "chart-5": {
        label: "Chart 5",
        color: chartColors[4],
    },
    "Week 1": {
        label: "Week 1",
        color: chartColors[0],
    },
    "Week 2": {
        label: "Week 2",
        color: chartColors[1],
    },
    "Week 3": {
        label: "Week 3",
        color: chartColors[2],
    },
    "Week 4": {
        label: "Week 4",
        color: chartColors[3],
    },
} satisfies ChartConfig

const dailySalesData = [
    { day: "Sun", sales: 90, fill: chartColors[0] },
    { day: "Mon", sales: 140, fill: chartColors[1] },
    { day: "Tue", sales: 160, fill: chartColors[2] },
    { day: "Wed", sales: 150, fill: chartColors[3] },
    { day: "Thu", sales: 180, fill: chartColors[4] },
    { day: "Fri", sales: 210, fill: chartColors[5] },
    { day: "Sat", sales: 190, fill: chartColors[6] },
]

export function DashboardCharts() {
  return (
    <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Day-wise Sales</CardTitle>
                    <CardDescription>A summary of your sales for the current week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={dailySalesData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="day"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                        <YAxis />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="sales" radius={8}>
                            {dailySalesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">AI Analysis:</span> Your sales show a strong midweek performance, peaking on Friday. Consider running promotions on Sundays and Mondays to boost sales on slower days.
                    </p>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle className="font-headline">Weekly Sales</CardTitle>
                <CardDescription>A summary of sales for each week of the month.</CardDescription>
                </CardHeader>
                <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px] w-full">
                    <PieChart>
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={weeklySalesData}
                            dataKey="sales"
                            nameKey="week"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                             {weeklySalesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">AI Analysis:</span> You have a consistent upward trend in weekly sales, indicating healthy business growth. The slight dip in the most recent week is minor, but monitor next week's performance to ensure the growth trajectory continues.
                    </p>
                </CardFooter>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Monthly wise Progress</CardTitle>
                <CardDescription>Your progress towards annual targets.</CardDescription>
            </CardHeader>
            <CardContent>
                <YearlyProgressChart />
            </CardContent>
            <CardFooter>
                 <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">AI Analysis:</span> You started the year strong, exceeding your target in January. While March and April were slower, your performance is picking back up. Focus on maintaining this momentum to reach your year-end goals.
                </p>
            </CardFooter>
        </Card>
    </div>
  )
}
