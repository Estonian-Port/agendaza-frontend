import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastState = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$: Observable<ToastMessage[]> = this.toastState.asObservable();
  private nextId = 0;

  showError(message: string, duration = 4000): void {
    this.pushToast({ type: 'error', message, duration });
  }

  showSuccess(message: string, duration = 3000): void {
    this.pushToast({ type: 'success', message, duration });
  }

  showInfo(message: string, duration = 3000): void {
    this.pushToast({ type: 'info', message, duration });
  }

  remove(id: number): void {
    this.toastState.next(this.toastState.value.filter((toast) => toast.id !== id));
  }

  clear(): void {
    this.toastState.next([]);
  }

  private pushToast(toast: Omit<ToastMessage, 'id'>): void {
    const nextToast: ToastMessage = {
      id: ++this.nextId,
      ...toast
    };

    this.toastState.next([...this.toastState.value, nextToast]);

    if (nextToast.duration > 0) {
      setTimeout(() => this.remove(nextToast.id), nextToast.duration);
    }
  }
}
