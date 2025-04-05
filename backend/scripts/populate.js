const mongoose = require("mongoose");
const User = require("../models/userModel");
const Client = require("../models/clientModel");
const Case = require("../models/caseModel");
const Appointment = require("../models/appointmentModel");
const Blog = require("../models/blogModel");
const Contact = require("../models/contactModel");
const PracticeArea = require("../models/practiceAreaModel");
const About = require("../models/aboutModel");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/musti";

// Sample data
const practiceAreas = [
  {
    title: "Corporate Law",
    description: "Expert legal solutions for businesses of all sizes",
    image: "https://picsum.photos/200",
    content:
      "Our corporate law practice provides comprehensive legal services including business formation, mergers and acquisitions, corporate governance, compliance, commercial contracts, and complex business transactions. With decades of combined experience, our attorneys help businesses navigate legal challenges and capitalize on opportunities in today's complex regulatory environment.",
    order: 1,
  },
  {
    title: "Family Law",
    description: "Compassionate legal support for family matters",
    image: "https://picsum.photos/200",
    content:
      "We handle divorce, custody, child support, spousal maintenance, adoption, and other family legal matters with sensitivity and expertise. Our family law attorneys understand the emotional complexity of these cases and strive to achieve resolutions that protect your interests and the well-being of your family members.",
    order: 2,
  },
  {
    title: "Criminal Defense",
    description: "Skilled defense in criminal cases",
    image: "https://picsum.photos/200",
    content:
      "Our criminal defense team protects your rights throughout the legal process, from arrest through trial and appeal. We handle misdemeanors, felonies, white-collar crimes, drug offenses, DUI/DWI cases, and more. Every client receives a vigorous defense and personalized attention regardless of the charges they face.",
    order: 3,
  },
  {
    title: "Real Estate Law",
    description: "Comprehensive real estate legal services",
    image: "https://picsum.photos/200",
    content:
      "Our real estate practice covers residential and commercial transactions, landlord-tenant disputes, zoning issues, land use planning, property development, and real estate litigation. We represent buyers, sellers, developers, landlords, tenants, and financial institutions in all aspects of real estate law.",
    order: 4,
  },
  {
    title: "Personal Injury",
    description: "Fighting for fair compensation for injury victims",
    image: "https://picsum.photos/200",
    content:
      "If you've been injured due to someone else's negligence, our personal injury attorneys will help you secure the compensation you deserve. We handle auto accidents, slip and falls, medical malpractice, product liability, workplace injuries, and wrongful death cases, working on a contingency fee basis.",
    order: 5,
  },
];

const aboutData = {
  mission:
    "To provide exceptional legal services with integrity and dedication, ensuring that every client receives personalized attention and effective representation.",
  values: [
    "Integrity - We adhere to the highest ethical standards in all our actions",
    "Excellence - We strive for perfection in every legal service we provide",
    "Client-Focused - We put our clients' needs and interests above all else",
    "Professional - We maintain the highest level of professionalism in all interactions",
    "Innovation - We embrace creative solutions to complex legal challenges",
  ],
  history:
    "Founded in 2020, our firm has grown to become a trusted legal partner for individuals and businesses throughout the region. What began as a small practice with three dedicated attorneys has evolved into a comprehensive legal service provider with expertise across multiple practice areas. Throughout our growth, we have maintained our commitment to personalized service and exceptional results for every client.",
  teamMembers: [
    {
      name: "John Smith",
      title: "Senior Partner",
      image: "https://picsum.photos/200",
      description:
        "20 years of experience in corporate law with a focus on mergers and acquisitions. John has successfully negotiated over 100 major corporate transactions and is recognized as a leader in the field.",
      order: 1,
    },
    {
      name: "Sarah Johnson",
      title: "Managing Partner",
      image: "https://picsum.photos/200",
      description:
        "Specialist in family law with 15 years of experience representing clients in complex divorce and custody matters. Sarah is known for her compassionate approach and strong advocacy skills.",
      order: 2,
    },
    {
      name: "David Chen",
      title: "Partner",
      image: "https://picsum.photos/200",
      description:
        "Criminal defense attorney with 12 years of experience and over 50 jury trials. David specializes in complex felony cases and has secured numerous acquittals and favorable plea agreements.",
      order: 3,
    },
    {
      name: "Maria Rodriguez",
      title: "Associate Attorney",
      image: "https://picsum.photos/200",
      description:
        "Real estate law specialist with 8 years of experience in commercial and residential transactions. Maria has handled property deals valued at over $100 million throughout her career.",
      order: 4,
    },
  ],
};

