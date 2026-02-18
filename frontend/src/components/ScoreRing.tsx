interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#c8f135";
  if (score >= 60) return "#fbbf24";
  return "#f87171";
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Needs Work";
}

export default function ScoreRing({
  score,
  size = 140,
  strokeWidth = 10,
  label,
  color,
}: ScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const ringColor = color || getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="score-ring">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(63, 63, 142, 0.3)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
              filter: `drop-shadow(0 0 8px ${ringColor}66)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold leading-none"
            style={{ fontSize: size * 0.22, color: ringColor }}
          >
            {Math.round(score)}
          </span>
          <span className="text-ink-400 mt-0.5" style={{ fontSize: size * 0.085 }}>
            /100
          </span>
        </div>
      </div>
      {label && (
        <div className="text-center">
          <div className="text-sm font-medium text-ink-200">{label}</div>
          <div className="text-xs text-ink-400 mt-0.5">{getScoreLabel(score)}</div>
        </div>
      )}
    </div>
  );
}