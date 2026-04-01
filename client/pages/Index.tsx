import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Cloud, Shield, Zap, Users } from "lucide-react";
import { PRICING_PACKAGES } from "./Pricing";

export default function Index() {
  const navigate = useNavigate();

  const services = [
    {
      icon: Cloud,
      title: "Cloud Storage",
      description: "Penyimpanan data aman di cloud dengan enkripsi tingkat enterprise",
    },
    {
      icon: Shield,
      title: "Keamanan",
      description: "Proteksi data dengan sistem keamanan berlapis dan firewall modern",
    },
    {
      icon: Zap,
      title: "Performa Tinggi",
      description: "Kecepatan akses data yang optimal dengan server di berbagai lokasi",
    },
    {
      icon: Users,
      title: "Support 24/7",
      description: "Tim support profesional siap membantu Anda kapan saja",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e]">
      <Navigation />

      {/* Decorative background lines */}
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
          <path d="M 80 500 Q 280 400 480 500 T 880 500" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
          <path d="M 120 600 Q 320 500 520 600 T 920 600" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
          <path d="M 200 700 Q 400 600 600 700 T 1000 700" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto pt-20">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            DzakCloud For All
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            With our cloud services, users can enjoy their devices without worrying about storage,
            while maintaining a stable internet and easy access to servers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/pricing")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Buy Now →
            </button>
            <button
              onClick={() => navigate("/services")}
              className="border-2 border-gray-600 hover:border-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors hover:bg-gray-900/30"
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Introducing Company Section */}
      <div className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Tentang Dzakwan Corp
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Visi Kami</h3>
                <p className="text-gray-300 leading-relaxed">
                  Dzakwan Corp adalah sebuah perusahaan yang bergerak di bidang layanan teknologi informasi, khususnya penyedia solusi Cloud computing dan infrastruktur digital. Kami berdedikasi untuk memberikan solusi teknologi terdepan yang memenuhi kebutuhan digital masa kini.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Misi Kami</h3>
                <p className="text-gray-300 leading-relaxed">
                  Membantu individu, pelajar, startup, dan UMKM dalam memanfaatkan teknologi cloud secara efisien, aman, dan terjangkau. Kami percaya bahwa teknologi harus accessible untuk semua kalangan.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Didirikan Tahun 2026</h3>
                <p className="text-gray-300 leading-relaxed">
                  Logo Dzakwan Corp melambangkan stabilitas, keamanan, dan konektivitas dalam layanan teknologi. Bentuk lingkaran menunjukkan sistem berkelanjutan, sementara warna biru dan abu-abu merepresentasikan profesionalisme dan keandalan.
                </p>
              </div>
            </div>

            {/* Right Content - Logo/Icon */}
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-600/20 to-blue-700/10 rounded-full flex items-center justify-center border border-blue-500/30">
                <div className="text-center">
                  <Cloud className="w-32 h-32 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-300 font-semibold">Dzakwan Corp</p>
                  <p className="text-gray-400 text-sm">Cloud Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Layanan yang Kami Sediakan
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <Icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-white font-bold text-lg mb-3">{service.title}</h3>
                  <p className="text-gray-300 text-sm">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Paket Produk Kami
            </h2>
            <p className="text-gray-300 mb-6">Pilih paket yang sesuai dengan kebutuhan Anda</p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {PRICING_PACKAGES.slice(0, 3).map((pkg, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-gray-950 border border-blue-500/30 rounded-xl p-8 hover:border-blue-400/50 transition-all hover:shadow-lg hover:shadow-blue-500/20"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
                <div className="bg-blue-600/30 border border-blue-500/50 rounded-lg p-4 mb-6">
                  <p className="text-blue-300 font-bold text-xl">{pkg.specs}</p>
                </div>
                <p className="text-gray-300 mb-6">{pkg.description}</p>
                <div className="mb-6">
                  <p className="text-3xl font-bold text-blue-400">Rp {(pkg.price / 1000).toFixed(0)}K</p>
                  <p className="text-gray-400 text-sm">/bulan</p>
                </div>
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>

          {/* View All Packages Link */}
          <div className="text-center">
            <p className="text-gray-300 mb-4">Lihat paket lengkap dan Virtual Server kami</p>
            <button
              onClick={() => navigate("/pricing")}
              className="inline-block px-8 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 font-semibold rounded-lg transition-colors"
            >
              Lihat Semua Paket →
            </button>
          </div>
        </div>
      </div>

      {/* About Company Section */}
      <div className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Profil Perusahaan
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Identitas Perusahaan</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Nama:</strong> Dzakwan Corp</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Didirikan:</strong> Tahun 2026</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Bidang:</strong> Teknologi Informasi & Cloud Computing</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Target Market:</strong> Individu, Pelajar, Startup, UMKM</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Nilai Perusahaan</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span><strong>Stabilitas</strong> - Sistem yang konsisten dan reliable</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span><strong>Keamanan</strong> - Proteksi data tingkat enterprise</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span><strong>Konektivitas</strong> - Akses mudah dari mana saja</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span><strong>Affordability</strong> - Harga terjangkau untuk semua</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
