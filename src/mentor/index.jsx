import React, { useState } from "react";
import MentorLayout from "./MentorLayout";
import MentorOverview from "./MentorOverview";
import MentorMentees from "./MentorMentees";
import MentorCourses from "./MentorCourses";

export default function MentorModule() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <MentorOverview setActiveTab={setActiveTab} />;
      case "mentees":
        return <MentorMentees />;
      case "courses":
        return <MentorCourses />;
      default:
        return <MentorOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <MentorLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTabContent()}
    </MentorLayout>
  );
}
