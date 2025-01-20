// export const dashboardPaths = {
//   // absolute: "/",
//   // relative: "",
//   absolute: "/dashboard",  
//   relative: "", 

//   myNews: {
//     absolute: "/my-news",
//     relative: "my-news",
//   },

//   portfolio: {
//     absolute: "/portfolio",
//     relative: "portfolio",
//   },

//   newInvestment: {
//     absolute: "/new-investment",
//     relative: "new-investment",
//   },

//   chatBot: {
//     absolute: "/chat-bot",
//     relative: "chat-bot",
//   },
// } as const;

export const dashboardPaths = {
  absolute: "/dashboard",
  relative: "",  // Keep this empty for the index route

  myNews: {
    absolute: "/dashboard/my-news",    // Add /dashboard prefix
    relative: "my-news",
  },

  portfolio: {
    absolute: "/dashboard/portfolio",   // Add /dashboard prefix
    relative: "portfolio",
  },

  newInvestment: {
    absolute: "/dashboard/new-investment",  // Add /dashboard prefix
    relative: "new-investment",
  },

  chatBot: {
    absolute: "/dashboard/chat-bot",    // Add /dashboard prefix
    relative: "chat-bot",
  },
} as const;
