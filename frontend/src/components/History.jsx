import React from 'react';

const History = ({ history }) => {
  return (
    <div className="history-container">
      <h2>History</h2>
      {history.length === 0 ? (
        <div className="no-history">No calculations yet.</div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-expression">{item.expression} =</div>
              <div className="history-result">{item.result}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
