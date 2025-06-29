import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IProduct } from "../../interfaces";
import { ProductService } from "../../services/product.service";
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';

import { ProductFormComponent } from "../../components/product/product-form/product-form.component";
import { ProductListComponent } from "../../components/product/product-list/product-list.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProductFormComponent,
        ProductListComponent,
        PaginationComponent,
        ModalComponent
    ]
})
export class ProductsComponent implements OnInit {
    public productService: ProductService = inject(ProductService);
    public modalService: ModalService = inject(ModalService);
    public authService: AuthService = inject(AuthService);
    public route: ActivatedRoute = inject(ActivatedRoute);
    private fb: FormBuilder = inject(FormBuilder);

    public areActionsAvailable: boolean = false;
    @ViewChild('editProductModal') public editProductModal: any;

    public productForm = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        description: [''],
        price: ['', [Validators.required]],
        stock: ['', [Validators.required]],
        category: ['', Validators.required]
    });

    constructor() {
        this.productService.getAll();
    }

    ngOnInit(): void {
        this.authService.getUserAuthorities();
        this.route.data.subscribe(data => {
            const requiredAuthorities = data['authorities'] || [];
            this.areActionsAvailable = this.authService.areActionsAvailable(requiredAuthorities);
        });
    }

    saveProduct(product: IProduct): void {
        this.productService.save(product);
        this.productForm.reset();
    }

    updateProduct(product: IProduct): void {
        this.productService.update(product);
        this.modalService.closeAll();
    }

    deleteProduct(product: IProduct): void {
        this.productService.delete(product);
    }

    openEditProductModal(product: IProduct): void {
        this.productForm.patchValue({
            id: JSON.stringify(product.id),
            name: product.name,
            description: product.description,
            price: JSON.stringify(product.price),
            stock: JSON.stringify(product.stock),
            category: product.category.id as any
        });
        this.modalService.displayModal('lg', this.editProductModal);
    }
}