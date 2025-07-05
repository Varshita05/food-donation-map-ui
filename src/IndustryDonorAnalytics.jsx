import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";

// Dummy industry donors
const industryDonors = {
  "id1": { name: "ABC Canteen", type: "canteen" },
  "id2": { name: "XYZ Corp", type: "corporate" },
  "id3": { name: "NIT College", type: "college" },
};

// Dummy donation records
const donationRecords = [
  { industryDonorId: "id1", date: "2025-06-01", Quantity: 120, notes: "Monthly lunch" },
  { industryDonorId: "id2", date: "2025-06-05", Quantity: 200 },
  { industryDonorId: "id3", date: "2025-06-10", Quantity: 80, notes: "Seminar" },
  { industryDonorId: "id1", date: "2025-06-15", Quantity: 150 },
  { industryDonorId: "id2", date: "2025-06-20", Quantity: 100, notes: "Team event" },
];

const COLORS = ["#6366F1", "#34D399", "#F59E0B", "#F43F5E", "#60A5FA"];

export default function IndustryAnalyticsPage() {
  const totalByDonor = {};
  const totalByType = {};

  donationRecords.forEach(rec => {
    const donor = industryDonors[rec.industryDonorId] || { name: "Unknown", type: "other" };
    totalByDonor[donor.name] = (totalByDonor[donor.name] || 0) + rec.Quantity;
    totalByType[donor.type] = (totalByType[donor.type] || 0) + rec.Quantity;
  });

  const barData = Object.entries(totalByDonor).map(([name, Quantity]) => ({ name, Quantity }));
  const pieData = Object.entries(totalByType).map(([name, value]) => ({ name, value }));

  const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-xl font-bold text-center text-gray-800 mb-6">
        📈 Industry Donation Analytics — {month}
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart Card */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Donations by Organization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Quantity" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Donation Split by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Report Table */}
      <div className="mt-10 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📅 Monthly Report</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Organization</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Notes</th>
              </tr>
            </thead>
            <tbody>
              {donationRecords.map((rec, i) => {
                const donor = industryDonors[rec.industryDonorId] || {};
                return (
                  <tr key={i} className="border-t text-gray-600">
                    <td className="px-4 py-2 border">{new Date(rec.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{donor.name || "Unknown"}</td>
                    <td className="px-4 py-2 border capitalize">{donor.type || "other"}</td>
                    <td className="px-4 py-2 border">{rec.Quantity}</td>
                    <td className="px-4 py-2 border">{rec.notes || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
