import { useSearchParams } from 'react-router-dom';

export default function RecipePage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'your_recipe';
  
  return (
    <div>
      <h1>Recipe Page</h1>
      <p>Current tab: {tab}</p>
    </div>
  );
}
