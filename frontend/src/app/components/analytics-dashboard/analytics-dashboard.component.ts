import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface AnalyticMetric {
  label: string;
  value: number;
  icon: string;
  percentage?: number;
  color: string;
}

interface ChartData {
  labels: string[];
  values: number[];
  colors: string[];
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  metrics: AnalyticMetric[] = [
    {
      label: 'Total Users',
      value: 1250,
      icon: 'people',
      percentage: 15,
      color: '#6B4423'
    },
    {
      label: 'Active Bookings',
      value: 328,
      icon: 'calendar_today',
      percentage: 8,
      color: '#D4A574'
    },
    {
      label: 'Purchase Orders',
      value: 156,
      icon: 'shopping_cart',
      percentage: 23,
      color: '#8B5A2B'
    },
    {
      label: 'Service Providers',
      value: 89,
      icon: 'store',
      percentage: 12,
      color: '#C19A6B'
    }
  ];

  chartData: ChartData = {
    labels: ['Users', 'Bookings', 'Orders', 'Services'],
    values: [1250, 328, 156, 89],
    colors: ['#6B4423', '#D4A574', '#8B5A2B', '#C19A6B']
  };

  systemHealth = {
    cpu: 65,
    memory: 48,
    database: 32,
    api: 18
  };

  recentActivity = [
    { time: '2 minutes ago', action: 'New booking created', user: 'Maria Santos' },
    { time: '15 minutes ago', action: 'Service provider registered', user: 'John Doe' },
    { time: '1 hour ago', action: 'Purchase order confirmed', user: 'Admin' },
    { time: '3 hours ago', action: 'User profile updated', user: 'Jane Smith' },
    { time: '5 hours ago', action: 'New property added', user: 'Carlos Rivera' }
  ];

  topServices = [
    { name: 'Plumbing Repair', bookings: 87 },
    { name: 'Electrical Services', bookings: 64 },
    { name: 'Cleaning Services', bookings: 52 },
    { name: 'Appliance Repair', bookings: 41 },
    { name: 'Pest Control', bookings: 28 }
  ];

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    // In a real application, this would fetch data from backend APIs
    // For now, we'll simulate the data loading with a small delay
    setTimeout(() => {
      this.simulateMetricsUpdate();
    }, 500);
  }

  simulateMetricsUpdate() {
    // Simulate real-time metric updates
    this.metrics.forEach(metric => {
      const randomIncrease = Math.floor(Math.random() * 20);
      metric.percentage = randomIncrease > 10 ? randomIncrease : metric.percentage;
    });
  }

  getHealthStatus(value: number): string {
    if (value < 30) return 'excellent';
    if (value < 50) return 'good';
    if (value < 70) return 'fair';
    return 'critical';
  }

  formatNumber(value: number): string {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k';
    }
    return value.toString();
  }

  exportAnalytics() {
    console.log('Exporting analytics data...');
    // Implementation for exporting analytics as CSV/PDF
  }

  refreshAnalytics() {
    this.loadAnalytics();
  }
}
