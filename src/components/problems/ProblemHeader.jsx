import React from 'react'
import { Button } from "@/components/ui/button"
import { Clock, HardDrive, Star } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const ProblemHeader = ({title, tags = [], time, memory, difficulty, solved}) => {
  return (
    <div className="w-4/5 mx-auto mt-3"> 
      <Card>
        <div className="mt-1 flex flex-col justify-center items-center content-center">
            <h1 className="text-2xl font-bold text-violet-700 pb-0.5">{title}</h1>
            <div className="space-x-1 flex justify-center content-center">
              {tags.map(tag => (
                <Button
                  key={tag}
                  variant="outline"
                  className="rounded-4xl hover:bg-violet-700 hover:text-white border-violet-600 text-violet-700 h-6"
                >
                  {tag}
                </Button>
              ))}
            </div>
            <div className='mt-1.5'>
              {(time || memory) && (
                <div className="flex gap-4 text-sm">
                  {time && (
                    <div className="flex items-center gap-1.5 ">
                      <Clock className="w-4 h-4 text-violet-700" />
                      <span>Time: {time}s</span>
                    </div>
                  )}
                  {memory && (
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4 text-violet-700" />
                      <span>Memory: {memory}MB</span>
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
      </Card>
    </div>
  )
}

export default ProblemHeader