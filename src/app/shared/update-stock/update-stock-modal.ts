import { Component } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ElectronService } from '../../providers/electron.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { TouchSequence } from 'selenium-webdriver';
import { storeCleanupWithContext } from '@angular/core/src/render3/instructions';

@Component({
    selector: 'update-stock-modal',
    templateUrl: './update-stock-modal.html',
    // add NgbModalConfig and NgbModal to the component providers
    providers: [NgbModalConfig, NgbModal]
})

export class UpdateStockModal {
    faTimes = faTimes;
    public model: any;
    items: Array<any> = [];
    electronService: ElectronService;
    public updateStockForm: FormGroup;


    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => {
                if (term.length < 3) {
                    return []
                } else {
                    let filteredResults = this.items.filter(function (item) {
                        return item.itemCode == term;
                    });

                    return filteredResults;
                }
            })
        )

    formatter = (result: any) => {
        if (_.has(result, 'itemName')) {
            return result.itemName.toUpperCase();
        }

    }



    constructor(config: NgbModalConfig, private modalService: NgbModal, private fb: FormBuilder, electronService: ElectronService) {
        config.backdrop = 'static';
        config.keyboard = true;
        this.electronService = electronService;

    }

    ngOnInit() {
        let _self = this;
        // load all the items
        this.electronService.ipcRenderer.on("item-list-listener", function (event, args) {
            _self.items = _.orderBy(args.result, ['itemCode'], ['asc']);
        });

        // add form
        this.addForm();

        // initialize stream on units
        const myFormValueChanges$ = this.updateStockForm.controls['stocks'].valueChanges;
        // subscribe to the stream so listen to changes on units
        myFormValueChanges$.subscribe(stocks => this.updateLatestStock(stocks));
    }

    updateLatestStock(stocks) {
        // get our units group controll
        const control = <FormArray>this.updateStockForm.controls['stocks'];
        for (let i in stocks) {
            if (_.isObject(stocks[i].item)) {
                // get the initial opening stock
                var openingStock = stocks[i].item.stock.openingStock;
                let totalStock = (openingStock + stocks[i].updatedStock);
                // update total stock
                control.at(+i).get('totalStock').setValue(totalStock, { onlySelf: true, emitEvent: false });
            }
        }
    }

    addForm() {
        this.updateStockForm = this.fb.group({
            stocks: this.fb.array([
                this.getStockRow()
            ])
        });
    }

    addStockRow() {
        const control = <FormArray>this.updateStockForm.controls['stocks'];
        control.push(this.getStockRow());
    }

    getStockRow() {
        return this.fb.group({
            item: ['', itemSelectedValidator()],
            updatedStock: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
            totalStock: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
            initialStock: [0, [Validators.required, Validators.pattern("^[0-9]*$")]]
        });
    }

    open(content) {
        this.modalService.open(content);
    }

    refreshItemList() {
        // get all items
        this.electronService.ipcRenderer.send("notify-backend", {
            action: "findAllDocs",
            model: "Item",
            listener: "item-list-listener"
        });
    }

    itemSelected(event, i) {
        // update the row with actual item values
        this.updateItemRow(event.item, i);
    }

    onKey(event) {
        this.addStockRow();
    }

    updateItemRow(item, i) {
        const control = <FormArray>this.updateStockForm.controls['stocks'];
        control.at(+i).get('totalStock').setValue(item.stock.openingStock, { onlySelf: true, emitEvent: false });
        control.at(+i).get('initialStock').setValue(item.stock.openingStock, { onlySelf: true, emitEvent: false });
    }

    removeItem(itemIndex) {
        const control = <FormArray>this.updateStockForm.controls['stocks'];
        control.removeAt(itemIndex);
    }

    onSubmit() {
        console.warn(this.updateStockForm.value);
        // get the stocks array
        let stocks = this.updateStockForm.value.stocks;
        _.forEach(stocks, function (stock) {
            // transform to item update            
            // update stock in database
        });
    }

    transformToItemUpdate(stock) {

    }
};

export function itemSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        console.log("Controle :: ", control);
        console.log("Is One :: ", _.isObject(control.value));
        return _.isObject(control.value) ? null : { 'itemNotSelected': { value: control.value } };
    };
}