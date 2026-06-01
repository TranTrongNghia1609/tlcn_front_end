import React from 'react';
import { Trophy, ArrowLeft, Sparkles, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LeaderBoard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      {/* Main Container */}
      <div className="max-w-xl w-full text-center bg-white border border-gray-200 p-8 md:p-12 rounded-2xl shadow-sm space-y-6">

        {/* Icon Container */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full border border-blue-100">
            <Trophy className="h-10 w-10 text-blue-600 animate-bounce" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 tracking-wider uppercase">
            Feature under development
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Leaderboard
          </h1>

          <h2 className="text-xl font-bold text-blue-600">
            Coming Soon
          </h2>

          <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto leading-relaxed">
            We are designing a brand-new competitive landscape. Prepare to challenge your peers, track your performance, climb the ranks, and showcase your coding mastery!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;