const lawyers = [
  {
    name: "Michael Wilson",
    email: "michael@example.com",
    password: "password123",
    passwordConfirm: "password123",
    role: "lawyer",
  },
  {
    name: "Emma Davis",
    email: "emma@example.com",
    password: "password123",
    passwordConfirm: "password123",
    role: "lawyer",
  },
];

const clients = [
  {
    firstName: "James",
    lastName: "Brown",
    email: "james@example.com",
    phone: "123-456-7890",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  },
  {
    firstName: "Linda",
    lastName: "Miller",
    email: "linda@example.com",
    phone: "234-567-8901",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
  },
];

const cases = [
  {
    caseNumber: "CASE-2025-001",
    title: "Brown vs. Tech Corp",
    description: "Employment discrimination case",
    caseType: "labor",
    status: "ongoing",
    priority: "high",
  },
  {
    caseNumber: "CASE-2025-002",
    title: "Miller Property Dispute",
    description: "Real estate boundary dispute",
    caseType: "property",
    status: "open",
    priority: "medium",
  },
];

const appointments = [
  {
    title: "Initial Consultation",
    description: "First meeting to discuss case details",
    date: new Date("2025-04-01T10:00:00"),
    startTime: "10:00",
    endTime: "11:00",
    type: "consultation",
    status: "scheduled",
    location: "Main Office",
  },
  {
    title: "Document Review",
    description: "Review case documents with client",
    date: new Date("2025-04-02T14:00:00"),
    startTime: "14:00",
    endTime: "15:00",
    type: "meeting",
    status: "scheduled",
    location: "Main Office",
  },
];

const contacts = [
  {
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "345-678-9012",
    subject: "Business Consultation Request",
    message: "Interested in discussing corporate legal services",
    status: "new",
  },
  {
    name: "Mary Williams",
    email: "mary@example.com",
    phone: "456-789-0123",
    subject: "Family Law Inquiry",
    message: "Need assistance with divorce proceedings",
    status: "new",
  },
];

const blogs = [
  {
    title: "Understanding Corporate Law Basics",
    content: "Corporate law is a complex field that involves...",
    summary: "An overview of basic corporate law concepts",
    tags: ["corporate", "business", "legal"],
    status: "published",
    publishedAt: new Date(),
  },
  {
    title: "Family Law: What You Need to Know",
    content: "Family law matters require careful consideration...",
    summary: "Essential information about family law proceedings",
    tags: ["family", "divorce", "custody"],
    status: "published",
    publishedAt: new Date(),
  },
];

// Function to populate the database
async function populateDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Client.deleteMany({}),
      Case.deleteMany({}),
      Appointment.deleteMany({}),
      Blog.deleteMany({}),
      Contact.deleteMany({}),
      PracticeArea.deleteMany({}),
      About.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // Create practice areas
    const createdPracticeAreas = await PracticeArea.create(practiceAreas);
    console.log("Created practice areas");

    // Create about content
    const createdAbout = await About.create(aboutData);
    console.log("Created about content");

    // Create lawyers
    const createdLawyers = await User.create(lawyers);
    console.log("Created lawyers");

    // Create clients with assigned lawyers
    const clientsWithLawyers = clients.map((client, index) => ({
      ...client,
      assignedLawyer: createdLawyers[index % createdLawyers.length]._id,
    }));
    const createdClients = await Client.create(clientsWithLawyers);
    console.log("Created clients");

    // Create cases with clients and lawyers
    const casesWithRelations = cases.map((caseItem, index) => ({
      ...caseItem,
      client: createdClients[index % createdClients.length]._id,
      assignedLawyer: createdLawyers[index % createdLawyers.length]._id,
    }));
    const createdCases = await Case.create(casesWithRelations);
    console.log("Created cases");

    // Create appointments with clients and lawyers
    const appointmentsWithRelations = appointments.map(
      (appointment, index) => ({
        ...appointment,
        client: createdClients[index % createdClients.length]._id,
        lawyer: createdLawyers[index % createdLawyers.length]._id,
        caseId: createdCases[index % createdCases.length]._id,
      })
    );
    await Appointment.create(appointmentsWithRelations);
    console.log("Created appointments");

    // Create contacts
    await Contact.create(contacts);
    console.log("Created contacts");

    // Create blogs with authors
    const blogsWithAuthors = blogs.map((blog, index) => ({
      ...blog,
      author: createdLawyers[index % createdLawyers.length]._id,
    }));
    await Blog.create(blogsWithAuthors);
    console.log("Created blogs");

    console.log("Database successfully populated!");
    process.exit(0);
  } catch (error) {
    console.error("Error populating database:", error);
    process.exit(1);
  }
}

populateDatabase();
