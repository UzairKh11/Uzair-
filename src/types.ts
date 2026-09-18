export interface ExecutionRecord {
  id: string;
  targetName: string;
  causeOfDeath: string;
  totalSeconds: number;
  remainingSeconds: number;
  parsedDurationText: string;
  createdAt: number;
  shinigamiVerdict: string;
  isCompleted: boolean;
  command: string;
}

export interface RuleItem {
  id: number;
  title: string;
  description: string;
  japaneseLore?: string;
}
