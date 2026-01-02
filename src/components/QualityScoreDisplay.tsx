import { BarChart3, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

interface QualityScoreResult {
  creativeScore: number;
  visualHierarchy: number;
  brandConsistency: number;
  textReadability: number;
  platformFitness: number;
  strengths: string[];
  improvements: string[];
}

interface QualityScoreDisplayProps {
  score: QualityScoreResult;
}

export const QualityScoreDisplay = ({ score }: QualityScoreDisplayProps) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-500";
    if (value >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const dimensions = [
    { label: "Visual Hierarchy", value: score.visualHierarchy, icon: BarChart3 },
    { label: "Brand Consistency", value: score.brandConsistency, icon: CheckCircle2 },
    { label: "Text Readability", value: score.textReadability, icon: TrendingUp },
    { label: "Platform Fitness", value: score.platformFitness, icon: TrendingDown },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border border-border bg-card space-y-4"
    >
      {/* Overall Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          <h4 className="font-semibold">Quality Score</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${getScoreColor(score.creativeScore)}`}>
            {score.creativeScore}
          </span>
          <span className="text-muted-foreground text-sm">/100</span>
        </div>
      </div>

      {/* Dimension Scores */}
      <div className="space-y-3">
        {dimensions.map((dim, index) => {
          const Icon = dim.icon;
          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{dim.label}</span>
                </div>
                <span className={`font-semibold ${getScoreColor(dim.value)}`}>
                  {dim.value}/100
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.value}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`h-full ${getScoreBgColor(dim.value)}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths */}
      {score.strengths && score.strengths.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <h5 className="text-sm font-semibold flex items-center gap-2 text-green-500">
            <TrendingUp className="w-4 h-4" />
            Strengths
          </h5>
          <ul className="space-y-1">
            {score.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {score.improvements && score.improvements.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <h5 className="text-sm font-semibold flex items-center gap-2 text-yellow-500">
            <AlertCircle className="w-4 h-4" />
            Improvements
          </h5>
          <ul className="space-y-1">
            {score.improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

