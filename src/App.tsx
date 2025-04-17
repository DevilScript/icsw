import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import TopupPage from "./pages/TopupPage";
import StorePage from "./pages/StorePage";
import HistoryPage from "./pages/HistoryPage";
import ResetHWIDPage from "./pages/ResetHWIDPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/topup" element={<TopupPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/reset-hwid" element={<ResetHWIDPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
