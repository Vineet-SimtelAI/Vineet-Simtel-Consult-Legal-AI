import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Create Admin User ───
  const admin = await prisma.user.upsert({
    where: { email: 'admin@consultlegal.in' },
    update: {},
    create: {
      email: 'admin@consultlegal.in',
      name: 'Admin ConsultLegal',
      role: 'ADMIN',
      emailVerified: true,
      creditBalance: 9999,
    },
  });
  console.log(`✅ Admin user: ${admin.id}`);

  // ─── Create Demo User ───
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@consultlegal.in' },
    update: {},
    create: {
      email: 'demo@consultlegal.in',
      name: 'Demo User',
      role: 'USER',
      emailVerified: true,
      creditBalance: 25,
    },
  });
  console.log(`✅ Demo user: ${demoUser.id}`);

  // ─── Create Document Templates ───
  const templates = [
    {
      type: 'nda',
      name: 'Non-Disclosure Agreement',
      description: 'Protect confidential information shared between parties. Suitable for business discussions, partnerships, and employee onboarding.',
      category: 'corporate',
      price: 49900,
      creditsCost: 10,
      clauses: {
        available: [
          { name: 'Non-Disclosure', text: 'The Receiving Party shall not disclose any Confidential Information to any third party.', selected: true },
          { name: 'Non-Use', text: 'The Receiving Party shall use the Confidential Information solely for the Purpose.', selected: true },
          { name: 'Non-Competition', text: 'The Receiving Party shall not compete with the Disclosing Party using the Confidential Information.', selected: false },
          { name: 'Return of Information', text: 'Upon termination, the Receiving Party shall return all Confidential Information.', selected: true },
          { name: 'Injunctive Relief', text: 'The Disclosing Party shall be entitled to injunctive relief for any breach.', selected: false },
        ],
      },
      formSchema: {
        fields: [
          { name: 'partyA', label: 'Disclosing Party Name', type: 'text', required: true },
          { name: 'partyB', label: 'Receiving Party Name', type: 'text', required: true },
          { name: 'jurisdiction', label: 'Jurisdiction', type: 'select', options: ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana'], required: true },
          { name: 'duration', label: 'Duration (months)', type: 'number', required: true, default: 24 },
          { name: 'purpose', label: 'Purpose', type: 'textarea', required: true },
        ],
      },
    },
    {
      type: 'employment-agreement',
      name: 'Employment Agreement',
      description: 'Comprehensive employment contract covering job details, compensation, termination, and restrictive covenants under Indian labour law.',
      category: 'employment',
      price: 69900,
      creditsCost: 10,
      clauses: {
        available: [
          { name: 'Job Description', text: 'The Employee shall perform duties as assigned by the Employer.', selected: true },
          { name: 'Compensation', text: 'The Employee shall receive compensation as specified in Schedule A.', selected: true },
          { name: 'Non-Compete', text: 'The Employee shall not engage in competing activities for 12 months after termination.', selected: false },
          { name: 'Confidentiality', text: 'The Employee shall maintain confidentiality of all proprietary information.', selected: true },
          { name: 'Termination', text: 'Either party may terminate with 30 days written notice.', selected: true },
        ],
      },
      formSchema: {
        fields: [
          { name: 'employerName', label: 'Employer Name', type: 'text', required: true },
          { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
          { name: 'designation', label: 'Designation', type: 'text', required: true },
          { name: 'salary', label: 'Annual CTC (INR)', type: 'number', required: true },
          { name: 'startDate', label: 'Start Date', type: 'date', required: true },
          { name: 'probationMonths', label: 'Probation Period (months)', type: 'number', default: 6 },
        ],
      },
    },
    {
      type: 'service-agreement',
      name: 'Service Agreement',
      description: 'Contract between a service provider and client defining scope, deliverables, payment terms, and obligations under Indian Contract Act.',
      category: 'corporate',
      price: 59900,
      creditsCost: 10,
      clauses: {
        available: [
          { name: 'Scope of Services', text: 'The Service Provider shall deliver services as described in the Statement of Work.', selected: true },
          { name: 'Payment Terms', text: 'Client shall pay within 30 days of invoice receipt.', selected: true },
          { name: 'Intellectual Property', text: 'All deliverables shall be the property of the Client upon full payment.', selected: true },
          { name: 'Limitation of Liability', text: 'The Service Provider liability shall not exceed the total fees paid.', selected: false },
        ],
      },
      formSchema: {
        fields: [
          { name: 'providerName', label: 'Service Provider', type: 'text', required: true },
          { name: 'clientName', label: 'Client Name', type: 'text', required: true },
          { name: 'serviceDescription', label: 'Service Description', type: 'textarea', required: true },
          { name: 'fees', label: 'Total Fees (INR)', type: 'number', required: true },
          { name: 'duration', label: 'Contract Duration', type: 'text', required: true },
        ],
      },
    },
    {
      type: 'vendor-agreement',
      name: 'Vendor Agreement',
      description: 'Agreement for engaging vendors and suppliers with clear terms on delivery, quality, payment, and dispute resolution.',
      category: 'corporate',
      price: 49900,
      creditsCost: 10,
      clauses: { available: [] },
      formSchema: { fields: [] },
    },
    {
      type: 'consulting-agreement',
      name: 'Consulting Agreement',
      description: 'Professional consulting contract covering advisory services, deliverables, compensation, and confidentiality.',
      category: 'corporate',
      price: 49900,
      creditsCost: 10,
      clauses: { available: [] },
      formSchema: { fields: [] },
    },
    {
      type: 'partnership-agreement',
      name: 'Partnership Agreement',
      description: 'Partnership deed defining profit sharing, roles, responsibilities, and dissolution terms under Indian Partnership Act.',
      category: 'corporate',
      price: 79900,
      creditsCost: 10,
      clauses: { available: [] },
      formSchema: { fields: [] },
    },
  ];

  for (const template of templates) {
    await prisma.documentTemplate.upsert({
      where: { type: template.type },
      update: {},
      create: template as any,
    });
  }
  console.log(`✅ ${templates.length} document templates created`);

  // ─── Create Sample Lawyer Profiles ───
  const sampleLawyers = [
    {
      userId: demoUser.id,
      specializations: ['Corporate Law', 'Contract Law'],
      experience: 12,
      barCouncilNo: 'BCI/MH/2012/12345',
      licenseVerified: true,
      bio: 'Senior corporate lawyer with 12 years of experience in mergers, acquisitions, and contract negotiations. Based in Mumbai with a strong track record of helping startups and SMEs.',
      hourlyRate: 150000,
      rating: 4.8,
      totalReviews: 156,
      isAvailable: true,
      city: 'Mumbai',
      state: 'Maharashtra',
      languages: ['English', 'Hindi', 'Marathi'],
      kycStatus: 'verified',
      availability: { monday: ['09:00-12:00', '14:00-18:00'], tuesday: ['09:00-12:00', '14:00-18:00'], wednesday: ['09:00-12:00'], thursday: ['09:00-12:00', '14:00-18:00'], friday: ['09:00-12:00', '14:00-17:00'] },
    },
    {
      userId: admin.id,
      specializations: ['Employment Law', 'Labour Law'],
      experience: 8,
      licenseVerified: true,
      bio: 'Specialist in Indian employment and labour law. Expert in drafting employment agreements, handling workplace disputes, and ensuring compliance with labour regulations.',
      hourlyRate: 120000,
      rating: 4.6,
      totalReviews: 98,
      isAvailable: true,
      city: 'Delhi',
      state: 'Delhi',
      languages: ['English', 'Hindi'],
      kycStatus: 'verified',
      availability: { monday: ['10:00-13:00', '15:00-18:00'], tuesday: ['10:00-13:00'], wednesday: ['10:00-13:00', '15:00-18:00'], thursday: ['10:00-13:00'], friday: ['10:00-13:00', '15:00-17:00'] },
    },
  ];

  for (const lawyer of sampleLawyers) {
    await prisma.lawyerProfile.create({ data: lawyer as any });
  }
  console.log(`✅ ${sampleLawyers.length} sample lawyer profiles created`);

  // ─── Create Resource Articles ───
  const articles = [
    {
      slug: 'guide-to-nda-india',
      title: 'Complete Guide to Non-Disclosure Agreements in India',
      category: 'corporate',
      content: 'A comprehensive guide covering everything you need to know about NDAs under Indian law, including key clauses, enforceability, and best practices for protecting your confidential information.',
      excerpt: 'Learn how to draft, review, and enforce NDAs under Indian Contract Act, 1872.',
      readTime: 8,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      slug: 'employment-contract-essentials',
      title: 'Employment Contract Essentials for Indian Businesses',
      category: 'employment',
      content: 'Essential elements every employment contract must include under Indian labour law. Covers compensation, termination, non-compete, and compliance with Shops and Establishments Act.',
      excerpt: 'Key clauses and legal requirements for employment contracts in India.',
      readTime: 10,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      slug: 'startup-legal-checklist',
      title: 'Legal Checklist for Indian Startups',
      category: 'startup',
      content: 'A comprehensive legal checklist for startups in India covering company registration, compliance, IP protection, founder agreements, and fundraising legal requirements.',
      excerpt: 'Everything your startup needs to be legally compliant in India.',
      readTime: 12,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      slug: 'gst-compliance-guide',
      title: 'GST Compliance Guide for Small Businesses',
      category: 'tax',
      content: 'Understanding GST compliance requirements for small businesses in India, including registration, filing, returns, and common pitfalls to avoid.',
      excerpt: 'Navigate GST compliance with this practical guide for small businesses.',
      readTime: 6,
      isPublished: true,
      publishedAt: new Date(),
    },
  ];

  for (const article of articles) {
    await prisma.resourceArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
  console.log(`✅ ${articles.length} resource articles created`);

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
