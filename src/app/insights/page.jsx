"use client";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/components/firebase-config";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareIcon, UsersIcon, DatabaseIcon, LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const insightTypes = [
  { title: "Greeting", icon: MessageSquareIcon, key: "greeting_insights" },
  { title: "General", icon: UsersIcon, key: "general_insights" },
  { title: "User Data", icon: DatabaseIcon, key: "user_data_insights" },
  { title: "Connect", icon: LinkIcon, key: "connect_insights" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnimatedNumber = ({ value }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentValue((prev) => {
        if (prev >= value) {
          clearInterval(timer);
          return value;
        }
        return Math.min(prev + Math.ceil((value - prev) / 10), value);
      });
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{currentValue.toLocaleString()}</span>;
};

export default function AnalyticalInsightsPage() {
  const [apiKey, setApiKey] = useState("");
  const [insights, setInsights] = useState({
    greeting_insights: 0,
    general_insights: 0,
    user_data_insights: 0,
    connect_insights: 0,
  });
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setAnimate(false);

    try {
      const q = query(collection(db, "users"), where("api_key", "==", apiKey));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setInsights({
          greeting_insights: data.greeting_insights || 0,
          general_insights: data.general_insights || 0,
          user_data_insights: data.user_data_insights || 0,
          connect_insights: data.connect_insights || 0,
        });
      } else {
        alert("No data found for the provided API key.");
      }
    } catch (error) {
      console.error("Error fetching insights: ", error);
    }

    setLoading(false);
    setAnimate(true);
  };

  const totalInteractions = Object.values(insights).reduce((sum, value) => sum + value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-rose-50 text-gray-800">
      {/* Header Section */}
      <section className="px-4 py-24 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">
          Analytical Chatbot Insights
        </h1>
        <p className="mb-10 text-xl text-gray-600 max-w-2xl mx-auto">
          Dive deep into your AI chatbot's performance metrics
        </p>
        <div className="flex justify-center items-center space-x-4 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={fetchInsights}
            disabled={loading || !apiKey}
            className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
          >
            {loading ? "Loading..." : "Refresh Insights"}
          </Button>
        </div>
      </section>

      {/* Insights Grid */}
      <section className="px-4 py-12 bg-white">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {insightTypes.map((insight, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-white to-indigo-50 border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <CardHeader>
                <insight.icon className="w-12 h-12 mb-4 text-indigo-500" />
                <CardTitle className="text-xl font-semibold text-gray-800">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-indigo-600">
                  {animate ? <AnimatedNumber value={insights[insight.key]} /> : 0}
                </p>
                <p className="text-gray-600 mt-2">Interactions</p>
                <p className="text-sm text-gray-500 mt-1">
                  {totalInteractions > 0
                    ? `${((insights[insight.key] || 0) / totalInteractions * 100).toFixed(1)}% of total`
                    : "Calculating..."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pie Chart and Key Metrics */}
      <section className="px-4 py-12 bg-gradient-to-br from-indigo-50 to-rose-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Interaction Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insightTypes.map((insight) => ({
                    name: insight.title,
                    value: insights[insight.key] || 0,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {insightTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold">Total Interactions</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {animate ? <AnimatedNumber value={totalInteractions} /> : 0}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold">Most Common Interaction</p>
                <p className="text-xl font-medium text-indigo-600">
                  {Object.entries(insights).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                    .split("_")[0]
                    .charAt(0)
                    .toUpperCase() +
                    Object.entries(insights)
                      .reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                      .split("_")[0]
                      .slice(1)}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold">Least Common Interaction</p>
                <p className="text-xl font-medium text-indigo-600">
                  {Object.entries(insights).reduce((a, b) => (a[1] < b[1] ? a : b))[0]
                    .split("_")[0]
                    .charAt(0)
                    .toUpperCase() +
                    Object.entries(insights)
                      .reduce((a, b) => (a[1] < b[1] ? a : b))[0]
                      .split("_")[0]
                      .slice(1)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
