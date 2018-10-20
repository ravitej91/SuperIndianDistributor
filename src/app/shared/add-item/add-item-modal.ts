import { Component } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ElectronService } from '../../providers/electron.service';


@Component({
    selector: 'add-item-modal',
    templateUrl: './add-item-modal.html',
    // add NgbModalConfig and NgbModal to the component providers
    providers: [NgbModalConfig, NgbModal]
})
export class AddItemModal {
    itemForm = this.fb.group({
        itemName: ['', [Validators.required, Validators.minLength(3)]],
        brand: [''],
        category: ['', [Validators.required]],
        type: ['pack', [Validators.required]],
        quantityPerPack: ['', [Validators.pattern("^[0-9]*$")]],
        unitPrice: [''],
        totalPrice: [''],
        sequence: [''],
    });
    categories: Array<any>;
    electronService: ElectronService

    constructor(config: NgbModalConfig, private modalService: NgbModal, private fb: FormBuilder, electronService: ElectronService) {
        config.backdrop = 'static';
        config.keyboard = true;
        this.electronService = electronService;
    }

    ngOnInit() {
        let _self = this;
        this.electronService.ipcRenderer.on("category-list-listener", function (event, args) {
            _self.categories = args.result;
        });

        this.electronService.ipcRenderer.send("notify-backend", {
            action: "findAllDocs",
            model: "Category",
            listener: "category-list-listener"
        });
    }

    open(content) {
        this.modalService.open(content);
    }

    onSubmit() {
        // TODO: Use EventEmitter with form value
        console.warn(this.itemForm.value);
    }

    get itemName() { return this.itemForm.get('itemName'); }

    get quantityPerPack() { return this.itemForm.get('quantityPerPack') }
}

