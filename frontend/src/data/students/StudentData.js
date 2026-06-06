const students = [
  {
    id: "stu_1",
    name: "Aarav Sharma",
    track: "DSA Mastery",
    progress: 78,
    streak: 12,
    status: "On Track",
    lastSeen: "2h ago",
    submissions: { pending: 1, submitted: 2, reviewed: 6 },
  },
  {
    id: "stu_2",
    name: "Meera Kapoor",
    track: "Frontend Interview Prep",
    progress: 64,
    streak: 8,
    status: "Needs Support",
    lastSeen: "Today",
    submissions: { pending: 2, submitted: 1, reviewed: 5 },
  },
  {
    id: "stu_3",
    name: "Riya Nair",
    track: "System Design Fundamentals",
    progress: 84,
    streak: 16,
    status: "Ahead",
    lastSeen: "1h ago",
    submissions: { pending: 0, submitted: 3, reviewed: 8 },
  },
  {
    id: "stu_4",
    name: "Kabir Singh",
    track: "Backend with Node.js",
    progress: 57,
    streak: 5,
    status: "At Risk",
    lastSeen: "Yesterday",
    submissions: { pending: 3, submitted: 1, reviewed: 4 },
  },
];

export default students;
