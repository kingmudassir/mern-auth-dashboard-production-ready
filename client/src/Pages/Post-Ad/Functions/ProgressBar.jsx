import { Check } from 'lucide-react';

const ProgressBar = ({ activeStep, steps, onStepClick, completedSteps = [] }) => {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map(({ label, icon: Icon }, i) => {
        const done = completedSteps[i]; // ← was: i < activeStep
        const active = i === activeStep;

        return (
          <div
            key={label}
            className="flex items-center flex-1 last:flex-none"
            onClick={() => onStepClick?.(i)}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: done ? '#6C3CE1' : active ? 'rgba(108,60,225,0.12)' : '#F2EEE9',
                }}
              >
                {done ? (
                  <Check size={15} strokeWidth={2.5} style={{ color: '#fff' }} aria-hidden="true" />
                ) : (
                  <Icon
                    size={15}
                    strokeWidth={1.9}
                    style={{ color: active ? '#6C3CE1' : '#C4BDD0' }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className="text-[0.65rem] font-semibold uppercase tracking-wide hidden sm:block"
                style={{
                  color: active ? '#6C3CE1' : done ? '#1A1523' : '#C4BDD0',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300"
                style={{ background: i < activeStep ? '#6C3CE1' : '#E8E3DC' }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
