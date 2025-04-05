// filepath: /home/canahmet/Desktop/projects/musti_internetsitesi/backend/scripts/download-images.js
const fs = require("fs");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config.env" });

const About = require("../models/aboutModel");
const PracticeArea = require("../models/practiceAreaModel");

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/musti";

// Directory where images will be stored
const uploadDir = path.join(__dirname, "../public/uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Function to download an image from URL and save it locally
const downloadImage = (url, imageName) => {
  return new Promise((resolve, reject) => {
    const fileName = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${
      path.extname(imageName) || ".jpg"
    }`;
    const filePath = path.join(uploadDir, fileName);
    const file = fs.createWriteStream(filePath);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve(fileName); // Return just the filename, not the full path
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {}); // Delete the file if there was an error
        reject(err);
      });
  });
};

// Function to update team member images
const updateTeamMemberImages = async () => {
  console.log("Updating team member images...");

  try {
    const aboutData = await About.findOne();

    if (
      !aboutData ||
      !aboutData.teamMembers ||
      aboutData.teamMembers.length === 0
    ) {
      console.log("No team members found to update");
      return;
    }

    // Process each team member
    for (const member of aboutData.teamMembers) {
      if (member.image && member.image.startsWith("https://picsum.photos")) {
        try {
          console.log(`Downloading image for ${member.name}...`);
          const imageName = await downloadImage(
            member.image,
            "team-member.jpg"
          );

          // Update the member's image path in the database
          member.image = imageName; // Just store the filename

          console.log(`Updated image for ${member.name}: ${imageName}`);
        } catch (error) {
          console.error(`Error downloading image for ${member.name}:`, error);
        }
      }
    }

    // Save the updated about data
    await aboutData.save();
    console.log("Team member images updated successfully");
  } catch (error) {
    console.error("Error updating team member images:", error);
  }
};

// Function to update practice area images
const updatePracticeAreaImages = async () => {
  console.log("Updating practice area images...");

  try {
    const practiceAreas = await PracticeArea.find();

    if (!practiceAreas || practiceAreas.length === 0) {
      console.log("No practice areas found to update");
      return;
    }

    // Process each practice area
    for (const area of practiceAreas) {
      if (area.image && area.image.startsWith("https://")) {
        try {
          console.log(`Downloading image for ${area.title}...`);
          const imageName = await downloadImage(
            area.image,
            "practice-area.jpg"
          );

          // Update the practice area's image path in the database
          area.image = imageName; // Just store the filename

          await area.save();
          console.log(`Updated image for ${area.title}: ${imageName}`);
        } catch (error) {
          console.error(`Error downloading image for ${area.title}:`, error);
        }
      }
    }

    console.log("Practice area images updated successfully");
  } catch (error) {
    console.error("Error updating practice area images:", error);
  }
};

// Main function
async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Update team member images
    await updateTeamMemberImages();

    // Update practice area images
    await updatePracticeAreaImages();

    console.log("Image migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error in image migration:", error);
    process.exit(1);
  }
}

main();
