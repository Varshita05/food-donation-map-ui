import React, { useState } from "react";

export default function IndustryDonorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    latitude: "",
    longitude: "",
    type: "",
    notes: "",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === "checkbox" ? checked : value,
    }));
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
      },
      (err) => {
        alert("⚠️ Unable to fetch location. Please allow permission.");
        console.error(err);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.latitude || !formData.longitude || !formData.type) {
      alert("❗ Name, Latitude, Longitude, and Type are required.");
      return;
    }

    try {
      const response = await fetch("https://example.com/api/industry-donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Industry donor registered successfully!");
        setFormData({
          name: "",
          contactPerson: "",
          phone: "",
          email: "",
          address: "",
          latitude: "",
          longitude: "",
          type: "",
          notes: "",
          isActive: true,
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ Could not submit the form.");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 text-[#3E2723] font-sans p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-lg border border-orange-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-700">🏭 Industry Donor Registration</h2>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="* Organization Name"
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="Contact Person"
            className="border border-gray-300 p-3 rounded"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border border-gray-300 p-3 rounded"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 p-3 rounded"
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="border border-gray-300 p-3 rounded"
          />

          <div className="flex gap-4">
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="* Latitude"
              className="border border-gray-300 p-3 rounded w-1/2"
            />
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="* Longitude"
              className="border border-gray-300 p-3 rounded w-1/2"
            />
          </div>
          <button
            type="button"
            onClick={getLocation}
            className="text-sm text-white underline w-fit center"
          >
            📍 Auto-fill Current Location
          </button>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded"
          >
            <option value="">* Select Donor Type</option>
            <option value="hospital">Hospital</option>
            <option value="college">College</option>
            <option value="canteen">Canteen</option>
            <option value="corporate">Corporate</option>
            <option value="other">Other</option>
          </select>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes (optional)"
            className="border border-gray-300 p-3 rounded"
            rows={3}
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="accent-orange-600"
            />
            <span>Active Donor</span>
          </label>

          <button
            type="submit"
            className="bg-orange-600 text-white py-3 px-6 rounded hover:bg-orange-700 transition"
          >
            🚀 Register Donor
          </button>
        </form>
      </div>
    </div>
  );
}
