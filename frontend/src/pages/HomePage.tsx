import FoodCard1 from '../components/FoodCard1';
import FoodCard2 from '../components/FoodCard2';

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Home Page</h1>
      
      <div className="flex flex-col gap-6 w-80">
        <FoodCard1
          title="Chaos rauma"
          author="AnhTrai36"
          likes={3636}
          imageUrl="/pwa-512x512.png"
        />
  
        <FoodCard2
          title="NemchuaThanhHoa"
          author="AnhTrai36"
          likes={3636}
          description="Cach lam nemchuaThanhHoa cuc ngon ...."
          imageUrl="/pwa-512x512.png"
        />
      </div>
    </div>
  );
}