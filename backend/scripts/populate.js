const mongoose = require('mongoose');
const User = require('../models/userModel');
const Client = require('../models/clientModel');
const Case = require('../models/caseModel');
const Appointment = require('../models/appointmentModel');
const Blog = require('../models/blogModel');
const Contact = require('../models/contactModel');
const PracticeArea = require('../models/practiceAreaModel');
const About = require('../models/aboutModel');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/musti';

// Sample data
const practiceAreas = [
  {
    title: 'Corporate Law',
    description: 'Expert legal solutions for businesses of all sizes',
    image: 'https://example.com/corporate-law.jpg',
    content: 'Our corporate law practice provides comprehensive legal services...',
    order: 1
  },
  {
    title: 'Family Law',
    description: 'Compassionate legal support for family matters',
    image: 'https://example.com/family-law.jpg',
    content: 'We handle divorce, custody, and other family legal matters...',
    order: 2
  },
  {
    title: 'Criminal Defense',
    description: 'Skilled defense in criminal cases',
    image: 'https://example.com/criminal-law.jpg',
    content: 'Our criminal defense team protects your rights...',
    order: 3
  }
];

const aboutData = {
  mission: 'To provide exceptional legal services with integrity and dedication',
  values: [
    'Integrity',
    'Excellence',
    'Client-Focused',
    'Professional',
    'Innovation'
  ],
  history: 'Founded in 2020, our firm has grown to become...',
  teamMembers: [
    {
      name: 'John Smith',
      title: 'Senior Partner',
      image: 'https://example.com/john-smith.jpg',
      description: '20 years of experience in corporate law',
      order: 1
    },
    {
      name: 'Sarah Johnson',
      title: 'Managing Partner',
      image: 'https://example.com/sarah-johnson.jpg',
      description: 'Specialist in family law',
      order: 2
    }
  ]
};

const lawyers = [
  {
    name: 'Michael Wilson',
    email: 'michael@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'lawyer'
  },
  {
    name: 'Emma Davis',
    email: 'emma@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'lawyer'
  }
];

const clients = [
  {
    firstName: 'James',
    lastName: 'Brown',
    email: 'james@example.com',
    phone: '123-456-7890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    firstName: 'Linda',
    lastName: 'Miller',
    email: 'linda@example.com',
    phone: '234-567-8901',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    }
  }
];

const cases = [
  {
    caseNumber: 'CASE-2025-001',
    title: 'Brown vs. Tech Corp',
    description: 'Employment discrimination case',
    caseType: 'labor',
    status: 'ongoing',
    priority: 'high'
  },
  {
    caseNumber: 'CASE-2025-002',
    title: 'Miller Property Dispute',
    description: 'Real estate boundary dispute',
    caseType: 'property',
    status: 'open',
    priority: 'medium'
  }
];

const appointments = [
  {
    title: 'Initial Consultation',
    description: 'First meeting to discuss case details',
    date: new Date('2025-04-01T10:00:00'),
    startTime: '10:00',
    endTime: '11:00',
    type: 'consultation',
    status: 'scheduled',
    location: 'Main Office'
  },
  {
    title: 'Document Review',
    description: 'Review case documents with client',
    date: new Date('2025-04-02T14:00:00'),
    startTime: '14:00',
    endTime: '15:00',
    type: 'meeting',
    status: 'scheduled',
    location: 'Main Office'
  }
];

const contacts = [
  {
    name: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '345-678-9012',
    subject: 'Business Consultation Request',
    message: 'Interested in discussing corporate legal services',
    status: 'new'
  },
  {
    name: 'Mary Williams',
    email: 'mary@example.com',
    phone: '456-789-0123',
    subject: 'Family Law Inquiry',
    message: 'Need assistance with divorce proceedings',
    status: 'new'
  }
];

const blogs = [
  {
    title: 'Understanding Corporate Law Basics',
    content: 'Corporate law is a complex field that involves...',
    summary: 'An overview of basic corporate law concepts',
    tags: ['corporate', 'business', 'legal'],
    status: 'published',
    publishedAt: new Date()
  },
  {
    title: 'Family Law: What You Need to Know',
    content: 'Family law matters require careful consideration...',
    summary: 'Essential information about family law proceedings',
    tags: ['family', 'divorce', 'custody'],
    status: 'published',
    publishedAt: new Date()
  }
];

// Function to populate the database
async function populateDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Client.deleteMany({}),
      Case.deleteMany({}),
      Appointment.deleteMany({}),
      Blog.deleteMany({}),
      Contact.deleteMany({}),
      PracticeArea.deleteMany({}),
      About.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create practice areas
    const createdPracticeAreas = await PracticeArea.create(practiceAreas);
    console.log('Created practice areas');

    // Create about content
    const createdAbout = await About.create(aboutData);
    console.log('Created about content');

    // Create lawyers
    const createdLawyers = await User.create(lawyers);
    console.log('Created lawyers');

    // Create clients with assigned lawyers
    const clientsWithLawyers = clients.map((client, index) => ({
      ...client,
      assignedLawyer: createdLawyers[index % createdLawyers.length]._id
    }));
    const createdClients = await Client.create(clientsWithLawyers);
    console.log('Created clients');

    // Create cases with clients and lawyers
    const casesWithRelations = cases.map((caseItem, index) => ({
      ...caseItem,
      client: createdClients[index % createdClients.length]._id,
      assignedLawyer: createdLawyers[index % createdLawyers.length]._id
    }));
    const createdCases = await Case.create(casesWithRelations);
    console.log('Created cases');

    // Create appointments with clients and lawyers
    const appointmentsWithRelations = appointments.map((appointment, index) => ({
      ...appointment,
      client: createdClients[index % createdClients.length]._id,
      lawyer: createdLawyers[index % createdLawyers.length]._id,
      caseId: createdCases[index % createdCases.length]._id
    }));
    await Appointment.create(appointmentsWithRelations);
    console.log('Created appointments');

    // Create contacts
    await Contact.create(contacts);
    console.log('Created contacts');

    // Create blogs with authors
    const blogsWithAuthors = blogs.map((blog, index) => ({
      ...blog,
      author: createdLawyers[index % createdLawyers.length]._id
    }));
    await Blog.create(blogsWithAuthors);
    console.log('Created blogs');

    console.log('Database successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

populateDatabase();