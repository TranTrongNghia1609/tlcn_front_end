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
    <div className="w-4/5 mx-auto mt">
      <Card className="mt-3">
      <CardHeader className="border-b border-border/30 bg-gradient-to-r from-card to-card/80">
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
              {statement}
                {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus accusantium at enim. Id consequuntur quia nam incidunt dolorum? Eius minus, commodi sequi magni in omnis quibusdam sed odio deleniti adipisci?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos mollitia aspernatur, officia dolorem minima iure non illo tempora adipisci ipsa neque pariatur tempore similique possimus voluptatibus, consequuntur vero molestiae quos? */}
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
              {input}
                {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus accusantium at enim. Id consequuntur quia nam incidunt dolorum? Eius minus, commodi sequi magni in omnis quibusdam sed odio deleniti adipisci?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos mollitia aspernatur, officia dolorem minima iure non illo tempora adipisci ipsa neque pariatur tempore similique possimus voluptatibus, consequuntur vero molestiae quos? */}
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
              {output}
                {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus accusantium at enim. Id consequuntur quia nam incidunt dolorum? Eius minus, commodi sequi magni in omnis quibusdam sed odio deleniti adipisci?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos mollitia aspernatur, officia dolorem minima iure non illo tempora adipisci ipsa neque pariatur tempore similique possimus voluptatibus, consequuntur vero molestiae quos? */}
            </ReactMarkdown>
        </div>
      </CardContent>
      </Card>
    </div>
  )
}

export default ProblemStatement