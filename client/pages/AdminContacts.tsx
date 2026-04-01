import { useState, useEffect } from "react";
import { Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  topic: string;
  subject: string;
  description: string;
  status: "new" | "in_progress" | "resolved";
  createdAt: string;
  notes: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/contacts/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (response.ok) {
        setContacts(contacts.filter((c) => c.id !== id));
        setSelectedContact(null);
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedContacts = contacts.map((c) =>
          c.id === id ? { ...c, status: newStatus as any } : c
        );
        setContacts(updatedContacts);
        if (selectedContact?.id === id) {
          setSelectedContact({
            ...selectedContact,
            status: newStatus as any,
          });
        }
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-400" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-300";
      case "in_progress":
        return "bg-blue-500/10 border-blue-500/30 text-blue-300";
      case "resolved":
        return "bg-green-500/10 border-green-500/30 text-green-300";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Contact Dashboard</h1>
          <p className="text-gray-400">Manage and track customer inquiries</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "text-gray-400" },
            { label: "New", value: stats.new, color: "text-yellow-400" },
            { label: "In Progress", value: stats.inProgress, color: "text-blue-400" },
            { label: "Resolved", value: stats.resolved, color: "text-green-400" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4"
            >
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contacts List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">Recent Messages</h2>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : contacts.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No contacts yet</div>
              ) : (
                <div className="divide-y divide-gray-700/50">
                  {contacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`w-full p-4 text-left hover:bg-gray-700/20 transition-colors ${
                        selectedContact?.id === contact.id
                          ? "bg-blue-600/20 border-l-2 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(contact.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-medium truncate">
                              {contact.name}
                            </p>
                            <span className="text-xs text-gray-400">
                              {contact.topic}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 truncate">
                            {contact.subject}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-1">
            {selectedContact ? (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Details</h3>
                  <button
                    onClick={() => handleDeleteContact(selectedContact.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Name</p>
                    <p className="text-white font-medium">{selectedContact.name}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {selectedContact.email}
                    </a>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Topic</p>
                    <p className="text-white">{selectedContact.topic}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Status</p>
                    <select
                      value={selectedContact.status}
                      onChange={(e) =>
                        handleStatusChange(selectedContact.id, e.target.value)
                      }
                      className={`w-full p-2 rounded border text-sm font-medium cursor-pointer ${getStatusColor(
                        selectedContact.status
                      )}`}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Submitted</p>
                    <p className="text-gray-300 text-sm">
                      {new Date(selectedContact.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="border-t border-gray-700/50 pt-4">
                    <p className="text-gray-400 text-sm mb-2">Message</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedContact.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 text-center text-gray-400">
                <p>Select a contact to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
