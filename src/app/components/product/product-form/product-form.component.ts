import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { IProduct } from "../../../interfaces";
import { CategoryService } from "../../../services/category.service";

@Component({
    selector: "app-product-form",
    templateUrl: "./product-form.component.html",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule
    ],
})
export class ProductFormComponent {
    @Input() form!: FormGroup;
    @Output() callSaveMethod = new EventEmitter<IProduct>();
    @Output() callUpdateMethod = new EventEmitter<IProduct>();

    public categoryService: CategoryService = inject(CategoryService);

    constructor() {
        this.categoryService.getAll();
    }

    callSave() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();
        const productData: any = {
            name: formValue.name,
            description: formValue.description,
            price: formValue.price,
            stock: formValue.stock,
            category: { id: formValue.category }
        };

        if (formValue.id) {
            productData.id = formValue.id;
            this.callUpdateMethod.emit(productData);
        } else {
            this.callSaveMethod.emit(productData);
        }
    }
}