import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Chat from "./components/Chat";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/chat" element={<Chat />} />
        {/* <Route path="/grants" element={<Dashboard />} />
        <Route path="/applications" element={<Dashboard />} />
        <Route path="/regulations" element={<Dashboard />} />
        <Route path="/support" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
