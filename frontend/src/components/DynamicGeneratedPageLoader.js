// src/components/DynamicGeneratedPageLoader.js

import React from "react";
import { useParams } from "react-router-dom";

const DynamicGeneratedPageLoader = () => {
  const { pageName } = useParams();

  try {
    const PageComponent = require(`../pages/generated/${pageName}.js`).default;
    return <PageComponent />;
  } catch (error) {
    console.error("❌ Failed to load generated page:", error);
    return <div className="p-6 text-red-600">Page not found: {pageName}</div>;
  }
};

export default DynamicGeneratedPageLoader;
