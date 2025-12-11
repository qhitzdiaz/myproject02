import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

interface UserSettings {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    publicProfile: boolean;
    showEmail: boolean;
    allowMessages: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
  };
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatDividerModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: UserSettings = {
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false
    },
    appearance: {
      theme: 'auto',
      fontSize: 'medium'
    },
    privacy: {
      publicProfile: false,
      showEmail: false,
      allowMessages: true
    },
    preferences: {
      language: 'en',
      timezone: 'Asia/Manila',
      dateFormat: 'MM/DD/YYYY'
    }
  };

  originalSettings: UserSettings = JSON.parse(JSON.stringify(this.settings));
  changesSaved = false;

  languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'tl', label: 'Tagalog' }
  ];

  timezones = [
    { value: 'Asia/Manila', label: 'Manila (PST)' },
    { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
    { value: 'America/New_York', label: 'New York (EST)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT)' }
  ];

  dateFormats = [
    { value: 'MM/DD/YYYY', label: '12/25/2025' },
    { value: 'DD/MM/YYYY', label: '25/12/2025' },
    { value: 'YYYY-MM-DD', label: '2025-12-25' }
  ];

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    // In a real app, load from backend
    this.originalSettings = JSON.parse(JSON.stringify(this.settings));
  }

  hasChanges(): boolean {
    return JSON.stringify(this.settings) !== JSON.stringify(this.originalSettings);
  }

  saveSettings() {
    // In a real app, save to backend
    console.log('Saving settings:', this.settings);
    this.originalSettings = JSON.parse(JSON.stringify(this.settings));
    this.changesSaved = true;
    setTimeout(() => {
      this.changesSaved = false;
    }, 3000);
  }

  resetSettings() {
    this.settings = JSON.parse(JSON.stringify(this.originalSettings));
  }

  exportSettings() {
    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings.json';
    link.click();
  }
}
