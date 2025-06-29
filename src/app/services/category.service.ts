import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICategory, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends BaseService<ICategory> {
    protected override source: string = 'categories';
    private categoryListSignal = signal<ICategory[]>([]);

    get categories$() {
        return this.categoryListSignal.asReadonly();
    }

    public search: ISearch = {
        page: 1,
        size: 5
    };
    public totalItems: any[] = [];

    private alertService: AlertService = inject(AlertService);

    getAll() {
        this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
            next: (response: IResponse<ICategory[]>) => {
                this.search = { ...this.search, ...response.meta };
                this.totalItems = Array.from({ length: this.search.totalPages || 0 }, (_, i) => i + 1);

                this.categoryListSignal.set(response.data);
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'An error occurred fetching categories', 'center', 'top', ['error-snackbar']);
                console.error('Error fetching categories:', err);
            }
        });
    }

    save(item: ICategory) {
        this.add(item).subscribe({
            next: (response: IResponse<ICategory>) => {
                this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'An error occurred adding the category', 'center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }

    update(item: ICategory) {
        this.edit(item.id, item).subscribe({
            next: (response: IResponse<ICategory>) => {
                this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'An error occurred updating the category', 'center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }

    delete(item: ICategory) {
        this.del(item.id).subscribe({
            next: (response: IResponse<ICategory>) => {
                this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'An error occurred deleting the category', 'center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }
}