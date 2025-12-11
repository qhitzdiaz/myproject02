import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: string;
}

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
    FormsModule
  ],
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;
  filterType: 'all' | 'success' | 'warning' | 'error' | 'info' = 'all';

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    // Sample notifications
    this.notifications = [
      {
        id: '1',
        type: 'success',
        title: 'Booking Confirmed',
        message: 'Your service booking has been confirmed for tomorrow at 2:00 PM',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false,
        icon: 'check_circle'
      },
      {
        id: '2',
        type: 'info',
        title: 'New Message',
        message: 'You have a new message from John regarding your property',
        timestamp: new Date(Date.now() - 15 * 60000),
        read: false,
        icon: 'mail'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Pending Approval',
        message: 'You have 3 pending user registrations awaiting approval',
        timestamp: new Date(Date.now() - 45 * 60000),
        read: true,
        icon: 'info'
      },
      {
        id: '4',
        type: 'success',
        title: 'Order Shipped',
        message: 'Your purchase order #PO-2025-001 has been shipped',
        timestamp: new Date(Date.now() - 2 * 3600000),
        read: true,
        icon: 'local_shipping'
      },
      {
        id: '5',
        type: 'error',
        title: 'Payment Failed',
        message: 'Your payment for booking #BK-1234 failed. Please retry.',
        timestamp: new Date(Date.now() - 4 * 3600000),
        read: false,
        icon: 'error'
      },
      {
        id: '6',
        type: 'info',
        title: 'System Update',
        message: 'A new version of the application is available',
        timestamp: new Date(Date.now() - 24 * 3600000),
        read: true,
        icon: 'update'
      }
    ];

    this.updateUnreadCount();
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  getFilteredNotifications(): Notification[] {
    if (this.filterType === 'all') {
      return this.notifications;
    }
    return this.notifications.filter(n => n.type === this.filterType);
  }

  markAsRead(notification: Notification) {
    notification.read = true;
    this.updateUnreadCount();
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.updateUnreadCount();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.updateUnreadCount();
  }

  clearAll() {
    this.notifications = [];
    this.updateUnreadCount();
  }

  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      'success': '#4CAF50',
      'warning': '#FFC107',
      'error': '#F44336',
      'info': '#2196F3'
    };
    return colors[type] || '#2196F3';
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
}
