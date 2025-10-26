import React from "react";
import { RefreshCw, LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface StatCardData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  showRefresh?: boolean;
  stats?: StatCardData[];
  actions?: React.ReactNode;
}

const StatCard = ({ title, value, icon, trend }: StatCardData) => {
  return (
    <div className="bg-muted rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-primary">{value}</h3>
          {trend && (
            <p
              className={`text-sm mt-2 flex items-center gap-1 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              {trend.value}
            </p>
          )}
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">{icon}</div>
      </div>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  showRefresh = true,
  stats,
  actions,
}) => {
  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-md sm:text-xl md:text-2xl text-secondary mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {showRefresh && onRefresh && (
            <Button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          )}
          {actions}
        </div>
      </div>

      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            stats.length > 2 ? "lg:grid-cols-4" : "lg:grid-cols-" + stats.length
          } gap-6`}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
