

export const isContestRunning = (contest) => {
  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  return now >= start && now <= end;
}