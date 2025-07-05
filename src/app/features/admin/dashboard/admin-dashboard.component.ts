import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Observable, catchError, finalize, of, Subject, takeUntil } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  dashboardStats$!: Observable<DashboardStats>;
  
  // Screen breakpoints for responsive grid
  breakpoint!: number;
  loading = false;
  
  // Screen size breakpoints (px)
  private readonly SCREEN_SM = 600;
  private readonly SCREEN_MD = 960;
  
  // For unsubscribing from observables when component is destroyed
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly adminService: AdminService,
    private readonly snackbarService: SnackbarService,
    private readonly cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.loadDashboardStats();
    this.setGridBreakpoint(window.innerWidth);
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadDashboardStats(): void {
    this.loading = true;
    this.dashboardStats$ = this.adminService.getDashboardStats().pipe(
      takeUntil(this.destroy$),
      catchError((error: Error) => {
        this.snackbarService.error('Failed to load dashboard statistics');
        console.error('Dashboard loading error:', error);
        return of(this.getEmptyDashboardStats());
      }),
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    );
  }

  onResize(event: UIEvent): void {
    if (event.target instanceof Window) {
      this.setGridBreakpoint(event.target.innerWidth);
    }
  }

  private setGridBreakpoint(width: number): void {
    if (width <= this.SCREEN_SM) {
      this.breakpoint = 1; // 1 card per row on small screens
    } else if (width <= this.SCREEN_MD) {
      this.breakpoint = 2; // 2 cards per row on medium screens
    } else {
      this.breakpoint = 3; // 3 cards per row on large screens
    }
  }
  
  private getEmptyDashboardStats(): DashboardStats {
    return {
      totalUsers: 0,
      activeSessions: 0,
      errorsToday: 0
    };
  }
}
