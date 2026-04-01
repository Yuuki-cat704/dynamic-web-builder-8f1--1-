import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  price?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  highlight?: boolean;
}

export default function ServiceCard({
  icon,
  title,
  description,
  features,
  price,
  buttonText = "Learn More",
  onButtonClick,
  highlight = false,
}: ServiceCardProps) {
  return (
    <Card
      className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 ${
        highlight
          ? "bg-gradient-to-br from-blue-600/20 to-blue-500/10 border-blue-500/50"
          : "bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-[#2a2a4e] hover:border-blue-500/30"
      }`}
    >
      {/* Icon */}
      <div className="mb-4 text-blue-400 text-4xl">{icon}</div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4">{description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Price */}
      {price && <p className="text-blue-400 font-semibold mb-4">{price}</p>}

      {/* Button */}
      <button
        onClick={onButtonClick}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
          highlight
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 hover:border-blue-400"
        }`}
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </button>
    </Card>
  );
}
