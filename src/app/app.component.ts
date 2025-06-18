// backlog.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMoringaSmartTableComponent } from './ng-moringa-table/ng-moringa-table.component';







@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgMoringaSmartTableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
statusMap = {
  scheduled: 'success',
  inprogress: 'info',
  converted: 'success',
  pending: 'warning',
  confirmed: 'info',
  completed: 'success',
  failed: 'danger',
  cancelled: 'danger',
  lost: 'danger',
  backlog: 'light',
  active: 'success',
  inactive: 'default',
  deleted: 'danger',
  rejected: 'danger',
  new: 'primary',
  closed: 'secondary'
};

data = [
// START OF 50 DUMMY LEADS
{
  profileImage: 'assets/dp1.jpg',
  name: 'Brandon Mcgee',
  source: 'Website',
  email: 'joshuacollins@hotmail.com',
  phone: '001-189-115-9038x67576',
  organization: 'BrightFuture',
  status: 'archived',
  assignedTo: 'Emma',
  tags: 'Support, App Dev',
  createdAt: '2025-02-12'
  
},
  {
    profileImage: 'assets/dp2.jpg',
    name: 'Nicole Bond',
    source: 'LinkedIn',
    email: 'kelly80@hotmail.com',
    phone: '302.875.6860x7837',
    organization: 'EcoSolutions',
    status: 'archived',
    assignedTo: 'Michael',
    tags: 'CRM, Development',
    createdAt: '2025-01-02'
  },
  {
    profileImage: 'assets/dp3.jpg',
    name: 'Darryl Moran',
    source: 'Website',
    email: 'mary78@yahoo.com',
    phone: '1757237165',
    organization: 'InnoHub',
    status: 'active',
    assignedTo: 'Emma',
    tags: 'App Dev, Marketing',
    createdAt: '2025-02-08'
  },
  {
    profileImage: 'assets/dp4.jpg',
    name: 'Ronald Roth',
    source: 'Website',
    email: 'bwalters@hotmail.com',
    phone: '001-633-626-1002x496',
    organization: 'NextGen',
    status: 'lost',
    assignedTo: 'Lily',
    tags: 'Development, SMM',
    createdAt: '2025-02-05'
  },
  {
    profileImage: 'assets/dp5.jpg',
    name: 'Robert Harris',
    source: 'Instagram',
    email: 'antoniomoss@wilson.org',
    phone: '6957607961',
    organization: 'NextGen',
    status: 'active',
    assignedTo: 'John',
    tags: 'UI/UX, Support',
    createdAt: '2025-02-09'
  },
  {
    profileImage: 'assets/dp6.jpg',
    name: 'Sara Lin',
    source: 'Referral',
    email: 'saralin@mail.com',
    phone: '790-234-8899',
    organization: 'TechNova',
    status: 'pending',
    assignedTo: 'Ali',
    tags: 'Web Design, CRM',
    createdAt: '2025-01-16'
  },
  {
    profileImage: 'assets/dp7.jpg',
    name: 'James Lee',
    source: 'Facebook Ads',
    email: 'jameslee@domain.com',
    phone: '234-980-1234',
    organization: 'MedTech',
    status: 'active',
    assignedTo: 'Emma',
    tags: 'SEO, QA',
    createdAt: '2025-02-07'
  },
  {
    profileImage: 'assets/dp8.jpg',
    name: 'Emily Clark',
    source: 'Instagram',
    email: 'emilyc@example.com',
    phone: '845-772-1111',
    organization: 'InnoHub',
    status: 'archived',
    assignedTo: 'Michael',
    tags: 'App Dev, Support',
    createdAt: '2025-01-21'
  },
  {
    profileImage: 'assets/dp9.jpg',
    name: 'Daniel Ray',
    source: 'LinkedIn',
    email: 'danielray@company.org',
    phone: '765-390-8899',
    organization: 'NextGen',
    status: 'lost',
    assignedTo: 'Sara',
    tags: 'CRM, Development',
    createdAt: '2025-02-04'
  },
  {
    profileImage: 'assets/dp10.jpg',
    name: 'Monica Jain',
    source: 'Website',
    email: 'monicaj@webmail.net',
    phone: '540-209-7765',
    organization: 'BrightFuture',
    status: 'pending',
    assignedTo: 'Lily',
    tags: 'UI/UX, QA',
    createdAt: '2025-01-12'
  }
];
}
