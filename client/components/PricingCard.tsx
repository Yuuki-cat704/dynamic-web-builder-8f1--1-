import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";

interface PricingCardProps {
  title: string;
  price: number;
  description?: string;
  features?: string[];
  featured?: boolean;
  showFreeTrialButton?: boolean;
}

export default function PricingCard({
  title,
  price,
  description,
  features = [],
  featured = false,
  showFreeTrialButton = true,
}: PricingCardProps) {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  return (
    <>
      <div
        className={`rounded-2xl p-8 transition-all duration-300 ${
          featured
            ? "bg-gradient-to-br from-blue-600/40 to-blue-700/40 border-2 border-blue-500 shadow-xl shadow-blue-500/20 transform scale-105"
            : "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-blue-500/50"
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">
              Rp. {price.toLocaleString("id-ID")}
            </span>
            <span className="text-gray-400">,00</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">per month</p>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <ul className="mb-8 space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* CTA Buttons */}
        <div className={`flex gap-3 ${!showFreeTrialButton ? "" : ""}`}>
          <button
            onClick={() => setShowPayment(true)}
            className={`${
              showFreeTrialButton ? "flex-1" : "w-full"
            } bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300`}
          >
            Price Now
          </button>
          {showFreeTrialButton && (
            <button
              onClick={() => setShowPayment(true)}
              className={`flex-1 font-semibold py-3 rounded-lg transition-all duration-300 ${
                featured
                  ? "bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/50"
                  : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600"
              }`}
            >
              Free trial
            </button>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          title={title}
          price={price}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}
