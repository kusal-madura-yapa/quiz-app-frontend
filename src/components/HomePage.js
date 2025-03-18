import React from 'react';

function HomePage({ startQuiz, viewRecords, resetData, resetModel, deleteAllRecords }) {
  return (
    <div className="home-page">
      <h1 className="home-title">Welcome to the Adaptive Quiz</h1>
      
      <div className="button-group">
        <button className="start-button" onClick={startQuiz}>Start New Quiz</button>
        <button className="records-button" onClick={viewRecords}>View Previous Records</button>
      </div>

      <div className="button-group">
        <button className="reset-button" onClick={resetData}>Reset Quiz Data</button>
        {/* <button className="model-reset" onClick={resetModel}>Reset Model</button>
      </div>

      <div className="button-group">
        <button className="delete-records-button" onClick={deleteAllRecords}>Delete All Records</button> */}
      </div>
    </div>
  );
}

export default HomePage;