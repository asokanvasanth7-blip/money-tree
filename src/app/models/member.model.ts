import { Timestamp } from '@angular/fire/firestore';

export interface Member {
  accountNumber: number;
  amountPaidInLoan: number;
  createdAt: Timestamp;
  interestToLoan: number;
  interestToPrincipal: number;
  loanTaken: number;
  monthlyDue: number;
  name: string;
  principal: number;
  totalBalance: number;
  totalDue: number;
  updatedAt: Timestamp;
}

export class MemberModel implements Member {
  accountNumber: number;
  amountPaidInLoan: number;
  createdAt: Timestamp;
  interestToLoan: number;
  interestToPrincipal: number;
  loanTaken: number;
  monthlyDue: number;
  name: string;
  principal: number;
  totalBalance: number;
  totalDue: number;
  updatedAt: Timestamp;

  constructor(data: Partial<Member> = {}) {
    this.accountNumber = data.accountNumber || 0;
    this.amountPaidInLoan = data.amountPaidInLoan || 0;
    this.createdAt = data.createdAt || Timestamp.now();
    this.interestToLoan = data.interestToLoan || 0;
    this.interestToPrincipal = data.interestToPrincipal || 0;
    this.loanTaken = data.loanTaken || 0;
    this.monthlyDue = data.monthlyDue || 0;
    this.name = data.name || '';
    this.principal = data.principal || 0;
    this.totalBalance = data.totalBalance || 0;
    this.totalDue = data.totalDue || 0;
    this.updatedAt = data.updatedAt || Timestamp.now();
  }

  // Helper method to convert to plain object for Firestore
  toFirestore(): Omit<Member, 'id'> {
    return {
      accountNumber: this.accountNumber,
      amountPaidInLoan: this.amountPaidInLoan,
      createdAt: this.createdAt,
      interestToLoan: this.interestToLoan,
      interestToPrincipal: this.interestToPrincipal,
      loanTaken: this.loanTaken,
      monthlyDue: this.monthlyDue,
      name: this.name,
      principal: this.principal,
      totalBalance: this.totalBalance,
      totalDue: this.totalDue,
      updatedAt: this.updatedAt
    };
  }

  // Static method to create from Firestore data
  static fromFirestore(data: any): MemberModel {
    return new MemberModel(data);
  }
}

