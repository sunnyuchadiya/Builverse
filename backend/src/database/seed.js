const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const Issue = require("../models/issue.model");
const logger = require("../utils/logger");

module.exports = async function autoSeedDatabase() {
  try {
    // 1. SEED DEFAULT USERS IF EMPTY
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("password123", salt);

      await User.create([
        {
          name: "Elias Thorne",
          email: "elias.thorne@buildverse.io",
          passwordHash,
          role: "admin",
        },
        {
          name: "Sarah Chen",
          email: "sarah@buildverse.io",
          passwordHash,
          role: "student",
        },
        {
          name: "Alex Chen",
          email: "alex@buildverse.io",
          passwordHash,
          role: "student",
        },
      ]);
      logger.info("MongoDB: Default users seeded successfully into BuildVerse database");
    }

    // 2. SEED DEFAULT PROJECTS IF EMPTY
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const defaultProjects = await Project.create([
        {
          name: "Mobile App Redesign",
          description: "Ultra smooth React Native mobile UI with MongoDB backend.",
          tag: "Active",
          progress: 85,
          status: "active",
        },
        {
          name: "MongoDB Express API",
          description: "Express.js Mongoose models & controllers for live data sync.",
          tag: "In Progress",
          progress: 60,
          status: "active",
        },
        {
          name: "Design System 2.0",
          description: "Component library with dark mode tokens and animation primitives.",
          tag: "Completed",
          progress: 100,
          status: "Completed",
        },
      ]);
      logger.info("MongoDB: Default projects seeded successfully into BuildVerse database");

      // 3. SEED DEFAULT ISSUES IF EMPTY
      const issueCount = await Issue.countDocuments();
      if (issueCount === 0 && defaultProjects.length > 0) {
        await Issue.create([
          {
            projectId: defaultProjects[0]._id,
            title: "Connect Mongoose schemas to React Native App",
            priority: "High",
            status: "In Progress",
            resolved: false,
          },
          {
            projectId: defaultProjects[0]._id,
            title: "Add offline data caching with AsyncStorage",
            priority: "Medium",
            status: "Completed",
            resolved: true,
            resolvedAt: new Date(),
          },
          {
            projectId: defaultProjects[1]._id,
            title: "Optimize MongoDB query indexing",
            priority: "High",
            status: "In Progress",
            resolved: false,
          },
          {
            projectId: defaultProjects[2]._id,
            title: "Publish npm package v2.4",
            priority: "Low",
            status: "Completed",
            resolved: true,
            resolvedAt: new Date(Date.now() - 86400000),
          },
        ]);
        logger.info("MongoDB: Default issues seeded successfully into BuildVerse database");
      }
    }
  } catch (err) {
    logger.warn("MongoDB Auto-seed Notice: " + err.message);
  }
};
