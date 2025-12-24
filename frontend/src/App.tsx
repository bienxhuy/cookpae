import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import SettingPage from './pages/SettingPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CreateRecipePage from './pages/CreateRecipePage';
import AssistantPage from './pages/AssistantPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import BotPage from './pages/BotPage';
import { Toaster } from './components/ui/sonner';
import { HomePageLayout } from './components/HomePageLayout';
import { CommonLayout } from './components/CommonLayout';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<HomePageLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          <Route element={<CommonLayout />}>
            <Route path="/auth/google/callback" element={<AuthCallbackPage />} />
            <Route path="/bot" element={<BotPage />} />
            <Route path="/recipes" element={<RecipePage initialTab="favorite" />} />
            <Route path="/recipes/my" element={<RecipePage initialTab="your_recipe" />} />
            <Route path="/recipes/create" element={<CreateRecipePage />} />
            <Route path="/notifications" element={<RecipePage initialTab="notification" />} />
            <Route path="/ingredients" element={<RecipePage initialTab="ingredient" />} />

            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/assistant" element={<AssistantPage />} />

            <Route path="*" element={<div className="text-center py-10">404 Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}


export default App;