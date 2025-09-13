import ProblemDetail from '@/components/problems/ProblemDetail';
import React from 'react'
import Split from 'react-split';
import PlayGround from './playground/PlayGround';
const WorkSpace = () => {
  return (
    <div className='h-[calc(100vh-88px)] mt-2 min-h-0 overflow-hidden'>
      <Split className="split h-full min-h-0" minSize={200}>
        <div className="h-full min-h-0 overflow-y-auto">
          <ProblemDetail />
        </div>
        <div className="h-full min-h-0 overflow-y-auto">
          <PlayGround />
        </div>
      </Split>
    </div>
  )
}

export default WorkSpace