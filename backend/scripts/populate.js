const mongoose = require('mongoose');
const User = require('../models/userModel');
const Client = require('../models/clientModel');
const Case = require('../models/caseModel');
const Appointment = require('../models/appointmentModel');
const Blog = require('../models/blogModel');
const PracticeArea = require('../models/practiceAreaModel');
const About = require('../models/aboutModel');
const Contact = require('../models/contactModel');

const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

const DB = process.env.DATABASE_LOCAL || 'mongodb://mongodb:27017/lawyer-website';

// Connect to database
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB connection successful for populating data!'));

// Sample data
const practiceAreas = [
  {
    title: 'Corporate Law',
    description: 'Expert legal services for businesses of all sizes',
    image: 'https://example.com/corporate-law.jpg',
    content: '<p>Our corporate law practice provides comprehensive legal services...</p>',
    order: 1
  },
  {
    title: 'Family Law',
    description: 'Compassionate legal support for family matters',
    image: 'https://example.com/family-law.jpg',
    content: '<p>We handle divorce, custody, and other family legal matters...</p>',
    order: 2
  },
  {
    title: 'Criminal Defense',
    description: 'Strong defense for criminal cases',
    image: 'https://example.com/criminal-law.jpg',
    content: '<p>Experienced criminal defense attorneys protecting your rights...</p>',
    order: 3
  }
];

const lawyers = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'lawyer'
  },
  {
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'lawyer'
  }
];

const clients = [
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    phone: '555-0101',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Davis',
    email: 'sarah.davis@example.com',
    phone: '555-0102',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    }
  }
];

const aboutData = {
  mission: 'To provide exceptional legal services with integrity and dedication to our clients.',
  values: [
    'Integrity',
    'Excellence',
    'Client-Focused',
    'Innovation',
    'Teamwork'
  ],
  history: 'Founded in 2000, our law firm has been serving clients for over two decades...',
  teamMembers: [
    {
      name: 'Robert Wilson',
      title: 'Senior Partner',
      image: 'https://example.com/robert.jpg',
      description: 'Over 20 years of experience in corporate law',
      order: 1
    },
    {
      name: 'Patricia Moore',
      title: 'Managing Partner',
      image: 'https://example.com/patricia.jpg',
      description: 'Specializes in family law and mediation',
      order: 2
    }
  ]
};

const contacts = [
  {
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '555-0103',
    subject: 'Corporate Law Inquiry',
    message: 'I need assistance with company registration...',
    status: 'new'
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    phone: '555-0104',
    subject: 'Family Law Consultation',
    message: 'Seeking advice regarding divorce proceedings...',
    status: 'in-progress'
  }
];

// Function to populate the database
const populateDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Client.deleteMany();
    await Case.deleteMany();
    await Appointment.deleteMany();
    await Blog.deleteMany();
    await PracticeArea.deleteMany();
    await About.deleteMany();
    await Contact.deleteMany();

    console.log('Cleared existing data');

    // Create practice areas
    const createdPracticeAreas = await PracticeArea.create(practiceAreas);
    console.log('Created practice areas');

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

    // Create cases
    const cases = [
      {
        caseNumber: 'CASE-2025-001',
        title: 'Corporate Merger Consultation',
        description: 'Advising on merger between two tech companies',
        caseType: 'corporate',
        status: 'ongoing',
        client: createdClients[0]._id,
        assignedLawyer: createdLawyers[0]._id,
        courtDetails: {
          name: 'Superior Court',
          location: 'New York',
          caseNumber: 'SC-2025-123'
        },
        priority: 'high'
      },
      {
        caseNumber: 'CASE-2025-002',
        title: 'Family Dispute Resolution',
        description: 'Handling divorce and custody arrangement',
        caseType: 'family',
        status: 'pending',
        client: createdClients[1]._id,
        assignedLawyer: createdLawyers[1]._id,
        courtDetails: {
          name: 'Family Court',
          location: 'Los Angeles',
          caseNumber: 'FC-2025-456'
        },
        priority: 'medium'
      }
    ];
    const createdCases = await Case.create(cases);
    console.log('Created cases');

    // Create appointments
    const appointments = [
      {
        title: 'Initial Consultation',
        description: 'First meeting to discuss merger details',
        date: new Date('2025-04-01T10:00:00'),
        startTime: '10:00',
        endTime: '11:00',
        client: createdClients[0]._id,
        lawyer: createdLawyers[0]._id,
        caseId: createdCases[0]._id,
        type: 'consultation',
        status: 'scheduled'
      },
      {
        title: 'Mediation Session',
        description: 'Family dispute mediation',
        date: new Date('2025-04-02T14:00:00'),
        startTime: '14:00',
        endTime: '15:30',
        client: createdClients[1]._id,
        lawyer: createdLawyers[1]._id,
        caseId: createdCases[1]._id,
        type: 'meeting',
        status: 'scheduled'
      }
    ];
    await Appointment.create(appointments);
    console.log('Created appointments');

    // Create about content
    await About.create(aboutData);
    console.log('Created about content');

    // Create contacts with assigned lawyers
    const contactsWithLawyers = contacts.map((contact, index) => ({
      ...contact,
      assignedTo: createdLawyers[index % createdLawyers.length]._id
    }));
    await Contact.create(contactsWithLawyers);
    console.log('Created contacts');

    // Create blog posts
    const blogs = [
      {
        title: 'Understanding Corporate Mergers',
        content: '<p>A comprehensive guide to corporate merger processes...</p>',
        summary: 'Learn about the key aspects of corporate mergers',
        author: createdLawyers[0]._id,
        tags: ['corporate', 'mergers', 'business'],
        status: 'published',
        publishedAt: new Date()
      },
      {
        title: 'Family Law Updates 2025',
        content: '<p>Recent changes in family law and their implications...</p>',
        summary: 'Stay updated with the latest family law changes',
        author: createdLawyers[1]._id,
        tags: ['family-law', 'legal-updates'],
        status: 'published',
        publishedAt: new Date()
      }
    ];
    await Blog.create(blogs);
    console.log('Created blog posts');

    console.log('Database successfully populated!');
    process.exit();
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
};

populateDB();