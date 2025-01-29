export const dashboardPaths = {
  absolute: "/dashboard",
  relative: "",  // Keep this empty for the index route

  myNews: {
    absolute: "/dashboard/my-news",    // Add /dashboard prefix
    relative: "my-news",
  },

  newInvestment: {
    absolute: "/dashboard/new-investment",  // Add /dashboard prefix
    relative: "new-investment",
  },

  chatBot: {
    absolute: "/dashboard/chat-bot",    // Add /dashboard prefix
    relative: "chat-bot",
  },

  Recommendation: {
    absolute: "/dashboard/recommendation",    // Add /dashboard prefix
    relative: "recommendation",
  },

  About: {
    absolute: "/dashboard/about",    // Add /dashboard prefix
    relative: "about",
  },

  FAQ: {
    absolute: "/dashboard/faq",    // Add /dashboard prefix
    relative: "faq",
  },
  Contact: {
    absolute: "/dashboard/contact",    // Add /dashboard prefix
    relative: "contact",
  },
} as const;
