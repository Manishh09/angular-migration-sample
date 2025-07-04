import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        SnackbarService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });
    
    service = TestBed.inject(SnackbarService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call snackBar.open with success styling', () => {
    service.success('Success message');
    
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Success message', 
      'Close', 
      jasmine.objectContaining({
        panelClass: ['success-snackbar']
      })
    );
  });

  it('should call snackBar.open with error styling', () => {
    service.error('Error message');
    
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Error message', 
      'Close', 
      jasmine.objectContaining({
        panelClass: ['error-snackbar']
      })
    );
  });

  it('should call snackBar.open with warning styling', () => {
    service.warning('Warning message');
    
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Warning message', 
      'Close', 
      jasmine.objectContaining({
        panelClass: ['warning-snackbar']
      })
    );
  });

  it('should call snackBar.open with info styling', () => {
    service.info('Info message');
    
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Info message', 
      'Close', 
      jasmine.objectContaining({
        panelClass: ['info-snackbar']
      })
    );
  });

  it('should allow custom action text', () => {
    service.error('Error message', 'Dismiss');
    
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Error message', 
      'Dismiss', 
      jasmine.any(Object)
    );
  });

  it('should allow custom configuration', () => {
    service.info('Info message', 'OK', { duration: 10000 });
    
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Info message', 
      'OK', 
      jasmine.objectContaining({
        duration: 10000
      })
    );
  });
});
