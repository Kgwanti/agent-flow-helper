
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import ClientManagement from "@/pages/ClientManagement";
import Viewings from "@/pages/Viewings";
import Communications from "@/pages/Communications";
import Documents from "@/pages/Documents";
import AIAssistant from "@/pages/AIAssistant";
import Deals from "@/pages/Deals";
import AIChatAssistant from "@/components/AIChatAssistant";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/clients" element={<ClientManagement />} />
        <Route path="/viewings" element={<Viewings />} />
        <Route path="/communications" element={<Communications />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AIChatAssistant embedded={false} />
      <Toaster />
    </Router>
  );
};

export default App;
