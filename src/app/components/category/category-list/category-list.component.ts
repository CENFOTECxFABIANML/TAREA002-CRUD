import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ICategory } from "../../../interfaces";
import { AuthService } from "../../../services/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-category-list",
    templateUrl: "./category-list.component.html",
    standalone: true,
    imports: [CommonModule]
})
export class CategoryListComponent implements OnInit {
    @Input() pCategoryList: ICategory[] = [];
    @Output() callUpdateModalMethod = new EventEmitter<ICategory>();
    @Output() callDeleteMethod = new EventEmitter<ICategory>();

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