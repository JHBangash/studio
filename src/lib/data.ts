export type Document = {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  uploader: {
    name: string;
    role: 'Employee' | 'Customer';
  };
  createdAt: string;
  updatedAt: string;
  workflow: {
    approver: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    date?: string;
  }[];
  auditTrail: {
    user: string;
    action: string;
    date: string;
    comment?: string;
  }[];
  metadata: Record<string, string>;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Employee' | 'Customer';
  avatar: string;
};

export const appUsers: User[] = [
  { id: 'user-001', name: 'Admin User', email: 'admin@nexus.com', password: 'password123', role: 'Admin', avatar: 'https://picsum.photos/seed/10/32/32' },
  { id: 'user-002', name: 'Alice Johnson', email: 'alice@nexus.com', password: 'password123', role: 'Employee', avatar: 'https://picsum.photos/seed/11/32/32' },
  { id: 'user-003', name: 'Client Portal', email: 'customer@client.com', password: 'password123', role: 'Customer', avatar: 'https://picsum.photos/seed/12/32/32' },
  { id: 'user-004', name: 'David Green', email: 'david@nexus.com', password: 'password123', role: 'Employee', avatar: 'https://picsum.photos/seed/13/32/32' },
];


export const documents: Document[] = [
  {
    id: 'DOC001',
    name: 'Q3_Vendor_Invoice_Acme.pdf',
    type: 'Invoice',
    status: 'pending',
    uploader: { name: 'Alice Johnson', role: 'Employee' },
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-26T11:30:00Z',
    workflow: [
      { approver: 'Bob Williams', role: 'Manager', status: 'approved', date: '2023-10-26T11:30:00Z' },
      { approver: 'Carol White', role: 'Finance Head', status: 'pending' },
    ],
    auditTrail: [
      { user: 'Bob Williams', action: 'Approved', date: '2023-10-26T11:30:00Z', comment: 'Looks good.' },
      { user: 'Alice Johnson', action: 'Created', date: '2023-10-26T10:00:00Z' },
    ],
    metadata: {
        "Vendor Name": "Acme Corp",
        "Date": "2023-10-20",
        "Amount": "5,450.00",
        "Invoice ID": "INV-2023-789"
    }
  },
  {
    id: 'DOC002',
    name: 'MSA_InnovateCorp.docx',
    type: 'Contract',
    status: 'approved',
    uploader: { name: 'David Green', role: 'Employee' },
    createdAt: '2023-10-25T14:00:00Z',
    updatedAt: '2023-10-27T09:00:00Z',
    workflow: [
      { approver: 'Eve Black', role: 'Legal Counsel', status: 'approved', date: '2023-10-26T16:00:00Z' },
      { approver: 'Frank Brown', role: 'COO', status: 'approved', date: '2023-10-27T09:00:00Z' },
    ],
    auditTrail: [
      { user: 'Frank Brown', action: 'Approved & Signed', date: '2023-10-27T09:00:00Z' },
      { user: 'Eve Black', action: 'Approved', date: '2023-10-26T16:00:00Z', comment: 'Terms are acceptable.' },
      { user: 'David Green', action: 'Created', date: '2023-10-25T14:00:00Z' },
    ],
     metadata: {
        "Client Name": "Innovate Corp",
        "Effective Date": "2023-11-01",
        "Term": "24 Months"
    }
  },
  {
    id: 'DOC003',
    name: 'Project_Alpha_Proposal.pdf',
    type: 'Proposal',
    status: 'rejected',
    uploader: { name: 'Client Portal', role: 'Customer' },
    createdAt: '2023-10-24T09:00:00Z',
    updatedAt: '2023-10-25T12:00:00Z',
    workflow: [
      { approver: 'Grace Blue', role: 'Project Manager', status: 'rejected', date: '2023-10-25T12:00:00Z' },
    ],
    auditTrail: [
      { user: 'Grace Blue', action: 'Rejected', date: '2023-10-25T12:00:00Z', comment: 'Budget exceeds allocated funds. Please revise.' },
      { user: 'Client Portal', action: 'Submitted', date: '2023-10-24T09:00:00Z' },
    ],
     metadata: {
        "Project Name": "Project Alpha",
        "Submitted By": "External Solutions Ltd.",
        "Proposed Budget": "150,000.00"
    }
  },
  {
    id: 'DOC004',
    name: 'Onboarding_Form_JSmith.pdf',
    type: 'HR Form',
    status: 'archived',
    uploader: { name: 'Hannah Red', role: 'Employee' },
    createdAt: '2023-09-15T11:00:00Z',
    updatedAt: '2023-09-15T11:00:00Z',
    workflow: [
      { approver: 'Hannah Red', role: 'HR Manager', status: 'approved', date: '2023-09-15T11:00:00Z' },
    ],
    auditTrail: [
      { user: 'Hannah Red', action: 'Archived', date: '2023-09-15T11:00:00Z' },
    ],
     metadata: {
        "Employee Name": "John Smith",
        "Start Date": "2023-10-01",
        "Department": "Engineering"
    }
  },
  {
    id: 'DOC005',
    name: 'Client_Brief_Project_Z.pdf',
    type: 'Brief',
    status: 'pending',
    uploader: { name: 'Client Portal', role: 'Customer' },
    createdAt: '2023-10-27T15:00:00Z',
    updatedAt: '2023-10-27T15:00:00Z',
    workflow: [
      { approver: 'David Green', role: 'Account Manager', status: 'pending' },
    ],
    auditTrail: [
      { user: 'Client Portal', action: 'Submitted', date: '2023-10-27T15:00:00Z' },
    ],
     metadata: {
        "Project Name": "Project Zeta",
        "Contact": "marketing@clientcorp.com",
        "Deadline": "2023-11-30"
    }
  },
  {
    id: 'DOC006',
    name: 'Q3_Marketing_Report.docx',
    type: 'Report',
    status: 'pending',
    uploader: { name: 'Ian Purple', role: 'Employee' },
    createdAt: '2023-10-28T11:00:00Z',
    updatedAt: '2023-10-28T11:00:00Z',
    workflow: [
        { approver: 'Bob Williams', role: 'Manager', status: 'pending' },
    ],
    auditTrail: [
      { user: 'Ian Purple', action: 'Created', date: '2023-10-28T11:00:00Z' },
    ],
     metadata: {
        "Quarter": "Q3 2023",
        "Department": "Marketing",
        "Author": "Ian Purple"
    }
  },
];
