import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { IProduct } from "../../../interfaces";
import { AuthService } from "../../../services/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-product-list",
    templateUrl: "./product-list.component.html",
    standalone: true,
    imports: [CommonModule]
})
export class ProductListComponent implements OnInit {
    @Input() pProductList: IProduct[] = [];
    @Output() callUpdateModalMethod = new EventEmitter<IProduct>();
    @Output() callDeleteMethod = new EventEmitter<IProduct>();

    public authService: AuthService = inject(AuthService);
    public areActionsAvailable: boolean = false;
    public route: ActivatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        this.authService.getUserAuthorities();
        this.route.data.subscribe( data => {
            this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
        });
    }
}