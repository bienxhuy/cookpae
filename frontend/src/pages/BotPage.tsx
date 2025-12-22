import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import FoodCard2 from '../components/FoodCard2';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content?: string;
  recipeCard?: {
    title: string;
    author: string;
    likes: number;
    description: string;
    imageUrl: string;
  };
  fullRecipe?: {
    title: string;
    tags: string[];
    description: string;
    ingredients: string[];
    steps: string[];
  };
}

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bot can inject component for user to easily navigate',
    },
    {
      id: '2',
      type: 'bot',
      content: 'Well, if you want something like that, you can try NemchuaThanhHoa',
      recipeCard: {
        title: 'Nem chua Thanh Hóa',
        author: 'AnhTrai36',
        likes: 3636,
        description: 'Cách làm nem chua Thanh Hóa cực ngon tại nhà, lên men tự nhiên...',
        imageUrl:"/pwa-512x512.png",
      },
    },
    {
      id: '3',
      type: 'bot',
      content: 'or',
    },
    {
      id: '4',
      type: 'bot',
      content: 'In that case, I can suggest you to cook this meal\nThis one is new',
      fullRecipe: {
        title: 'Chả cá Vũng Tàu',
        tags: ['Việt Nam', 'Cay', 'Biển'],
        description: 'Món chả cá thơm lừng, đậm đà hương vị miền biển Vũng Tàu.',
        ingredients: ['Cá lăng/cá basa', 'Thì là', 'Hành lá', 'Gia vị', 'Ớt tươi'],
        steps: ['Sơ chế cá sạch sẽ', 'Ướp gia vị 30 phút', 'Chiên vàng hai mặt', 'Thêm thì là và hành lá trước khi tắt bếp'],
      },
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Cảm ơn bạn! Hôm nay bạn muốn nấu món gì nào? Mình gợi ý thêm nhé 🍳',
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleSaveRecipe = (recipeTitle: string) => {
    alert(`Đã lưu công thức "${recipeTitle}"! Đang chuyển đến trang tạo/sửa công thức...`);
  };

  return (
    <div className="flex flex-col h-screen w-auto bg-gray-100">

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className="flex gap-3 max-w-lg">
                {message.type === 'bot' && (
                  <div className="w-9 h-9 bg-blue-500 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold mt-1">
                    C
                  </div>
                )}

                <div
                  className={`rounded-2xl px-5 py-3 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  {message.content && (
                    <p className="whitespace-pre-line text-base leading-relaxed">
                      {message.content}
                    </p>
                  )}

                  {/* Recipe Card */}
                  {message.recipeCard && (
                    <div className="p-4 mt-4 -mx-5 -mb-3">
                      <FoodCard2
                        title={message.recipeCard.title}
                        author={message.recipeCard.author}
                        likes={message.recipeCard.likes}
                        description={message.recipeCard.description}
                        imageUrl={message.recipeCard.imageUrl}
                      />
                    </div>
                  )}

                  {/* Full Recipe */}
                  {message.fullRecipe && (
                    <div className="mt-4 bg-gray-50 border border-gray-300 rounded-xl p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {message.fullRecipe.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {message.fullRecipe.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 mb-4 italic">
                        {message.fullRecipe.description}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Nguyên liệu:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {message.fullRecipe.ingredients.map((ing, i) => (
                              <li key={i}>{ing}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Các bước:</h4>
                          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                            {message.fullRecipe.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSaveRecipe(message.fullRecipe!.title)}
                        className="mt-5 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
                      >
                        Lưu công thức này
                      </button>
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="w-9 h-9 bg-gray-400 rounded-full shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-5 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-4 rounded-full transition-colors shadow-md disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}