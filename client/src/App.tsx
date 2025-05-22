import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AppLayout from "@/components/layout/AppLayout";
import { ThemeProvider } from "./context/ThemeProvider";
import { SearchProvider } from "./context/SearchContext";
import { SearchDialogContainer } from "./components/search/SearchDialogContainer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SearchProvider>
            <AppLayout>
              <Toaster />
              <Router />
            </AppLayout>
            <SearchDialogContainer />
          </SearchProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
