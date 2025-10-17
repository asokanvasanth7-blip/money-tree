import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  exportMemberReport(member: Member) {
    const doc = new jsPDF();
    this.generateMemberInvoice(doc, member);
    doc.save(`Member_${member.accountNumber}_${member.name.replace(/\s/g, '_')}.pdf`);
  }

  exportAllMembersReport(members: Member[]) {
    const doc = new jsPDF();

    members.forEach((member, index) => {
      if (index > 0) {
        doc.addPage();
      }
      this.generateMemberInvoice(doc, member);
    });

    doc.save(`All_Members_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private generateMemberInvoice(doc: jsPDF, member: Member) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header - Dark Blue Background
    doc.setFillColor(30, 58, 102); // Dark blue
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Company Logo/Icon placeholder (white square with border)
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 12, 15, 15, 'F');
    doc.setDrawColor(30, 58, 102);
    doc.setLineWidth(2);
    doc.rect(15, 12, 15, 15, 'S');

    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('MONEY TREE', 35, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('FUND MANAGEMENT SYSTEM', 35, 26);

    // Contact Info (Right side)
    doc.setFontSize(8);
    const rightX = pageWidth - 15;
    doc.text('+91 8973576694', rightX, 15, { align: 'right' });
    doc.text('www.sangathi.in', rightX, 21, { align: 'right' });
    doc.text('info@sangathi.in', rightX, 27, { align: 'right' });

    // Golden Wave Design
    doc.setFillColor(255, 193, 7); // Gold/Yellow
    const waveStartY = 45;
    const waveHeight = 12;
    doc.moveTo(0, waveStartY);

    // Create smooth wave curve
    for (let x = 0; x <= pageWidth; x += 1) {
      const y = waveStartY + Math.sin((x / pageWidth) * Math.PI * 4) * 4 + 4;
      doc.lineTo(x, y);
    }
    doc.lineTo(pageWidth, waveStartY + waveHeight);
    doc.lineTo(0, waveStartY + waveHeight);
    doc.fill();

    // INVOICE Title - Left aligned to avoid overlap
    doc.setTextColor(255, 193, 7); // Gold
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth / 2, 75, { align: 'center' });

    // Member Details Box (Left)
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE TO:', 15, 92);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(member.name, 15, 102);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Account: ${member.accountNumber.toString().padStart(4, '0')}`, 15, 109);
    doc.text(`Phone: +91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`, 15, 115);
    doc.text(`Email: member${member.accountNumber}@sangathi.in`, 15, 121);

    // Invoice Info (Right Box)
    const invoiceDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice #:', pageWidth - 65, 92);
    doc.text('Account:', pageWidth - 65, 102);
    doc.text('Date:', pageWidth - 65, 112);

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`INV-${new Date().getFullYear()}-${member.accountNumber.toString().padStart(4, '0')}`, pageWidth - 15, 92, { align: 'right' });
    doc.text(member.accountNumber.toString().padStart(4, '0'), pageWidth - 15, 102, { align: 'right' });
    doc.text(invoiceDate, pageWidth - 15, 112, { align: 'right' });

    // Table with member financial details
    const tableStartY = 135;

    // Calculate values
    const interestAmount = member.loanTaken * 0.03;
    const subtotal = member.monthlyDue + interestAmount;

    autoTable(doc, {
      startY: tableStartY,
      head: [['NO.', 'ITEM DESCRIPTION', 'PRICE', 'QTY', 'TOTAL']],
      body: [
        ['01', 'Principal Amount', `${member.principal.toLocaleString('en-IN')}`, '1', `${member.principal.toLocaleString('en-IN')}`],
        ['02', 'Loan Amount Outstanding', `${member.loanTaken.toLocaleString('en-IN')}`, '1', `${member.loanTaken.toLocaleString('en-IN')}`],
        ['03', 'Monthly Due Payment', `${member.monthlyDue.toLocaleString('en-IN')}`, '1', `${member.monthlyDue.toLocaleString('en-IN')}`],
        ['04', 'Interest (3% per month)', `${interestAmount.toLocaleString('en-IN')}`, '1', `${interestAmount.toLocaleString('en-IN')}`],
        ['05', 'Amount Paid in Loan', `${member.amountPaidInLoan.toLocaleString('en-IN')}`, '1', `${member.amountPaidInLoan.toLocaleString('en-IN')}`],
        ['06', 'Interest Applied to Loan', `${member.interestToLoan.toLocaleString('en-IN')}`, '1', `${member.interestToLoan.toLocaleString('en-IN')}`],
      ],
      headStyles: {
        fillColor: [255, 193, 7], // Gold
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
        cellPadding: 4
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [50, 50, 50],
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      columnStyles: {
        0: { cellWidth: 18, halign: 'center' },
        1: { cellWidth: 70 },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 18, halign: 'center' },
        4: { cellWidth: 38, halign: 'right' }
      },
      margin: { left: 15, right: 15 }
    });

    // Get the Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY + 12;

    // Payment Info Box (Left)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Info:', 15, finalY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text('Account: 1234567890', 15, finalY + 7);
    doc.text('IFSC: MONY0001234', 15, finalY + 13);
    doc.text('Bank: Money Tree Bank Ltd.', 15, finalY + 19);
    doc.text('', 15, finalY + 25);

    // Summary Box (Right)
    const summaryX = 120;

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SUB TOTAL:', summaryX, finalY + 2);
    doc.text('TAX:', summaryX, finalY + 12);

    doc.setFont('helvetica', 'bold');
    doc.text(`${subtotal.toLocaleString('en-IN')}`, pageWidth - 15, finalY + 2, { align: 'right' });
    doc.text('0.00%', pageWidth - 15, finalY + 12, { align: 'right' });

    // Total Box (Yellow background)
    doc.setFillColor(255, 193, 7); // Gold
    doc.roundedRect(summaryX - 3, finalY + 18, pageWidth - summaryX - 12, 12, 2, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', summaryX + 2, finalY + 26);
    doc.setFontSize(13);
    doc.text(`${subtotal.toLocaleString('en-IN')}`, pageWidth - 15, finalY + 26, { align: 'right' });

    // Thank you message with gold background
    doc.setFillColor(255, 193, 7);
    doc.roundedRect(15, finalY + 38, 140, 12, 2, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('THANK YOU FOR FUNDING WITH US', 20, finalY + 46);

    // Footer note
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper.', 15, finalY + 58);
    doc.text('Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis.', 15, finalY + 63);

    // Page border (optional, subtle)
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  }
}
