import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ICategory } from "../../interfaces";
import { CategoryService } from "../../services/category.service"; // Importante: Usar CategoryService
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';

import { CategoryFormComponent } from "../../components/category/category-form/category-form.component";
import { CategoryListComponent } from "../../components/category/category-list/category-list.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
    selector: "app-categories",
    templateUrl: "./categories.component.html",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CategoryFormComponent,
        CategoryListComponent,
        PaginationComponent,
        ModalComponent
    ]
})
export class CategoriesComponent implements OnInit {
    public categoryService: CategoryService = inject(CategoryService);
    public modalService: ModalService = inject(ModalService);
    public authService: AuthService = inject(AuthService);
    public route: ActivatedRoute = inject(ActivatedRoute);
    private fb: FormBuilder = inject(FormBuilder);

    public areActionsAvailable: boolean = false;
    @ViewChild('editCategoryModal') public editCategoryModal: any;

    public categoryForm = this.fb.group({
        id: [null as number | null],
        name: ['', Validators.required],
        description: ['']
    });

    constructor() {
        this.categoryService.getAll();
    }

    ngOnInit(): void {
        this.authService.getUserAuthorities();
        this.route.data.subscribe(data => {
            const requiredAuthorities = data['authorities'] || [];
            this.areActionsAvailable = this.authService.areActionsAvailable(requiredAuthorities);
        });
    }

    saveCategory(category: ICategory): void {
        this.categoryService.save(category);
        this.categoryForm.reset();
    }

    updateCategory(category: ICategory): void {
        this.categoryService.update(category);
        this.modalService.closeAll();
    }

    deleteCategory(category: ICategory): void {
        // Aquí se podría implementar una confirmación
        this.categoryService.delete(category);
    }

    openEditCategoryModal(category: ICategory): void {
        this.categoryForm.patchValue(category);
        this.modalService.displayModal('lg', this.editCategoryModal);
    }
}