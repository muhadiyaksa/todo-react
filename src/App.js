import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import ActivityDetail from "./pages/ActivityDetail";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />}></Route>
          <Route exact path="/detail/:id" element={<ActivityDetail />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
