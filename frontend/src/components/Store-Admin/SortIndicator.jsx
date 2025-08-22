// SortIndicator.jsx
import React from "react";

export const SortIndicator = ({ sortConfig, sortKey }) => {
  if (sortConfig.key !== sortKey) {
    return <span className="ml-1 opacity-50">↕️</span>;
  }
  
  return (
    <span className="ml-1">
      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
    </span>
  );
};