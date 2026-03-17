import React from "react";
import "./PollOption.css";

export default function PollOption({ option, votes, totalVotes, onVote, disabled, hasVoted, isUserVote }) {
  const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;

  return (
    <button
      className={`poll-option ${isUserVote ? "user-voted" : ""} ${hasVoted ? "revealed" : ""}`}
      onClick={() => onVote(option)}
      disabled={disabled || hasVoted}
    >
      <div className="poll-option-fill" style={{ width: `${percentage}%` }} />
      <div className="poll-option-content">
        <span className="poll-option-name">{option}</span>
        {hasVoted && (
          <span className="poll-option-stats">
            {votes} vote{votes !== 1 ? "s" : ""} · {percentage}%
          </span>
        )}
      </div>
      {isUserVote && <span className="poll-vote-badge">Your vote</span>}
    </button>
  );
}