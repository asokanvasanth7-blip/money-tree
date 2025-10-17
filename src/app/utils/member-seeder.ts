import { inject } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

/**
 * Sample data seeding utility for testing the Members component
 * This is just for demonstration purposes
 */
export class MemberSeeder {
  private firestoreService = inject(FirestoreService);

  private sampleMembers = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      status: 'Active',
      joinedDate: new Date('2024-01-15')
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 234-5678',
      role: 'Manager',
      status: 'Active',
      joinedDate: new Date('2024-03-20')
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      phone: '+1 (555) 345-6789',
      role: 'Member',
      status: 'Active',
      joinedDate: new Date('2024-06-10')
    },
    {
      name: 'David Kim',
      email: 'david.kim@example.com',
      phone: '+1 (555) 456-7890',
      role: 'Member',
      status: 'Pending',
      joinedDate: new Date('2025-10-01')
    },
    {
      name: 'Jessica Williams',
      email: 'jessica.williams@example.com',
      phone: '+1 (555) 567-8901',
      role: 'Manager',
      status: 'Active',
      joinedDate: new Date('2024-08-15')
    },
    {
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      phone: '+1 (555) 678-9012',
      role: 'Member',
      status: 'Inactive',
      joinedDate: new Date('2023-12-05')
    }
  ];

  async seedMembers() {
    try {
      console.log('Seeding sample members...');
      for (const member of this.sampleMembers) {
        await this.firestoreService.addDocument('members', member);
      }
      console.log('✅ Sample members added successfully!');
    } catch (error) {
      console.error('Error seeding members:', error);
    }
  }
}

