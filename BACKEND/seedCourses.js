const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const URI = process.env.URI; // Ensure your .env file has the correct URI
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const courses = [
  {
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals of computer science and programming.",
    modules: [
      {
        id: "cs_module1",
        title: "Introduction to CS",
        description: "Welcome to the course!",
        content: "<h2>Welcome!</h2><p>This is the first module covering basic concepts of Computer Science.</p>",
        status: "not-started",
        progress: 0,
        quiz: true
      },
      {
        id: "cs_module2",
        title: "Advanced CS Concepts",
        description: "Dive deeper into computer science topics.",
        content: "<h2>Advanced Concepts</h2><p>Let's explore more complex topics like algorithms and data structures.</p>",
        status: "not-started",
        progress: 0,
        quiz: true
      }
    ]
  },
  {
    title: "Data Analysis Fundamentals",
    description: "Master the basics of data analysis and visualization.",
    modules: [
      {
        id: "da_module1",
        title: "Getting Started with Data Analysis",
        description: "Introduction to data analysis techniques.",
        content: "<h2>Data Analysis Basics</h2><p>Start here to understand data collection and cleaning.</p>",
        status: "not-started",
        progress: 0,
        quiz: true
      }
    ]
  },
  {
    title: "Project Management Essentials",
    description: "Learn essential project management skills and methodologies.",
    modules: [
      {
        id: "pm_module1",
        title: "Project Planning",
        description: "How to plan a project effectively.",
        content: "<h2>Planning Your Project</h2><p>This module covers project scope, timelines, and resource allocation.</p>",
        status: "not-started",
        progress: 0,
        quiz: true
      },
      {
        id: "pm_module2",
        title: "Risk Management",
        description: "Identifying and mitigating project risks.",
        content: "<h2>Managing Risks</h2><p>Learn to identify potential risks and plan responses.</p>",
        status: "not-started",
        progress: 0,
        quiz: true
      }
    ]
  },
  {
    title: "Business Communication",
    description: "Develop effective business communication skills.",
    modules: [
      {
        id: "bc_module1",
        title: "Effective Writing",
        description: "Crafting clear and concise business documents.",
        content: "<h2>Writing for Business</h2><p>Learn techniques for professional emails, reports, and presentations.</p>",
        status: "not-started",
        progress: 0,
        quiz: true
      }
    ]
  },
  {
    title: "Digital Marketing Basics",
    description: "Learn the fundamentals of digital marketing and online advertising.",
    modules: [
      {
        id: "dm_module1",
        title: "Introduction to Digital Marketing",
        description: "Understanding the digital marketing landscape.",
        content: "<h2>Digital Marketing Overview</h2><p>Covering SEO, SEM, social media, and content marketing.</p>",
        status: "not-started",
        progress: 0,
        quiz: true
      }
    ]
  },
  {
    title: "Cybersecurity Awareness",
    description: "Understand basic cybersecurity principles and best practices.",
    modules: [
      {
        id: "cy_module1",
        title: "Cyber Threats and Protection",
        description: "Identifying common cyber threats and how to protect against them.",
        content: "<h2>Staying Safe Online</h2><p>Learn about phishing, malware, and strong password practices.</p>",
        status: "not-started",
        progress: 0,
        quiz: true
      }
    ]
  }
];

async function seed() {
  try {
    await client.connect();
    const db = client.db("SD_DB");
    const collection = db.collection("courses");

    console.log("Clearing old courses...");
    await collection.deleteMany({});

    console.log("Inserting new courses...");
    await collection.insertMany(courses);

    console.log(`${courses.length} courses inserted successfully!`);
  } catch (err) {
    console.error("Error inserting courses:", err);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

seed(); 