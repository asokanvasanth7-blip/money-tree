import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { PdfExportService } from '../../services/pdf-export.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Member } from '../../models/member.model';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private pdfExportService = inject(PdfExportService);

  members$!: Observable<Member[]>;
  searchTerm = '';
  allMembers: Member[] = [];

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.members$ = this.firestoreService.getCollection<Member>('members').pipe(
      map(members => {
        this.allMembers = members.sort((a, b) => a.accountNumber - b.accountNumber);
        return this.allMembers;
      })
    );
  }

  exportSingleMember(member: Member) {
    this.pdfExportService.exportMemberReport(member);
  }

  exportAllMembers() {
    const filteredMembers = this.filterMembers(this.allMembers);
    if (filteredMembers.length > 0) {
      this.pdfExportService.exportAllMembersReport(filteredMembers);
    }
  }

  filterMembers(members: Member[]): Member[] {
    if (!this.searchTerm.trim()) {
      return members;
    }

    const search = this.searchTerm.toLowerCase().trim();
    return members.filter(member =>
      member.name.toLowerCase().includes(search) ||
      member.accountNumber.toString().includes(search)
    );
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getProgressPercentage(member: Member): number {
    if (member.loanTaken === 0) return 0;
    const percentage = (member.amountPaidInLoan / member.loanTaken) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  }

  getTotalDue(member: Member): number {
    const interestAmount = (member.loanTaken / 100) * 3;
    return member.monthlyDue + interestAmount;
  }

  getTotalDueClass(member: Member): string {
    const totalDue = this.getTotalDue(member);
    return totalDue > 1000 ? 'high-due' : 'paid';
  }

  getStatusClass(totalBalance: number): string {
    if (totalBalance === 0) return 'status-paid';
    if (totalBalance < 5000) return 'status-low';
    return 'status-active';
  }

  getRandomHeight(): number {
    // Generate random heights between 20% and 100% for chart bars
    return Math.floor(Math.random() * 80) + 20;
  }
}
