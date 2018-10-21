import { Component } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ElectronService } from '../../providers/electron.service';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';


@Component({
    selector: 'add-item-modal',
    templateUrl: './add-item-modal.html',
    // add NgbModalConfig and NgbModal to the component providers
    providers: [NgbModalConfig, NgbModal]
})
export class AddItemModal {
    faRupeeSign = faRupeeSign;
    categories: Array<any>;
    electronService: ElectronService;
    itemFormSchematics = {
        itemName: ['', [Validators.required, Validators.minLength(3)]],
        brand: [''],
        category: ['', [Validators.required]],
        type: ['pack', [Validators.required]],
        quantityPerPack: [1, [Validators.required, Validators.pattern("^[0-9]*$")]],
        unitPrice: [11.05, [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]],
        totalPrice: [0],
        sequence: [100],
    };

    itemForm = this.fb.group(this.itemFormSchematics);

    constructor(config: NgbModalConfig, private modalService: NgbModal, private fb: FormBuilder, electronService: ElectronService) {
        config.backdrop = 'static';
        config.keyboard = true;
        this.electronService = electronService;

    }

    ngOnInit() {
        let _self = this;
        this.electronService.ipcRenderer.on("category-list-listener", function (event, args) {
            _self.categories = args.result;

            _self.itemForm.controls['category'].setValue(_self.categories[0].name);
        });

        this.electronService.ipcRenderer.send("notify-backend", {
            action: "findAllDocs",
            model: "Category",
            listener: "category-list-listener"
        });

        this.onFieldChanges();

    }

    onFieldChanges() {

        this.calculateTotalPrice(this.itemForm
            .controls['unitPrice']
            .value, this.itemForm
                .controls['quantityPerPack']
                .value);

        this.itemForm.get('unitPrice').valueChanges.subscribe(val => {

            this.calculateTotalPrice(val, this.itemForm
                .controls['quantityPerPack']
                .value);
        });

        this.itemForm.get('quantityPerPack').valueChanges.subscribe(val => {

            this.calculateTotalPrice(this.itemForm
                .controls['unitPrice']
                .value, val);
        });

        this.itemForm.get('type').valueChanges.subscribe(val => {
            if (val === 'single') {
                // set the value to 1 and make it disabled state
                this.itemForm
                    .controls['quantityPerPack']
                    .setValue(1);
            } else {
                this.itemForm
                    .controls['quantityPerPack']
                    .setValue('');
            }
        });
    }

    calculateTotalPrice(unitPrice, quantityPerPack) {
        let totalPrice = (unitPrice * quantityPerPack).toFixed(2);

        this.itemForm
            .controls['totalPrice']
            .setValue(totalPrice);
    }

    open(content) {
        this.modalService.open(content);
    }

    onSubmit() {
        // TODO: Use EventEmitter with form value
        console.warn(this.itemForm.value);
        let _self = this;
        this.electronService.ipcRenderer.on("item-create-listener", function (event, args) {

        });

        this.electronService.ipcRenderer.send("notify-backend", {
            action: "createItem",
            model: "Item",
            listener: "item-create-listener",
            data: this.itemForm.value
        });

        this.modalService.dismissAll();

        this.itemForm.reset({
            itemName: '',
            brand: '',
            type: 'pack',
            quantityPerPack: 1,
            unitPrice: 11.05,
            totalPrice: 0,
            sequence: 100,
        });

    }

    get itemName() { return this.itemForm.get('itemName'); }

    get quantityPerPack() { return this.itemForm.get('quantityPerPack') }

    get category() { return this.itemForm.get('category') }

    get unitPrice() { return this.itemForm.get('unitPrice') }
}

