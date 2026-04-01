import { useState } from "react";
import { X, Copy, CheckCircle, Barcode, CreditCard, Smartphone, Building2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  price: number;
}

type PaymentMethod = "barcode" | "bank" | "ewallet" | "credit_card";

export default function PaymentModal({
  isOpen,
  onClose,
  packageName,
  price,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("barcode");
  const [copied, setCopied] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = async () => {
    try {
      // Get user data
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userEmail = user?.email || "guest@example.com";

      // Create payment record
      const paymentData = {
        email: userEmail,
        service: packageName,
        amount: price,
        paymentId: `DZK-${Date.now()}`,
        status: "pending",
        qrCodeUrl: paymentMethod === "barcode" ? `barcode-${Date.now()}` : null,
      };

      // Save to database
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        setPaymentCompleted(true);
        // Refresh payment list if on dashboard
        window.dispatchEvent(new Event("paymentCompleted"));

        setTimeout(() => {
          onClose();
          setPaymentCompleted(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const paymentMethods = {
    barcode: {
      icon: Barcode,
      title: "Scan Barcode DzakCloud",
      description: "Scan barcode khusus perusahaan DzakCloud",
      details: (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg">
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded">
                <div className="text-center">
                  <Barcode className="w-32 h-32 text-gray-400 mx-auto" />
                  <p className="text-gray-500 mt-4 text-sm">DzakCloud Barcode</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              📱 Scan barcode di atas menggunakan aplikasi pembayaran mobile banking Anda
            </p>
          </div>
        </div>
      ),
    },
    bank: {
      icon: Building2,
      title: "Transfer Bank",
      description: "Transfer ke rekening bank DzakCloud",
      details: (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Bank</p>
              <div className="flex items-center justify-between bg-gray-900 rounded p-3">
                <p className="text-white font-semibold">BCA</p>
                <button
                  onClick={() => handleCopy("BCA")}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Nomor Rekening</p>
              <div className="flex items-center justify-between bg-gray-900 rounded p-3">
                <p className="text-white font-mono font-semibold">1234567890</p>
                <button
                  onClick={() => handleCopy("1234567890")}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Atas Nama</p>
              <div className="flex items-center justify-between bg-gray-900 rounded p-3">
                <p className="text-white font-semibold">PT Dzakwan Corp</p>
                <button
                  onClick={() => handleCopy("PT Dzakwan Corp")}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-4">
            <p className="text-sm text-yellow-300">
              ⚠️ Pastikan nominal transfer tepat: Rp {price.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      ),
    },
    ewallet: {
      icon: Smartphone,
      title: "E-Wallet",
      description: "Pembayaran via GCash, Dana, OVO, dll",
      details: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {["GCash", "Dana", "OVO", "DANA"].map((wallet) => (
              <button
                key={wallet}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg p-4 text-center transition-all"
              >
                <p className="text-white font-semibold">{wallet}</p>
                <p className="text-gray-400 text-xs mt-1">+62 123-456-7890</p>
              </button>
            ))}
          </div>

          <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              💳 Hubungi customer service untuk nomor e-wallet aktif
            </p>
          </div>
        </div>
      ),
    },
    credit_card: {
      icon: CreditCard,
      title: "Kartu Kredit",
      description: "Visa, Mastercard, American Express",
      details: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Nomor Kartu</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Berlaku Hingga</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Nama Pemegang Kartu</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-4">
            <p className="text-sm text-yellow-300">
              🔒 Pembayaran kartu kredit aman dan terenkripsi dengan standar internasional
            </p>
          </div>
        </div>
      ),
    },
  };

  const currentMethod = paymentMethods[paymentMethod];
  const Icon = currentMethod.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f1e] border border-blue-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-700/50 bg-[#0f0f1e]">
          <div>
            <h2 className="text-2xl font-bold text-white">Pembayaran</h2>
            <p className="text-gray-400 text-sm">Paket {packageName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentCompleted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Pembayaran Berhasil!</h3>
              <p className="text-gray-300 mb-4">
                Invoice akan dikirim ke email Anda dalam beberapa menit
              </p>
              <p className="text-2xl font-bold text-blue-400">Rp {price.toLocaleString("id-ID")}</p>
            </div>
          ) : (
            <>
              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-blue-600/20 to-blue-700/10 border border-blue-500/30 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">Total Pembayaran</p>
                    <p className="text-white text-sm">Paket {packageName}</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">
                    Rp {price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Pilih Metode Pembayaran</h3>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {(Object.keys(paymentMethods) as PaymentMethod[]).map((method) => {
                    const MethodIcon = paymentMethods[method].icon;
                    return (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-lg border transition-all text-left ${
                          paymentMethod === method
                            ? "bg-blue-600/30 border-blue-500 shadow-lg shadow-blue-500/20"
                            : "bg-gray-800/50 border-gray-700 hover:border-blue-500/50"
                        }`}
                      >
                        <MethodIcon className="w-5 h-5 mb-2" />
                        <p className="text-sm font-semibold text-white">
                          {paymentMethods[method].title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">
                  {currentMethod.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{currentMethod.description}</p>
                {currentMethod.details}
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePaymentSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all"
              >
                Konfirmasi Pembayaran
              </button>

              <p className="text-center text-gray-400 text-xs mt-4">
                Dengan klik tombol di atas, Anda setuju dengan Terms & Conditions kami
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
