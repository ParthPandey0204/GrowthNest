const messageThreads = [
  {
    id: "thread_1",
    name: "Aarav Sharma",
    role: "Learner - DSA Mastery",
    status: "Needs Reply",
    lastActive: "5m ago",
    unreadCount: 2,
    accent: "from-amber-400 to-orange-500",
    messages: [
      {
        id: "msg_1",
        sender: "Aarav",
        type: "received",
        time: "09:12",
        text: "I finished the binary tree assignment, but I am still struggling with recursion depth in the follow-up problem.",
      },
      {
        id: "msg_2",
        sender: "You",
        type: "sent",
        time: "09:18",
        text: "Nice work getting through the assignment. Share the follow-up problem and I will help you break it down.",
      },
      {
        id: "msg_3",
        sender: "Aarav",
        type: "received",
        time: "09:21",
        text: "Can we also review how to choose between DFS recursion and iterative traversal in interviews?",
      },
    ],
  },
  {
    id: "thread_2",
    name: "Meera Kapoor",
    role: "Learner - Frontend Interview Prep",
    status: "Active",
    lastActive: "18m ago",
    unreadCount: 0,
    accent: "from-sky-400 to-cyan-500",
    messages: [
      {
        id: "msg_4",
        sender: "Meera",
        type: "received",
        time: "08:02",
        text: "The portfolio feedback from yesterday helped a lot. I updated the hero section and case studies.",
      },
      {
        id: "msg_5",
        sender: "You",
        type: "sent",
        time: "08:16",
        text: "Amazing. Push the latest build and I will review spacing and narrative flow before tonight.",
      },
    ],
  },
  {
    id: "thread_3",
    name: "System Design Cohort",
    role: "Group Channel - 14 members",
    status: "Planning",
    lastActive: "1h ago",
    unreadCount: 4,
    accent: "from-violet-400 to-fuchsia-500",
    messages: [
      {
        id: "msg_6",
        sender: "Riya",
        type: "received",
        time: "Yesterday",
        text: "Can the next session include a quick section on API gateway tradeoffs?",
      },
      {
        id: "msg_7",
        sender: "You",
        type: "sent",
        time: "Yesterday",
        text: "Yes. I will add that to the agenda and share a prep checklist before the session.",
      },
    ],
  },
];

export default messageThreads;
