import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    subject: "",
    description: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const topics = [
    "General Inquiry",
    "Technical Support",
    "Billing",
    "Partnership",
    "Feedback",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      // Validate form
      if (
        !formData.name ||
        !formData.email ||
        !formData.topic ||
        !formData.subject ||
        !formData.description
      ) {
        setStatus("error");
        setMessage("Please fill in all fields.");
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setStatus("error");
        setMessage("Please enter a valid email address.");
        return;
      }

      // Submit to API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        setStatus("error");
        setMessage("Server error. Please try again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      setStatus("success");
      setMessage("Thank you for contacting us! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        topic: "",
        subject: "",
        description: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Messages */}
      {status === "success" && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-green-300">{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300">{message}</p>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          className="w-full bg-blue-600/20 border border-blue-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-blue-600/30 transition-all"
        />
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full bg-blue-600/20 border border-blue-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-blue-600/30 transition-all"
        />
      </div>

      {/* Topic Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Topic
        </label>
        <select
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className="w-full bg-blue-600/20 border border-blue-500/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:bg-blue-600/30 transition-all appearance-none cursor-pointer"
        >
          <option value="">Select a topic...</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What is this about?"
          className="w-full bg-blue-600/20 border border-blue-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-blue-600/30 transition-all"
        />
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Full Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tell us more about your inquiry..."
          rows={6}
          className="w-full bg-blue-600/20 border border-blue-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-blue-600/30 transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
