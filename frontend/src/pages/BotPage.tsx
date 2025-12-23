import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import FoodCard2 from '../components/FoodCard2';
import { naturalQuery } from '../services/query.service'; 
import { getRecipeById } from '../services/recipe.service';

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
}

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const thinkingMessage: Message = {
      id: 'thinking-' + Date.now(),
      type: 'bot',
      content: 'Đang tìm công thức phù hợp cho bạn... ⏳',
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const response = await naturalQuery({ prompt: inputValue.trim() });
      console.log('Response from naturalQuery:', response);
      setMessages(prev => prev.filter(m => m.id !== thinkingMessage.id));

      if (!response.success || !response.data) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Xin lỗi, mình gặp lỗi khi xử lý yêu cầu. Bạn thử lại nhé!',
        }]);
        return;
      }

      const { answer, recipeId } = response.data;

      console.log('Phản hồi từ naturalQuery:');
      console.log('   • answer:', answer);
      console.log('   • recipeId:', recipeId);

      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
      };

      if (recipeId) {
        try {
          const recipeRes = await getRecipeById(recipeId);
          console.log('Response from getRecipeById:', recipeRes);
          if (recipeRes.status === 'success' && recipeRes.data) {
            const recipe = recipeRes.data;

            botMessage.content = 'Mình tìm thấy công thức này từ cộng đồng CookPac đây ạ!';

            botMessage.recipeCard = {
              title: recipe.name || 'Công thức không tên',
              author: recipe.user?.name || recipe.user?.name || 'Cộng đồng',
              likes: (recipe.votes?.length || 0) + (recipe.votedUserIds?.length || 0),
              description: recipe.description || 'Công thức được cộng đồng chia sẻ và yêu thích',
              imageUrl: recipe.thumbnails?.[0]?.url || '/pwa-512x512.png',
            };
          } else {
            botMessage.content = 'Mình tìm thấy một công thức phù hợp từ cộng đồng nhưng tạm thời chưa tải được chi tiết.';
          }
        } catch (err) {
          console.error('Error fetching recipe:', err);
          botMessage.content = 'Có công thức từ cộng đồng nhưng tạm thời không xem được chi tiết.';
        }
      } 
      else {
        botMessage.content = answer || 'Đây là công thức mình gợi ý cho bạn nhé! ✨';
      }

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Lỗi tổng thể:', error);
      setMessages(prev => prev.filter(m => m.id !== thinkingMessage.id));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Có lỗi kết nối. Bạn thử lại sau nhé!',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMessages([
      {
        id: 'greeting',
        type: 'bot',
        content: 'Chào bạn! Mình là trợ lý nấu ăn AI đây 🍳\nBạn muốn nấu món gì hôm nay? Mình sẽ tìm công thức ngon nhất từ cộng đồng cho bạn nhé!',
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col h-screen w-auto bg-gray-100">

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
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
                    <p className="whitespace-pre-line text-base leading-relaxed mb-4">
                      {message.content}
                    </p>
                  )}

                  {/* Chỉ hiển thị FoodCard2 khi có recipeCard */}
                  {message.recipeCard && (
                    <div className="mt-4 mb-3 mx-2">
                      <FoodCard2
                        title={message.recipeCard.title}
                        author={message.recipeCard.author}
                        likes={message.recipeCard.likes}
                        description={message.recipeCard.description}
                        imageUrl={message.recipeCard.imageUrl}
                      />
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

      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Nhập món bạn muốn nấu..."
            className="flex-1 px-5 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-4 rounded-full transition-colors shadow-md disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}