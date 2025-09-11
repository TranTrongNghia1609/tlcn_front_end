import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardCopy, FileInput, FileOutput, Copy, CopyCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ProblemExamples = ({ examplesInput = [], examplesOutput = [] }) => {
  const [copiedInputs, setCopiedInputs] = useState(Array(examplesInput.length).fill(false));
  const [copiedOutputs, setCopiedOutputs] = useState(Array(examplesOutput.length).fill(false));

  const handleCopy = async (text, type = "Input", index = 0) => {
    try{
      await navigator.clipboard.writeText(text)
      // Set copied state for icon swap
      if (type === "Input") {
        const newCopied = [...copiedInputs];
        newCopied[index] = true;
        setCopiedInputs(newCopied);
        setTimeout(() => {
          newCopied[index] = false;
          setCopiedInputs([...newCopied]);
        }, 2000);
      } else {
        const newCopied = [...copiedOutputs];
        newCopied[index] = true;
        setCopiedOutputs(newCopied);
        setTimeout(() => {
          newCopied[index] = false;
          setCopiedOutputs([...newCopied]);
        }, 2000);
      }
    }
    catch (error){
      console.log('Error when copy: ', error);
    }
      
  }

  return (
    <div className="w-4/5 mx-auto mt-6">
      <Card className="mt-4">
        <CardHeader className="border-b border-border/60 bg-gradient-to-r from-card to-card/80">
          <CardTitle className="text-2xl font-extrabold text-judge-header flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            Examples
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          {examplesInput.map((input, index) => (
            <div key={index} className="border border-border p-4 rounded-md bg-muted/40">
              {/* Example Input */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-semibold text-sm text-muted-foreground">
                    <FileInput className="w-4 h-4" />
                    <span>Example Input #{index + 1}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(input, "Input", index)}
                  >
                    {copiedInputs[index] ? 
                        <CopyCheck className="w-4 h-4" /> : 
                        <Copy className="w-4 h-4" />
                    }
                  </Button>
                </div>
                <pre className="bg-background p-3 rounded-md text-sm overflow-auto whitespace-pre-wrap">{input}</pre>
              </div>

              {/* Example Output */}
              {examplesOutput[index] && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-semibold text-sm text-muted-foreground">
                      <FileOutput className="w-4 h-4" />
                      <span>Example Output #{index + 1}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(examplesOutput[index], "Output", index)}
                    >
                      {copiedOutputs[index] ? 
                        <CopyCheck className="w-4 h-4" /> : 
                        <Copy className="w-4 h-4" />
                    }
                    </Button>
                  </div>
                  <pre className="bg-background p-3 rounded-md text-sm overflow-auto whitespace-pre-wrap">{examplesOutput[index]}</pre>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProblemExamples
