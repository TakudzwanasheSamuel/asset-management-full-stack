export interface Asset {
  id: string;
  name: string;
  type: 'Laptop' | 'Monitor' | 'Keyboard' | 'Mouse' | 'Phone' | 'Tablet' | 'Other';
  status: 'Available' | 'Checked Out' | 'Maintenance' | 'Retired';
  assignedTo?: string; // Employee ID
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  location: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  employeeId: string;
  avatar?: string;
  phoneNumber?: string;
  hireDate: Date;
  status: 'Active' | 'Inactive' | 'Terminated';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  assetId: string;
  assetName: string;
  employeeId: string;
  employeeName: string;
  type: 'Check-In' | 'Check-Out';
  date: Date;
  notes?: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  createdBy: string; // User ID
  createdAt: Date;
}
