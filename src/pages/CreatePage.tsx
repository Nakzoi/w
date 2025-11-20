import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Plus, MapPin, Link as LinkIcon, FileText, Tag, Users, Lock, ArrowRight } from "lucide-react";

export default function CreatePage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [chatType, setChatType] = useState<"GROUP" | "PRIVATE">("GROUP");

  const handleBack = () => {
    navigate(-1);
  };

  const handleCheckout = () => {
    if (selectedPlan) {
      // Navigate to the payment page with plan details
      navigate('/payment', {
        state: {
          plan: selectedPlan,
          // Include other necessary data for the payment
          title: (document.getElementById('title') as HTMLInputElement)?.value || '',
          description: (document.getElementById('description') as HTMLTextAreaElement)?.value || '',
          category: (document.getElementById('category') as HTMLSelectElement)?.value || '',
          chatType,
          // Add other form fields as needed
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm">
        <button onClick={handleBack} className="text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">Create Page</h1>
        </div>
        <button className="text-brand font-medium">VIEW</button>
      </header>

      <main className="p-6">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none"
            placeholder="Enter title"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Images
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div 
                key={item}
                className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <Plus className="text-gray-400" size={24} />
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">
            Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="text-gray-400" size={18} />
            </div>
            <input
              id="address"
              type="text"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none"
              placeholder="Enter address"
            />
          </div>
        </div>

        {/* Link */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="link">
            Link (optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="text-gray-400" size={18} />
            </div>
            <input
              id="link"
              type="url"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none"
              placeholder="Enter link"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
            Description
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3">
              <FileText className="text-gray-400" size={18} />
            </div>
            <textarea
              id="description"
              rows={4}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none resize-none"
              placeholder="Enter description"
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="text-gray-400" size={18} />
            </div>
            <select
              id="category"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none appearance-none bg-white"
              defaultValue=""
            >
              <option value="" disabled>Select a category</option>
              <option value="food">Food</option>
              <option value="drinks">Drinks</option>
              <option value="party">Party</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ArrowRight className="text-gray-400" size={18} />
            </div>
          </div>
        </div>

        {/* Chat Type */}
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-medium mb-3">
            Accept requests as
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setChatType("GROUP")}
              className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center ${chatType === "GROUP" ? 'border-brand bg-brand/5' : 'border-gray-200'}`}
            >
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-2">
                <Users className="text-brand" size={24} />
              </div>
              <span className="font-medium">GROUP chat</span>
            </button>
            <button
              type="button"
              onClick={() => setChatType("PRIVATE")}
              className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center ${chatType === "PRIVATE" ? 'border-brand bg-brand/5' : 'border-gray-200'}`}
            >
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-2">
                <Lock className="text-brand" size={24} />
              </div>
              <span className="font-medium">PRIVATE chat</span>
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pricing</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { days: 3, price: 0.99, popular: false },
              { days: 15, price: 4.99, popular: true },
              { days: 30, price: 7.99, popular: false },
            ].map((plan) => (
              <div 
                key={plan.days}
                onClick={() => setSelectedPlan(plan.days)}
                className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-all ${
                  selectedPlan === plan.days 
                    ? 'border-brand bg-brand/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="bg-brand text-white text-xs font-medium px-2 py-1 rounded-full mb-2 -mt-3 mx-auto w-fit">
                    POPULAR
                  </div>
                )}
                <div className="text-2xl font-bold text-gray-800">{plan.days} day{plan.days !== 1 ? 's' : ''}</div>
                <div className="text-sm text-gray-500">${plan.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={!selectedPlan}
          className={`w-full py-4 rounded-full text-white font-bold text-lg ${
            selectedPlan ? 'bg-brand hover:bg-brand/90' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Checkout
        </button>
      </main>
    </div>
  );
}
