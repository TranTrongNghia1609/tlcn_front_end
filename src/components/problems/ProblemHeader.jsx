import React from 'react'
import { Button } from "@/components/ui/button"
import { Clock, HardDrive } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ProblemHeader = ({ title, tags = [], time, memory }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-3 px-4">
      <div className="flex flex-col items-center justify-center text-center px-4 py-4 space-y-3">
          <h1 className="text-2xl font-bold text-violet-700">{title}</h1>

          {/* Tags with wrap */}
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map(tag => (
              <Button
                key={tag}
                variant="outline"
                className="rounded-4xl hover:bg-violet-700 hover:text-white border-violet-600 text-violet-700 h-6 px-3 text-sm"
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Time + Memory */}
          {(time || memory) && (
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {time && (
                <div className="flex items-center gap-1.5">
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
  )
}

export default ProblemHeader
