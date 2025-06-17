// backlog.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTableComponent } from './smart-table/smart-table.component';





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,  SmartTableComponent],
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
 
  profileTile: 'assets/dp11.jpg',
  name: 'Nina Khan',
  source: 'Healthcare',
  email: 'nina.khan@example.com',
  phone: '+1-800-8449306',
  company: 'DesignPros',
  status: 'backlog',
  assigned_to: 'John',
  services: 'UI/UX, Digital Marketing',
  date: '2025-01-29'
},
{

  profileTile: 'assets/dp12.jpg',
  name: 'Zara Brown',
  source: 'Instagram',
  email: 'zara.brown@example.com',
  phone: '+1-800-8567497',
  company: 'BrightFuture',
  status: 'pending',
  assigned_to: 'John',
  services: 'SEO, UI/UX',
  date: '2025-01-30'
},
{
  
  profileTile: 'assets/dp13.jpg',
  name: 'Alex Lee',
  source: 'Facebook Ads',
  email: 'alex.lee@example.com',
  phone: '+1-800-1576742',
  company: 'DesignPros',
  status: 'backlog',
  assigned_to: 'John',
  services: 'App Development, Website Redesign',
  date: '2025-01-31'
},
{

  profileTile: 'assets/dp14.jpg',
  name: 'Alex Smith',
  source: 'Web base',
  email: 'alex.smith@example.com',
  phone: '+1-800-2519592',
  company: 'BrightFuture',
  status: 'backlog',
  assigned_to: 'Zain',
  services: 'Digital Marketing, Healthcare CRM',
  date: '2025-02-01'
},
{
  
  profileTile: 'assets/dp15.jpg',
  name: 'Ava Khan',
  source: 'Facebook Ads',
  email: 'ava.khan@example.com',
  phone: '+1-800-1644568',
  company: 'BrightFuture',
  status: 'lost',
  assigned_to: 'Ali',
  services: 'Healthcare CRM, Web Design',
  date: '2025-02-02'
},
{
  
  profileTile: 'assets/dp16.jpg',
  name: 'Sophia Brown',
  source: 'Facebook Ads',
  email: 'sophia.brown@example.com',
  phone: '+1-800-6085736',
  company: 'DesignPros',
  status: 'backlog',
  assigned_to: 'Lily',
  services: 'Content Marketing, SMM',
  date: '2025-02-03'
},
{
  
  profileTile: 'assets/dp17.jpg',
  name: 'Zara Brown',
  source: 'Web base',
  email: 'zara.brown@example.com',
  phone: '+1-800-2219191',
  company: 'GrowthHub',
  status: 'backlog',
  assigned_to: 'Sophia',
  services: 'Lead Generation, Content Marketing',
  date: '2025-02-04'
},
{
  
  profileTile: 'assets/dp18.jpg',
  name: 'Tom Khan',
  source: 'Facebook Ads',
  email: 'tom.khan@example.com',
  phone: '+1-800-2778150',
  company: 'GrowthHub',
  status: 'backlog',
  assigned_to: 'Emma',
  services: 'UI/UX, SMM',
  date: '2025-02-05'
},
{
 
  profileTile: 'assets/dp19.jpg',
  name: 'Sophia Brown',
  source: 'Facebook Ads',
  email: 'sophia.brown@example.com',
  phone: '+1-800-6613969',
  company: 'MedTech',
  status: 'backlog',
  assigned_to: 'John',
  services: 'UI/UX, SEO',
  date: '2025-02-06'
},
{
  
  profileTile: 'assets/dp20.jpg',
  name: 'Noah Garcia',
  source: 'Healthcare',
  email: 'noah.garcia@example.com',
  phone: '+1-800-3831938',
  company: 'GrowthHub',
  status: 'backlog',
  assigned_to: 'Michael',
  services: 'Content Marketing, SEO',
  date: '2025-02-07'
},
{
  
  profileTile: 'assets/dp21.jpg',
  name: 'Alex Smith',
  source: 'Healthcare',
  email: 'alex.smith@example.com',
  phone: '+1-800-7118213',
  company: 'BrightFuture',
  status: 'backlog',
  assigned_to: 'Sophia',
  services: 'Healthcare CRM, SEO',
  date: '2025-02-08'
},
{
  
  profileTile: 'assets/dp22.jpg',
  name: 'Zara Khan',
  source: 'Web base',
  email: 'zara.khan@example.com',
  phone: '+1-800-8685602',
  company: 'TechWave',
  status: 'pending',
  assigned_to: 'Ali',
  services: 'Content Marketing, Web Design',
  date: '2025-02-09'
},
{
  
  profileTile: 'assets/dp23.jpg',
  name: 'Sophia Brown',
  source: 'Facebook Ads',
  email: 'sophia.brown@example.com',
  phone: '+1-800-9522966',
  company: 'GrowthHub',
  status: 'backlog',
  assigned_to: 'Michael',
  services: 'UI/UX, SMM',
  date: '2025-02-10'
},
{

  profileTile: 'assets/dp24.jpg',
  name: 'Jack Smith',
  source: 'Web base',
  email: 'jack.smith@example.com',
  phone: '+1-800-6413423',
  company: 'MedTech',
  status: 'backlog',
  assigned_to: 'John',
  services: 'Website Redesign, Digital Marketing',
  date: '2025-02-11'
},
{

  profileTile: 'assets/dp25.jpg',
  name: 'Ava Khan',
  source: 'Mobile App',
  email: 'ava.khan@example.com',
  phone: '+1-800-9058391',
  company: 'BrightFuture',
  status: 'backlog',
  assigned_to: 'Lily',
  services: 'SEO, Web Design',
  date: '2025-02-12'
},
{

  profileTile: 'assets/dp26.jpg',
  name: 'Nina Garcia',
  source: 'Web base',
  email: 'nina.garcia@example.com',
  phone: '+1-800-7709872',
  company: 'EcoSolutions',
  status: 'backlog',
  assigned_to: 'Ali',
  services: 'Lead Generation, App Development',
  date: '2025-02-13'
},
{

  profileTile: 'assets/dp27.jpg',
  name: 'Tom Brown',
  source: 'Facebook Ads',
  email: 'tom.brown@example.com',
  phone: '+1-800-3761816',
  company: 'MedTech',
  status: 'pending',
  assigned_to: 'Emma',
  services: 'SEO, Digital Marketing',
  date: '2025-02-14'
},
{

  profileTile: 'assets/dp28.jpg',
  name: 'Emily Lee',
  source: 'Referral',
  email: 'emily.lee@example.com',
  phone: '+1-800-1347593',
  company: 'BrightFuture',
  status: 'backlog',
  assigned_to: 'Zain',
  services: 'Web Design, SEO',
  date: '2025-02-15'
},
{

  profileTile: 'assets/dp29.jpg',
  name: 'Jack Khan',
  source: 'Instagram',
  email: 'jack.khan@example.com',
  phone: '+1-800-8893066',
  company: 'TechWave',
  status: 'lost',
  assigned_to: 'Ali',
  services: 'Healthcare CRM, UI/UX',
  date: '2025-02-16'
},
{

  profileTile: 'assets/dp30.jpg',
  name: 'Emily Garcia',
  source: 'LinkedIn',
  email: 'emily.garcia@example.com',
  phone: '+1-800-7241860',
  company: 'NextGen',
  status: 'backlog',
  assigned_to: 'Emma',
  services: 'App Development, SMM',
  date: '2025-02-17'
}

];














}
