import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans text-[#4E342E]">
      {/* Header */}
      <header className="bg-[#F57C00] text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">FoodBridge NGO</h1>
          <nav className="space-x-4">
            <button
              onClick={() => navigate("/volunteer-login")}
              className="bg-white text-[#F57C00] font-semibold px-4 py-2 rounded hover:bg-[#FFE0B2]"
            >
              Volunteer Login
            </button>
            <button
              onClick={() => navigate("/admin-login")}
              className="bg-white text-[#F57C00] font-semibold px-4 py-2 rounded hover:bg-[#FFE0B2]"
            >
              Admin Login
            </button>
            <button
              onClick={() => navigate("/donate")}
              className="bg-[#FB8C00] text-white font-semibold px-4 py-2 rounded hover:bg-[#FFB300]"
            >
              Donate Now
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#FFE0B2] py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#F57C00] mb-4">
            Fight Hunger With Warmth & Heart
          </h2>
          <p className="text-[#4E342E] max-w-2xl mx-auto text-lg">
            Join us in rescuing surplus food and delivering meals to those in
            need. Be the change — as a donor, a volunteer, or a guide.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-[#FFF3E0]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white border border-[#FFB300] rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-[#F57C00] mb-2">Volunteer</h3>
            <p>
              Deliver smiles with meals. Help nearby communities by responding to food requests.
            </p>
          </div>
          <div className="p-6 bg-white border border-[#F57C00] rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-[#FB8C00] mb-2">Donor</h3>
            <p>
              Share your surplus. Donate excess food or funds and make sure nothing goes to waste.
            </p>
          </div>
          <div className="p-6 bg-white border border-[#E65100] rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-[#E65100] mb-2">Admin</h3>
            <p>
              Manage pickups, volunteers, and requests through a powerful yet easy dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#E65100] text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} FoodBridge NGO. All rights reserved.</p>
      </footer>
    </div>
  );
}
