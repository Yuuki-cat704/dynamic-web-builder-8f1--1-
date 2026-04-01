import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import {
  User,
  LogOut,
  CreditCard,
  Settings,
  Smartphone,
  Lock,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowRight,
} from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface Payment {
  id: string;
  packageName: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
  invoiceId: string;
}

type TabType = "profile" | "payments" | "settings";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Fetch user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setFormData({ name: userData.name, email: userData.email });

    // Fetch payments from API
    fetchPayments();
    setLoading(false);

    // Listen for payment completed event
    const handlePaymentCompleted = () => {
      fetchPayments();
    };

    window.addEventListener("paymentCompleted", handlePaymentCompleted);
    return () => window.removeEventListener("paymentCompleted", handlePaymentCompleted);
  }, [navigate]);

  const fetchPayments = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const userData = JSON.parse(storedUser);
      const response = await fetch("/api/payments");
      if (response.ok) {
        const data = await response.json();
        // Get payments array - API returns { success, count, payments: [] }
        const allPayments = data.payments || [];

        // Filter payments for current user by email
        const userPayments = allPayments.filter((p: any) => p.email === userData.email);

        // Format payments for display
        const formattedPayments = userPayments.map((p: any) => ({
          id: p.paymentId || p.id,
          packageName: p.service || "Unknown Package",
          amount: p.amount || 0,
          status: (p.status || "pending") as "pending" | "completed" | "failed",
          date: p.createdAt || new Date().toISOString(),
          invoiceId: p.paymentId || p.id,
        }));

        setPayments(formattedPayments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updated = await response.json();
        localStorage.setItem("user", JSON.stringify(updated.user));
        setUser(updated.user);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: "profile" as TabType, label: "Profil", icon: User },
    { id: "payments" as TabType, label: "Pembayaran", icon: CreditCard },
    { id: "settings" as TabType, label: "Pengaturan", icon: Settings },
  ];

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
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Kelola profil dan pembayaran Anda</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-blue-500/30 rounded-xl p-4 sticky top-24">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-800/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/30 rounded-xl p-8">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 bg-blue-600/30 rounded-full flex items-center justify-center border border-blue-500/50">
                        <User className="w-10 h-10 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
                        <p className="text-gray-400">{user?.email}</p>
                      </div>
                    </div>

                    {!editMode ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-gray-400 text-sm mb-2">Nama Lengkap</p>
                            <p className="text-white font-semibold">{user?.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm mb-2">Email</p>
                            <p className="text-white font-semibold">{user?.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm mb-2">Member Sejak</p>
                            <p className="text-white font-semibold">
                              {new Date(user?.createdAt || "").toLocaleDateString("id-ID")}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm mb-2">Status Akun</p>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              <p className="text-white font-semibold">Aktif</p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setEditMode(true)}
                          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          Edit Profil
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Nama Lengkap</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Email</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handleSaveProfile}
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditMode(false)}
                            className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-lg p-6">
                      <CreditCard className="w-8 h-8 text-blue-400 mb-3" />
                      <p className="text-gray-400 text-sm">Total Pembayaran</p>
                      <p className="text-2xl font-bold text-white">
                        {payments.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-lg p-6">
                      <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
                      <p className="text-gray-400 text-sm">Pembayaran Sukses</p>
                      <p className="text-2xl font-bold text-white">
                        {payments.filter((p) => p.status === "completed").length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-lg p-6">
                      <Clock className="w-8 h-8 text-yellow-400 mb-3" />
                      <p className="text-gray-400 text-sm">Menunggu Konfirmasi</p>
                      <p className="text-2xl font-bold text-white">
                        {payments.filter((p) => p.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === "payments" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Riwayat Pembayaran</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 rounded-lg text-sm">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>

                  {payments.length === 0 ? (
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-xl p-12 text-center">
                      <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">Belum ada pembayaran</p>
                      <button
                        onClick={() => navigate("/pricing")}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Lihat Paket
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 hover:border-blue-500/30 rounded-lg p-6 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-600/30 rounded-lg flex items-center justify-center border border-blue-500/50">
                                <CreditCard className="w-6 h-6 text-blue-400" />
                              </div>
                              <div>
                                <p className="text-white font-semibold">{payment.packageName}</p>
                                <p className="text-gray-400 text-sm">
                                  Invoice #{payment.invoiceId}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-white font-bold text-lg">
                                Rp {payment.amount.toLocaleString("id-ID")}
                              </p>
                              <div className="flex items-center gap-2 justify-end mt-1">
                                {payment.status === "completed" && (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <p className="text-green-400 text-sm font-medium">Selesai</p>
                                  </>
                                )}
                                {payment.status === "pending" && (
                                  <>
                                    <Clock className="w-4 h-4 text-yellow-400" />
                                    <p className="text-yellow-400 text-sm font-medium">Menunggu</p>
                                  </>
                                )}
                                {payment.status === "failed" && (
                                  <>
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    <p className="text-red-400 text-sm font-medium">Gagal</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-gray-400 text-sm mt-4 pt-4 border-t border-gray-700/50">
                            <span>{new Date(payment.date).toLocaleDateString("id-ID")}</span>
                            <button className="text-blue-400 hover:text-blue-300 transition-colors">
                              Lihat Detail
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* Security Settings */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Lock className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-bold text-white">Keamanan</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-semibold">Password</p>
                          <p className="text-gray-400 text-sm">Ubah password akun Anda</p>
                        </div>
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                          Ubah
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-semibold">Two-Factor Authentication</p>
                          <p className="text-gray-400 text-sm">Tingkatkan keamanan akun Anda</p>
                        </div>
                        <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors">
                          Aktifkan
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Smartphone className="w-6 h-6 text-green-400" />
                      <h3 className="text-xl font-bold text-white">Notifikasi</h3>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                        <div className="flex-1">
                          <p className="text-white font-semibold">Email Notifikasi</p>
                          <p className="text-gray-400 text-sm">Terima notifikasi pembayaran via email</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                        <div className="flex-1">
                          <p className="text-white font-semibold">SMS Notifikasi</p>
                          <p className="text-gray-400 text-sm">Terima notifikasi pembayaran via SMS</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                        <div className="flex-1">
                          <p className="text-white font-semibold">Newsletter</p>
                          <p className="text-gray-400 text-sm">Terima promo dan update terbaru dari kami</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Contact Settings */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Mail className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">Kontak</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Email Alternatif</label>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Nomor Telepon</label>
                        <input
                          type="tel"
                          placeholder="+62 123-456-7890"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
