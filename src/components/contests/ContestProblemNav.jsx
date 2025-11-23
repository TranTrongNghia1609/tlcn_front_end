import React from 'react'

function ContestProblemNav({currentProblemId, problems = [{id: '1'}, {id: '2'}, {id: '3'}]}) {
  return (
    <div className=''>
      <div className='mt-2 mb-4'>
        {problems.map((problem, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D...
          const isActive = problem.id === currentProblemId;
          
          return (
            <a
              key={problem.id}
              href={`#problem-${problem.id}`}
              className={`
                px-4 py-2 rounded-lg font-semibold transition-colors
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
            >
              {letter}
            </a>
          );
        })}
      </div>
    </div>
  )
}

export default ContestProblemNav