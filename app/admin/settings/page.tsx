import Header from "@/components/Header";
import { Settings } from "lucide-react";
import React from "react";

const AdminSettings = () => {
  const stats = [
    {
      title: "Settings",
      value: "20",
      icon: <Settings size={20} />,
    },
    {
      title: "Settings",
      value: "20",
      icon: <Settings size={20} />,
    },
    {
      title: "Settings",
      value: "20",
      icon: <Settings size={20} />,
    },
    {
      title: "Settings",
      value: "20",
      icon: <Settings size={20} />,
    },
  ];
  return (
    <div>
      <div>
        <Header title="Settings" stats={stats} />
      </div>
    </div>
  );
};

export default AdminSettings;
