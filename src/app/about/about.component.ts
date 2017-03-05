import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  
  developers = [
    {
      profile_img: 'https://avatars3.githubusercontent.com/u/2001345?v=3&s=460',
      name: 'Kyle E. De Freitas',
      contributed: 'Code Review and Quality Assurance',
      dates_worked: '2014 - Present',
      website: 'https://github.com/kyledef'
    },
    {
      profile_img: 'https://avatars1.githubusercontent.com/u/7622655?v=3&s=460',
      name: 'Keenen Charles',
      contributed: 'Initial Development and Facebook Parse Push Notifications',
      dates_worked: '2014 - 2015',
      website: 'https://github.com/KeenenCharles'
    },
    {
      profile_img: 'https://avatars1.githubusercontent.com/u/12610279?v=3&s=460',
      name: 'Gerard Rique',
      contributed: 'Redesign to Integrate with Firebase. Angular2 and PWA Integration',
      dates_worked: '2017 - Present',
      website: 'https://github.com/GerardRique'
    },
    {
      profile_img: 'https://avatars2.githubusercontent.com/u/17114163?v=3&s=460',
      name: 'Kershel James',
      contributed: 'Redesign to Integrate with Firebase',
      dates_worked: '2017 - Present',
      website: 'https://github.com/Kerschel'
    },
  ];
  
  testers = [{
    profile_img: 'https://avatars3.githubusercontent.com/u/2001345?v=3&s=460',
    name: 'Kyle E. De Freitas',
    contributed: 'Code Review and Quality Assurance',
    dates_worked: '2014 - Present',
    website: 'https://github.com/kyledef'
  }];
  
  constructor() { }

  ngOnInit() {
  }
  
  visit(contrib) {
    
  }
}
