import { useState } from "react";
import Navigation from "@/components/Navigation";
import PricingCard from "@/components/PricingCard";
import PaymentModal from "@/components/PaymentModal";
import { CheckCircle } from "lucide-react";

export const PRICING_PACKAGES = [
  {
    title: "Basic",
    price: 25000,
    description: "Paket dasar untuk pemula dan pelajar",
    specs: "1 Core, 1 GB RAM",
    features: [
      "1 vCPU",
      "1 GB RAM",
      "20 GB Storage",
      "500 MB/s Bandwidth",
      "Email Support",
    ],
  },
  {
    title: "Standard",
    price: 50000,
    description: "Paket standar untuk startup dan bisnis kecil",
    specs: "1 Core, 2 GB RAM",
    features: [
      "1 vCPU",
      "2 GB RAM",
      "50 GB Storage",
      "1 TB/s Bandwidth",
      "24/7 Support",
    ],
  },
  {
    title: "Pro",
    price: 75000,
    description: "Paket premium untuk UMKM dan bisnis berkembang",
    specs: "1 Core, 3 GB RAM",
    features: [
      "1 vCPU",
      "3 GB RAM",
      "100 GB Storage",
      "2 TB/s Bandwidth",
      "Priority Support",
    ],
  },
  {
    title: "Virtual Server Small",
    price: 100000,
    description: "Server virtual untuk bisnis kecil-menengah",
    specs: "1 vCPU, 2 GB RAM",
    features: [
      "1 vCPU",
      "2 GB RAM",
      "50 GB Storage",
      "1 TB Bandwidth",
      "24/7 Support",
    ],
  },
  {
    title: "Virtual Server Medium",
    price: 250000,
    description: "Most popular choice - Server untuk bisnis berkembang",
    specs: "4 vCPU, 8 GB RAM",
    features: [
      "4 vCPU",
      "8 GB RAM",
      "200 GB Storage",
      "5 TB Bandwidth",
      "Priority Support",
      "Auto Scaling",
    ],
    featured: true,
  },
  {
    title: "Virtual Server Large",
    price: 500000,
    description: "Server untuk enterprise dan operasi besar",
    specs: "16 vCPU, 32 GB RAM",
    features: [
      "16 vCPU",
      "32 GB RAM",
      "1 TB Storage",
      "Unlimited Bandwidth",
      "Dedicated Support",
      "Custom Configuration",
    ],
  },
];

export default function Pricing() {
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    packageName: string;
    price: number;
  }>({ isOpen: false, packageName: "", price: 0 });

  const handleChoosePlan = (packageName: string, price: number) => {
    setPaymentModal({
      isOpen: true,
      packageName,
      price,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e]">
      <Navigation />

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-0 right-0 w-full h-full opacity-20"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5b5fff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#5b5fff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M 100 200 Q 300 100 500 200 T 900 200" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
          <path d="M 50 300 Q 250 200 450 300 T 850 300" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
          <path d="M 150 400 Q 350 300 550 400 T 950 400" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your cloud infrastructure needs.
              All plans include 99.9% uptime guarantee and 24/7 customer support.
            </p>
          </div>

          {/* Pricing List - All 6 Packages */}
          <div className="space-y-4 mb-16">
            {PRICING_PACKAGES.map((pkg, index) => (
              <div
                key={index}
                className={`relative rounded-xl border transition-all ${
                  pkg.featured
                    ? "bg-gradient-to-r from-blue-600/30 to-blue-700/20 border-blue-500/50 shadow-lg shadow-blue-500/20"
                    : "bg-gradient-to-br from-gray-900 to-gray-950 border-gray-700/50 hover:border-blue-500/30"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-8 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                    {/* Package Name & Description */}
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{pkg.description}</p>
                      <p className="text-blue-400 font-semibold">{pkg.specs}</p>
                    </div>

                    {/* Features List */}
                    <div className="md:col-span-2">
                      <div className="grid grid-cols-2 gap-3">
                        {pkg.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex flex-col items-center justify-between h-full">
                      <div className="text-center mb-4">
                        <p className="text-4xl font-bold text-white">
                          Rp {(pkg.price / 1000).toFixed(0)}K
                        </p>
                        <p className="text-gray-400 text-sm">/bulan</p>
                      </div>
                      <button
                        onClick={() => handleChoosePlan(pkg.title, pkg.price)}
                        className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                          pkg.featured
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-700/50 hover:bg-gray-700 text-gray-300 border border-gray-600"
                        }`}
                      >
                        Pilih Paket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 hover:border-blue-500/30 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Can I upgrade my plan anytime?
                </h3>
                <p className="text-gray-400">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.
                </p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 hover:border-blue-500/30 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Is there a money-back guarantee?
                </h3>
                <p className="text-gray-400">
                  We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full.
                </p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 hover:border-blue-500/30 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Are there any hidden fees?
                </h3>
                <p className="text-gray-400">
                  No hidden fees. The price you see is what you pay. Additional services like backups or extra storage are clearly listed.
                </p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 hover:border-blue-500/30 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Do you offer enterprise plans?
                </h3>
                <p className="text-gray-400">
                  Yes! For custom requirements, contact our sales team. We can create tailored solutions for enterprise clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        packageName={paymentModal.packageName}
        price={paymentModal.price}
      />
    </div>
  );
}
