import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Welcome from "./pages/Welcome";
import ChatStart from "./pages/ChatStart";
import Chat from "./pages/Chat";
import Feedback from "./pages/Feedback";
import Continuity from "./pages/Continuity";
import Referral from "./pages/Referral";
import Professionals from "./pages/Professionals";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/chat-start" component={ChatStart} />
      <Route path="/chat" component={Chat} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/continuity" component={Continuity} />
      <Route path="/referral" component={Referral} />
      <Route path="/professionals" component={Professionals} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
