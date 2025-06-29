import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ICategory } from "../../../interfaces";

@Component({
    selector: "app-category-form",
    templateUrl: "./category-form.component.html",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule
    ],
})
export class CategoryFormComponent {
    @Input() form!: FormGroup;
    @Output() callSaveMethod = new EventEmitter<ICategory>();
    @Output() callUpdateMethod = new EventEmitter<ICategory>();

    callSave() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();

        if (formValue.id) {
            this.callUpdateMethod.emit(formValue);
        } else {
            this.callSaveMethod.emit(formValue);
        }
    }
}