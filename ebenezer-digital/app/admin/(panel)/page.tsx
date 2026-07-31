"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";

interface Stats {
  totalInquiries: number;
  newInquiries: number;
  pendingReplies: number;
  thisMonth: number;
  publishedServices: number;
  publishedPortfolio: number;
  publishedTestimonials: number;
}

interface InquiryTrend {
  date: string;
  count: number;
}

interface RecentInquiry {
  id: string;
  name: string;
  email: string;
  service: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "in-progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  replied: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  closed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<InquiryTrend[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setTrend(data.inquiriesTrend);
        setRecentInquiries(data.recentInquiries);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Inquiries",
      value: stats?.totalInquiries || 0,
      icon: MessageSquare,
      trend: "+12%",
      trendUp: true,
      color: "blue",
    },
    {
      title: "New This Month",
      value: stats?.thisMonth || 0,
      icon: TrendingUp,
      trend: "+5%",
      trendUp: true,
      color: "emerald",
    },
    {
      title: "Pending Replies",
      value: stats?.pendingReplies || 0,
      icon: Clock,
      trend: "-2%",
      trendUp: false,
      color: "amber",
    },
    {
      title: "Closed",
      value: (stats?.totalInquiries || 0) - (stats?.newInquiries || 0),
      icon: CheckCircle,
      trend: "+8%",
      trendUp: true,
      color: "purple",
    },
  ];

  const quickActions = [
    { label: "New Blog Post", href: "/admin/blog/new", color: "bg-brand-500" },
    { label: "View Inquiries", href: "/admin/inquiries", color: "bg-blue-500" },
    { label: "Update Services", href: "/admin/services", color: "bg-purple-500" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your business.
          </p>
        </div>
        <div className="flex gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-2 px-4 py-2 ${action.color} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity`}
            >
              <Plus className="w-4 h-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  stat.trendUp ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stat.trendUp ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6">
            Inquiries Trend (Last 30 Days)
          </h2>
          <div className="h-64 flex items-end gap-2">
            {trend.map((day, index) => {
              const maxCount = Math.max(...trend.map((d) => d.count), 1);
              const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <div
                    className="w-full bg-brand-500/20 rounded-t-sm relative overflow-hidden"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-brand-500 transition-all duration-300 group-hover:bg-brand-400"
                      style={{ height: "100%" }}
                    />
                  </div>
                  {index % 5 === 0 && (
                    <span className="text-xs text-slate-500">
                      {new Date(day.date).getDate()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentInquiries.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No recent inquiries</p>
            ) : (
              recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50"
                >
                  <div>
                    <p className="font-medium text-white text-sm">{inquiry.name}</p>
                    <p className="text-xs text-slate-500">{inquiry.email}</p>
                    <p className="text-xs text-slate-400 mt-1 capitalize">
                      {inquiry.service}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      statusColors[inquiry.status] || statusColors.new
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Content Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid sm:grid-cols-3 gap-6"
      >
        {[
          {
            label: "Published Services",
            value: stats?.publishedServices || 0,
            href: "/admin/services",
          },
          {
            label: "Portfolio Items",
            value: stats?.publishedPortfolio || 0,
            href: "/admin/portfolio",
          },
          {
            label: "Testimonials",
            value: stats?.publishedTestimonials || 0,
            href: "/admin/testimonials",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-brand-500/30 transition-colors group"
          >
            <p className="text-slate-400 text-sm">{item.label}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-white">{item.value}</p>
              <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-brand-400 transition-colors" />
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
