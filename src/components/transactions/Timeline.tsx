import React from 'react';
import { TransactionStage } from '../../types';
import { CheckCircle2, Clock, CircleDot, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineProps {
  stages: TransactionStage[];
}

export const TransactionTimeline: React.FC<TimelineProps> = ({ stages }) => {
  const sortedStages = [...stages].sort((a, b) => 
    new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
  );

  return (
    <div className="relative flex flex-col space-y-8 py-4">
      {/* Line connecting stages */}
      <div className="absolute left-[19px] top-6 h-[calc(100%-48px)] w-[2px] bg-slate-200" />

      {sortedStages.map((stage, index) => {
        const isCompleted = stage.status === 'completed';
        const isCurrent = stage.status === 'current';
        const isUpcoming = stage.status === 'upcoming';

        return (
          <motion.div 
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start gap-6 group"
          >
            {/* Stage Icon */}
            <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
              isCompleted 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : isCurrent 
                  ? 'bg-white border-blue-600 text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                  : 'bg-white border-slate-300 text-slate-400'
            }`}>
              {isCompleted ? (
                <CheckCircle2 size={22} strokeWidth={2.5} />
              ) : isCurrent ? (
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute h-full w-full rounded-full bg-blue-100 -z-10"
                  />
                  <CircleDot size={20} strokeWidth={2.5} />
                </div>
              ) : (
                <Clock size={20} />
              )}
            </div>

            {/* Stage Content */}
            <div className="flex flex-col pt-1.5 pb-2">
              <h3 className={`font-semibold text-lg leading-tight transition-colors ${
                isCompleted ? 'text-slate-900' : isCurrent ? 'text-blue-600' : 'text-slate-500'
              }`}>
                {stage.stage_name}
              </h3>
              <p className="mt-1 text-slate-500 text-sm max-w-sm leading-relaxed">
                {stage.description}
              </p>
              {isCompleted && (
                <span className="mt-2 text-xs font-medium text-slate-400">
                  Updated at {new Date(stage.updated_at).toLocaleString()}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
