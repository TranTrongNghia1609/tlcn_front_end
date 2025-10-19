import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import remarkMath from 'remark-math';
import { FileText, FileInput, FileOutput } from "lucide-react";

const ProblemStatement = ({statement, input, output}) => {
  return (
    <div className="ml-2 mr-2 mx-auto mt-6">
      <Card className="mt-3">
      <CardHeader className="border-b border-border/60 bg-gradient-to-r from-card to-card/80">
        <CardTitle className="text-2xl font-extrabold text-judge-header flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          Problem Statement
        </CardTitle>
      </CardHeader>

      <CardHeader className="font-extrabold text-xl">
        <div className="flex items-center gap-1.5">
          <FileText className="w-6 h-6" />
          <span>Problem description</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ml-3 prose max-w-none text-left">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex]}
            >
              {statement?.replace(/\\n/g, '\n')}
            </ReactMarkdown>
        </div>
      </CardContent>
      
      {/* Input section */}
      <CardHeader className="font-extrabold text-xl mt-2">
        <div className="flex items-center gap-1.5">
          <FileInput className="w-6 h-6" />
          <span>Input</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ml-3 prose max-w-none text-left">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex]}
            >
              {input?.replace(/\\n/g, '\n')}
            </ReactMarkdown>
        </div>
      </CardContent>

      {/* Output section */}
      <CardHeader className="font-extrabold text-xl mt-2">
        <div className="flex items-center gap-1.5">
          <FileOutput className="w-6 h-6" />
          <span>Output</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ml-3 prose max-w-none text-left">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex]}
            >
              {output?.replace(/\\n/g, '\n')}
            </ReactMarkdown>
        </div>
      </CardContent>
      </Card>
    </div>
  )
}

export default ProblemStatement