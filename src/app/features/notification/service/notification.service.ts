import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Notification } from '../model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

 private http = inject(HttpClient);

  unreadCount = signal(0);

  getMyNotifications() {
    return this.http.get<Notification[]>('/notifications').pipe(
      tap(notifs => {
        const count = notifs.filter(n => !n.isRead).length;
        this.unreadCount.set(count);
      })
    );
  }

  markAsRead(id: number) {
    return this.http.put(`/notifications/${id}/read`, {}).pipe(
      tap(() => {
        this.unreadCount.update(c => Math.max(0, c - 1));
      })
    );
  }
}

