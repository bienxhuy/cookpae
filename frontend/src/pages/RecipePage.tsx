import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Bell, BookOpen, Carrot } from 'lucide-react';
import ListItemRenderer from '../components/ListItemRecipePage';
import { useNavigate } from 'react-router-dom';

const TAB_CONFIG = {
  favorite: { title: 'Favorite recipes', icon: Heart, itemType: 'recipe' as const },
  your_recipe: { title: 'Your recipes', icon: BookOpen, itemType: 'recipe' as const }, 
  notification: { title: 'Notifications', icon: Bell, itemType: 'notification' as const },
  ingredient: { title: 'Ingredients', icon: Carrot, itemType: 'ingredient' as const },
};

type TabKey = keyof typeof TAB_CONFIG;

const MOCK_DATA: Record<TabKey, any[]> = {
  favorite: [
    {
      id: 1,
      title: 'Nem chua Thanh Hóa',
      description: 'Cách làm nem chua Thanh Hóa cực ngon tại nhà...',
      author: 'AnhTrai36',
      likes: 3636,
      imageUrl: 'https://example.com/nemchua.jpg',
    },
    {
      id: 2,
      title: 'Bánh mì pate nhà làm',
      description: 'Công thức pate gan siêu mịn màng',
      author: 'Bạn',
      likes: 145,
      imageUrl: 'https://example.com/nemchua.jpg',
    },
    {
      id: 3,
      title: 'Nem chua Thanh Hóa',
      description: 'Cách làm nem chua Thanh Hóa cực ngon tại nhà...',
      author: 'AnhTrai36',
      likes: 3636,
      imageUrl: 'https://example.com/nemchua.jpg',
    },
    {
      id: 4,
      title: 'Nem chua Thanh Hóa',
      description: 'Cách làm nem chua Thanh Hóa cực ngon tại nhà...',
      author: 'AnhTrai36',
      likes: 3636,
      imageUrl: 'https://example.com/nemchua.jpg',
    },
  ],
  your_recipe: [
    {
      id: 2,
      title: 'Bánh mì pate nhà làm',
      description: 'Công thức pate gan siêu mịn màng',
      author: 'Bạn',
      likes: 145,
      imageUrl: 'https://example.com/nemchua.jpg',
    },
  ],
  notification: [
    { id: 1, title: 'AnhTrai36 đã thích công thức của bạn', message: 'Nem chua Thanh Hóa nhận lượt thích mới', time: '5 phút trước' },
    { id: 2, title: 'Bình luận mới', message: 'ChefMinh: "Làm theo rất ngon!"', time: '1 giờ trước' },
  ],
  ingredient: [
    { id: 1, title: 'Thịt nạc vai', description: '500g xay nhuyễn' },
    { id: 2, title: 'Bì lợn', description: '200g thái sợi mỏng' },
    { id: 3, title: 'Gia vị nem chua', description: '1 gói đầy đủ' },
  ],
};

interface RecipePageProps {
  initialTab?: TabKey;
}

const RecipePage: React.FC<RecipePageProps> = ({ initialTab = 'favorite' }) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<TabKey>(initialTab);

  const config = TAB_CONFIG[currentTab];
  const Icon = config.icon;
  const items = MOCK_DATA[currentTab] || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3"> {/* Tăng gap cho đẹp */}
            <button
              onClick={() => navigate(-1)} // ← Quay về trang trước
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Quay lại"
            >
              <ArrowLeft size={24} />
            </button>
            
            <div className="flex items-center gap-2 text-gray-700">
              <Icon size={20} />
              <h2 className="font-semibold text-lg">{config.title}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item) => (
              <ListItemRenderer
                key={item.id}
                item={item}
                type={config.itemType}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">Chưa có dữ liệu</p>
          )}
        </div>

      </div>

      {/* Pagination hiện đại, gọn đẹp */}
      <div className="flex justify-center items-center gap-3 mt-10">
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <ArrowLeft size={20} />
        </button>

        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-blue-500 text-white font-semibold shadow-md">
            1
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            2
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            3
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            4
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            5
          </button>
        </div>

        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default RecipePage;