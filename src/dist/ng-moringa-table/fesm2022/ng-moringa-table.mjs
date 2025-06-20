import * as i0 from '@angular/core';
import { EventEmitter, Output, Input, Component, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2 from '@angular/forms';
import { FormsModule } from '@angular/forms';

let uniqueCounter = 0;
class NgMoringaTableComponent {
    type;
    data = [];
    columns = [];
    showActions = true;
    variant = '';
    imgstatus = '';
    title;
    sub;
    icon;
    moringaHeader = true;
    showFooter = false;
    collapsible = false;
    idPrefix;
    headerButtons = [];
    actionButtons = [];
    searchBy;
    searchFilter = false;
    Sorting = false;
    autoGenerateColumns = true;
    excludeColumns = [];
    progressBy;
    paginated = false;
    pageSize = 10;
    statusMap = {};
    rowAction = new EventEmitter();
    internalIdPrefix;
    isCollapsed = false;
    activeRowIndex = null;
    selectedRows = [];
    filteredData = [];
    dataFilters = false;
    searchKeyword = '';
    selectedOption = '';
    startDate = null;
    endDate = null;
    currentPage = 1;
    selectedDate = new Date();
    selectedMonth = this.selectedDate.getMonth();
    selectedYear = this.selectedDate.getFullYear();
    datePicker = false;
    sortKey = null;
    sortAsc = true;
    months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    years = Array.from({ length: 100 }, (_, i) => 1980 + i);
    dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    calendarDays = [];
    ngOnInit() {
        this.internalIdPrefix = this.idPrefix || `smart-table-${uniqueCounter++}`;
        this.normalizeActionButtons();
        this.setColumns();
        this.filteredData = [...this.data];
        this.applyFilters();
    }
    ngOnChanges() {
        this.applyFilters();
    }
    toggleFilters() {
        this.dataFilters = !this.dataFilters;
        if (!this.dataFilters)
            this.datePicker = false;
    }
    applyFilters() {
        this.filteredData = this.data.filter(item => {
            const keywordMatch = !this.searchKeyword ||
                Object.values(item).some(val => String(val).toLowerCase().includes(this.searchKeyword.toLowerCase()));
            const optionMatch = !this.selectedOption || item[this.searchKey] === this.selectedOption;
            const itemDate = item.date ? new Date(item.date) : null;
            const dateMatch = (!this.startDate || (itemDate && itemDate >= this.startDate)) &&
                (!this.endDate || (itemDate && itemDate <= this.endDate));
            return keywordMatch && optionMatch && dateMatch;
        });
        if (this.sortKey) {
            this.filteredData.sort((a, b) => {
                const aVal = a[this.sortKey];
                const bVal = b[this.sortKey];
                return this.sortAsc
                    ? (aVal > bVal ? 1 : aVal < bVal ? -1 : 0)
                    : (aVal < bVal ? 1 : aVal > bVal ? -1 : 0);
            });
        }
        this.currentPage = 1;
    }
    sortByColumn(key) {
        if (this.sortKey === key) {
            this.sortAsc = !this.sortAsc;
        }
        else {
            this.sortKey = key;
            this.sortAsc = true;
        }
        this.applyFilters();
    }
    onSearchKeywordChange(value) {
        this.searchKeyword = value;
        this.applyFilters();
    }
    onSearchOptionChange(event) {
        this.selectedOption = event.target.value;
        this.applyFilters();
    }
    toggleCalendar() {
        this.datePicker = !this.datePicker;
        this.generateCalendar();
    }
    generateCalendar() {
        const date = new Date(this.selectedYear, this.selectedMonth, 1);
        const days = [];
        while (date.getMonth() === this.selectedMonth) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        const startDay = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
        for (let i = 0; i < startDay; i++) {
            days.unshift(new Date(0));
        }
        this.calendarDays = days;
    }
    selectDate(date) {
        if (!isNaN(date.getTime())) {
            this.selectedDate = new Date(date);
        }
    }
    isSelected(date) {
        return (date.getDate() === this.selectedDate.getDate() &&
            date.getMonth() === this.selectedDate.getMonth() &&
            date.getFullYear() === this.selectedDate.getFullYear());
    }
    cancel() {
        this.datePicker = false;
    }
    confirm() {
        this.startDate = this.selectedDate;
        this.endDate = this.selectedDate;
        this.applyFilters();
        this.datePicker = false;
    }
    setColumns() {
        if ((!this.columns || this.columns.length === 0) && this.autoGenerateColumns && this.data.length > 0) {
            const keys = Object.keys(this.data[0]).filter(k => !this.excludeColumns.includes(k));
            this.columns = keys.map(key => ({ key, label: this.toLabel(key) }));
        }
        if (this.showActions && this.actionButtons.length > 0 && !this.columns.some(c => c.key === 'action')) {
            this.columns.push({ key: 'action', label: 'Actions' });
        }
    }
    normalizeActionButtons() {
        this.actionButtons = this.actionButtons.map(btn => typeof btn === 'string' ? { label: btn, tooltip: btn, className: 'btn' } : btn);
    }
    get prefix() {
        return this.internalIdPrefix;
    }
    get shouldShowSearchOptions() {
        return !!this.searchBy;
    }
    get searchKey() {
        return this.searchBy || '';
    }
    get searchOptions() {
        return [...new Set(this.data.map(item => item[this.searchKey]).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b));
    }
    get pagedData() {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.paginated ? this.filteredData.slice(start, start + this.pageSize) : this.filteredData;
    }
    get totalPages() {
        return Math.ceil(this.filteredData.length / this.pageSize);
    }
    get progressValue() {
        if (!this.progressBy || !this.searchKey || !this.data.length)
            return 0;
        const statusToCheck = this.selectedOption || this.progressBy;
        const total = this.data.length;
        const match = this.data.filter(item => item[this.searchKey] === statusToCheck).length;
        return Math.round((match / total) * 100);
    }
    getStatusStyles(status) {
        const key = status?.toLowerCase() || '';
        const color = this.statusMap?.[key] || 'info';
        return {
            tagClass: `tag ${color}`,
            progressClass: `progress-bar ${color}`
        };
    }
    getValue(row, key) {
        const val = row?.[key];
        return val !== undefined && val !== null ? String(val) : '-';
    }
    handleImageError(e) {
        e.target.src = 'assets/dummy.jpg';
    }
    handleButtonClick(btn, row) {
        btn.action?.(row);
        this.rowAction.emit({ action: btn.label || '', row });
    }
    handleDropdownClick(option, btn, row) {
        btn.dropdownAction?.(option, row);
    }
    toggleRowClass(i) {
        this.activeRowIndex = this.activeRowIndex === i ? null : i;
    }
    toggleCard() {
        if (this.collapsible)
            this.isCollapsed = !this.isCollapsed;
    }
    nextPage() {
        if (this.currentPage < this.totalPages)
            this.currentPage++;
    }
    prevPage() {
        if (this.currentPage > 1)
            this.currentPage--;
    }
    toggleSelectRow(row, e) {
        const cb = e.target;
        cb.checked
            ? this.selectedRows.push(row)
            : this.selectedRows = this.selectedRows.filter(r => r !== row);
    }
    toggleAllRows(e) {
        const cb = e.target;
        this.selectedRows = cb.checked ? [...this.pagedData] : [];
    }
    isAllSelected() {
        return this.pagedData.length > 0 && this.selectedRows.length === this.pagedData.length;
    }
    handleBulkAction(btn) {
        if (!this.selectedRows.length)
            return alert('Please select at least one row.');
        if (btn.action)
            this.selectedRows.forEach(row => btn.action(row));
        if (btn.dropdownAction && btn.options?.length) {
            const userChoice = prompt(`Choose an option: ${btn.options.join(', ')}`) || btn.options[0];
            this.selectedRows.forEach(row => btn.dropdownAction(userChoice, row));
        }
    }
    executeAction(button) {
        button.action?.();
    }
    toLabel(key) {
        return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
    trackByIndex(index) {
        return index;
    }
    get categoryBreakdown() {
        if (!this.searchKey)
            return [];
        const total = this.filteredData.length;
        const counts = {};
        for (const item of this.filteredData) {
            const key = item[this.searchKey];
            if (key) {
                counts[key] = (counts[key] || 0) + 1;
            }
        }
        return Object.entries(counts).map(([name, count]) => ({
            name,
            count,
            percent: total ? Math.round((count / total) * 100) : 0
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: NgMoringaTableComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.14", type: NgMoringaTableComponent, isStandalone: true, selector: "ng-moringa-table", inputs: { type: "type", data: "data", columns: "columns", showActions: "showActions", variant: "variant", imgstatus: "imgstatus", title: "title", sub: "sub", icon: "icon", moringaHeader: "moringaHeader", showFooter: "showFooter", collapsible: "collapsible", idPrefix: "idPrefix", headerButtons: "headerButtons", actionButtons: "actionButtons", searchBy: "searchBy", searchFilter: "searchFilter", Sorting: "Sorting", autoGenerateColumns: "autoGenerateColumns", excludeColumns: "excludeColumns", progressBy: "progressBy", paginated: "paginated", pageSize: "pageSize", statusMap: "statusMap" }, outputs: { rowAction: "rowAction" }, usesOnChanges: true, ngImport: i0, template: "<div class=\"moringa-wraper\"  [class.collapsed]=\"isCollapsed\">\r\n \r\n  <div class=\"moringa-wraper-header\" *ngIf=\"moringaHeader\">\r\n    <div class=\"container-fluid \">\r\n      \r\n        <div class=\"d-flex align-items-center gap-2\">\r\n          <ng-content select=\"[header-component]\"></ng-content>\r\n         <i class=\"title-icon\" *ngIf=\"icon\" [class]=\"icon\"></i>\r\n          <h6 class=\"table-title\"> \r\n            {{ title }}\r\n            <span class=\"text-muted\">{{ sub }}</span>\r\n          </h6>\r\n        </div>\r\n        <div class=\"d-flex align-items-center flex-wrap gap-2 justify-content-end\">\r\n          <div class=\"form-group mb-0\">\r\n            <button *ngIf=\"searchFilter\" class=\"btn \" (click)=\"toggleFilters()\">\r\n              <i class=\"bi bi-search\"></i>\r\n            </button>\r\n\r\n            <ng-container *ngIf=\"dataFilters\">\r\n\r\n              <select class=\"form-select\" [(ngModel)]=\"selectedOption\" (change)=\"applyFilters()\">\r\n                <option value=\"\">All</option>\r\n                <option *ngFor=\"let option of searchOptions\" [value]=\"option\">{{ option }}</option>\r\n              </select>\r\n\r\n              <!-- Keyword input -->\r\n              <input type=\"text\" class=\"form-control\" placeholder=\"Search...\" [(ngModel)]=\"searchKeyword\"\r\n                (ngModelChange)=\"onSearchKeywordChange($event)\" />\r\n\r\n              <!-- Date calendar button -->\r\n              <input class=\"btn\" (click)=\"toggleCalendar()\" style=\"min-width: 120px;\" value=\"{{ selectedDate | date: 'y, MMMM, d' }}\">\r\n              \r\n                \r\n           \r\n\r\n\r\n              <!-- Calendar Popup -->\r\n              <div class=\"date-picker\" *ngIf=\"datePicker\" style=\"min-width: 350px;\">\r\n                <div class=\"d-flex justify-content-between gap-2 mb-2\">\r\n                  <select class=\"form-select\" [(ngModel)]=\"selectedMonth\">\r\n                    <option *ngFor=\"let m of months; let i = index\" [value]=\"i\">{{ m }}</option>\r\n                  </select>\r\n                  <select class=\"form-select\" [(ngModel)]=\"selectedYear\">\r\n                    <option *ngFor=\"let y of years\" [value]=\"y\">{{ y }}</option>\r\n                  </select>\r\n                </div>\r\n\r\n                <div class=\"d-grid\" style=\"grid-template-columns: repeat(7, 1fr); gap: 4px;\">\r\n                  <div class=\"text-center fw-bold\" *ngFor=\"let d of dayNames\">{{ d }}</div>\r\n                  <div *ngFor=\"let day of calendarDays\" class=\"text-center p-1 border rounded\"\r\n                    [class.bg-primary]=\"isSelected(day)\" [class.text-white]=\"isSelected(day)\" (click)=\"selectDate(day)\"\r\n                    style=\"cursor: pointer;\">\r\n                    {{ day.getDate() }}\r\n                  </div>\r\n                </div>\r\n\r\n                <div class=\"d-flex justify-content-between mt-3\">\r\n                  <button class=\"btn btn-sm\" (click)=\"cancel()\">Cancel</button>\r\n                  <button class=\"btn btn-sm btn-primary\" (click)=\"confirm()\">Confirm</button>\r\n                </div>\r\n              </div>\r\n            </ng-container>\r\n          </div>\r\n          <div class=\"btn-group\" role=\"group\" aria-label=\"Basic example\">\r\n            <button *ngFor=\"let button of headerButtons\" type=\"button\" class=\"btn \" [id]=\"button.targetId\"\r\n              (click)=\"executeAction(button)\">\r\n              <i *ngIf=\"button.icon\" [class]=\"button.icon\"></i>\r\n              <span *ngIf=\"button.label\">{{ button.label }}</span>\r\n            </button>\r\n\r\n            <button *ngIf=\"collapsible\" class=\"btn \" type=\"button\" (click)=\"toggleCard()\">\r\n              <i [class]=\"isCollapsed ? 'bi bi-arrows-expand' : 'bi bi-arrows-collapse'\"></i>\r\n            </button>\r\n          </div>\r\n        </div>\r\n     \r\n    </div>\r\n    \r\n   <div *ngIf=\"progressBy\" class=\"progress\">\r\n      <div class=\"progress-bar\" [ngClass]=\"getStatusStyles(selectedOption || progressBy).progressClass\"\r\n        role=\"progressbar\" [style.width.%]=\"progressValue\" [attr.aria-valuenow]=\"progressValue\" aria-valuemin=\"0\"\r\n        aria-valuemax=\"100\">\r\n        <p class=\"tag\">{{ progressValue }}%</p>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  \r\n  <div class=\"moringa-wraper-body  p-0\">\r\n   \r\n    <div class=\"pt-2 \">\r\n      <table [ngClass]=\"variant\">\r\n        <thead>\r\n          <tr>\r\n            <th *ngFor=\"let column of columns; let colIndex = index\" (click)=\"Sorting ? sortByColumn(column.key) : null\"\r\n              class=\"text-nowrap text-start align-middle \" style=\"cursor: pointer;\" scope=\"col\">\r\n              <div class=\"d-flex align-items-center gap-2\">\r\n                <!-- Always show Select All checkbox -->\r\n                <ng-container *ngIf=\"colIndex === 0\">\r\n                  <div class=\"checkbox-wrapper\">\r\n                    <input class=\"inp-cbx\" [id]=\"prefix + '-cbx-header'\" type=\"checkbox\"\r\n                      (click)=\"$event.stopPropagation()\" (change)=\"toggleAllRows($event)\" [checked]=\"isAllSelected()\" />\r\n\r\n                    <label class=\"cbx\" [for]=\"prefix + '-cbx-header'\">\r\n                      <div class=\"checkbox\">\r\n                        <svg width=\"12px\" height=\"10px\" viewBox=\"0 0 12 10\">\r\n                          <polyline points=\"1.5 6 4.5 9 10.5 1\"></polyline>\r\n                        </svg>\r\n                      </div>\r\n                      <div *ngIf=\"selectedRows.length > 1\" class=\"dropdown \">\r\n                        <button class=\"btn no-bg p-0\" type=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\"\r\n                          (click)=\"$event.stopPropagation()\">\r\n                          <i class=\"bi bi-three-dots-vertical\"></i>\r\n                        </button>\r\n                        <ul class=\"dropdown-menu\">\r\n                          <li *ngFor=\"let btn of actionButtons\">\r\n                            <button class=\"dropdown-item\" (click)=\"handleBulkAction(btn)\">\r\n                              {{ btn.label }}\r\n                            </button>\r\n                          </li>\r\n                        </ul>\r\n                      </div>\r\n                    </label>\r\n                  </div>\r\n                </ng-container>\r\n                <!-- Column Label -->\r\n                <span>{{ column.label }}</span>\r\n\r\n                <!-- Sort Icon -->\r\n                <i *ngIf=\"Sorting\" class=\"ms-1\" [ngClass]=\"{\r\n        'bi bi-arrow-up': sortKey === column.key && sortAsc,\r\n        'bi bi-arrow-down': sortKey === column.key && !sortAsc,\r\n        'bi bi-arrow-down-up': sortKey !== column.key\r\n      }\"></i>\r\n              </div>\r\n            </th>\r\n          </tr>\r\n        </thead>\r\n        <tbody>\r\n          <tr *ngFor=\"let row of pagedData; let i = index; trackBy: trackByIndex\"\r\n            [ngClass]=\"{ 'dynamic-row': activeRowIndex === i }\">\r\n            <td *ngFor=\"let column of columns\"  >\r\n              <ng-container [ngSwitch]=\"column.key\">\r\n                <ng-container *ngSwitchCase=\"'profileImage'\">\r\n                  <div class=\"d-flex align-items-center\">\r\n                    <div class=\"checkbox-wrapper\">\r\n                      <input class=\"inp-cbx\" [id]=\"prefix + '-cbx-' + i\" type=\"checkbox\"\r\n                        (change)=\"toggleSelectRow(row, $event)\" [checked]=\"selectedRows.includes(row)\" />\r\n                      <label class=\"cbx\" [for]=\"prefix + '-cbx-' + i\">\r\n                        <div class=\"checkbox\">\r\n                          <svg width=\"12px\" height=\"10px\" viewBox=\"0 0 12 10\">\r\n                            <polyline points=\"1.5 6 4.5 9 10.5 1\"></polyline>\r\n                          </svg>\r\n                        </div>\r\n                        <p class=\"mb-0\"></p>\r\n                      </label>\r\n                    </div>\r\n                    <div class=\"media-tile\">\r\n                      <div class=\"media-img sm  round-md\" [ngClass]=\" statusMap[row.status]\">\r\n                        <img class=\"img-fluid\" [src]=\"row.profileImage || 'assets/dummy.jpg'\" alt=\"Profile Picture\"\r\n                          (error)=\"handleImageError($event)\" />\r\n                      </div>\r\n                      <div class=\"profile-details\">\r\n                        <p class=\"mb-0 name  text-dark\">{{ row.name || 'Unknown' }}</p>\r\n                        <p class=\"mb-0 text-muted\">{{ row.source || 'No Information' }}</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </ng-container>\r\n                <ng-container *ngSwitchCase=\"'status'\">\r\n                  <span [ngClass]=\"getStatusStyles(row.status).tagClass\">\r\n                    {{ getValue(row, column.key) }}\r\n                  </span>\r\n                </ng-container>\r\n                <ng-container *ngSwitchCase=\"'action'\">\r\n                  <div class=\"form-group align-right mb-0\">\r\n                    <ng-container *ngFor=\"let btn of actionButtons\">\r\n                      <button *ngIf=\"!btn.isDropdown\" class=\"btn btn-sm\" [ngClass]=\"btn.className\"\r\n                        [attr.title]=\"btn.tooltip\" (click)=\"handleButtonClick(btn, row)\">\r\n                        <i *ngIf=\"btn.icon\" [class]=\"btn.icon\"></i>\r\n\r\n                      </button>\r\n                      <div *ngIf=\"btn.isDropdown\" class=\"dropdown btn btn-sm\">\r\n                        <button class=\"btn no-bg dropdown-toggle\" type=\"button\" data-bs-toggle=\"dropdown\"\r\n                          [ngClass]=\"btn.className\" [attr.title]=\"btn.tooltip\">\r\n                          {{ btn.label }}\r\n                        </button>\r\n                        <ul class=\"dropdown-menu\">\r\n                          <li *ngFor=\"let option of btn.options\">\r\n                            <button class=\"dropdown-item\" (click)=\"handleDropdownClick(option, btn, row)\">\r\n                              {{ option }}\r\n                            </button>\r\n                          </li>\r\n                        </ul>\r\n                      </div>\r\n                    </ng-container>\r\n                  </div>\r\n                </ng-container>\r\n                <ng-container *ngSwitchDefault>\r\n                  <span class=\"value\">{{ getValue(row, column.key) }}</span>\r\n                </ng-container>\r\n              </ng-container>\r\n            </td>\r\n            <td class=\"mobile-btn\">\r\n              <button class=\"btn\" (click)=\"toggleRowClass(i)\">\r\n                <i [ngClass]=\"{\r\n                'bi bi-chevron-down': activeRowIndex === i,\r\n                'bi bi-chevron-right': activeRowIndex !== i\r\n              }\"></i>\r\n              </button>\r\n            </td>\r\n          </tr>\r\n          <tr *ngIf=\"pagedData.length === 0\">\r\n            <td [attr.colspan]=\"columns.length + 2\" class=\"text-center py-3\">\r\n              No records found.\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n        <tfoot *ngIf=\"paginated\">\r\n          <tr>\r\n            <td [attr.colspan]=\"columns.length + 1\">\r\n              <div class=\"pagination form-group justify-content-end \">\r\n                <button class=\"btn\" (click)=\"prevPage()\" [disabled]=\"currentPage === 1\">\r\n                  <i class=\"bi bi-chevron-left\"></i>\r\n                </button>\r\n                <span class=\"btn\">Page {{ currentPage }} of {{ totalPages }}</span>\r\n                <button class=\"btn\" (click)=\"nextPage()\" [disabled]=\"currentPage === totalPages\">\r\n                  <i class=\"bi bi-chevron-right\"></i>\r\n                </button>\r\n              </div>\r\n            </td>\r\n          </tr>\r\n        </tfoot>\r\n      </table>\r\n    </div>\r\n  </div>\r\n</div>", styles: [".btn,.form-select,.form-control{border:1px solid #e7e7e7;color:#888;height:35px;outline:none}.btn:focus,.form-select:focus,.form-control:focus{border-color:#e7e7e7;box-shadow:none;color:#63634e}.btn{font-size:12px;display:flex;align-items:center;justify-content:center;gap:5px;border:1px solid #e7e7e7;color:#63634e;height:35px}.btn i{font-size:12px;color:#888}.btn:focus{box-shadow:none}.btn:disabled{border-color:#e7e7e7}.btn span{font-size:12px;color:#888}.btn.success{color:#28a745}.btn.pending{color:#f1a10a}.btn.info{color:#17a2b8}.btn.danger{color:#dc3545}.btn.warning{color:#f1a10a}.btn.primary{color:#007bff}.btn.muted,.btn.secondary{color:#888}.btn.light{color:#f8f9fa}.btn.default,.btn.archived{color:#adb5bd}.btn.processing{color:#17a2b8}.btn.failed{color:#dc3545}.btn.queued{color:#17a2b8}.btn.on-hold{color:#888}.btn.suspended{color:#212529}.btn.expired{color:#f1f3f5}.btn.rejected{color:#dc3545}.btn.approved{color:#28a745}.btn.active{color:#007bff}.btn.draft{color:#495057}.tag{border-radius:8px;padding:4px;background:#fff;color:#63634e;font-size:10px;text-transform:uppercase;height:auto}.tag.success{color:var(--success-color, #28a745);background-color:#afecbd}.tag.pending{color:var(--warning-color, #f1a10a);background-color:#fdebca}.tag.info{color:var(--info-color, #17a2b8);background-color:#a7e9f4}.tag.danger{color:var(--error-color, #dc3545);background-color:#fae3e5}.tag.warning{color:var(--warning-color, #f1a10a);background-color:#fdebca}.tag.primary{color:var(--prim-color, #007bff);background-color:#cce5ff}.tag.muted,.tag.secondary{color:var(--muted-color, #888888);background-color:#eee}.tag.light{color:var(--prim-bg, #888888);background-color:#fff}.tag.default{color:var(--bg-color, #adb5bd);background-color:#fff}.tag.archived{color:var(--archived-color, #888888);background-color:#fff}.tag.processing{color:var(--processing-color, var(--info-color, #17a2b8));background-color:#a7e9f4}.tag.failed{color:var(--error-color, #dc3545);background-color:#fae3e5}.tag.queued{color:var(--info-color, #17a2b8);background-color:#a7e9f4}.tag.on-hold{color:var(--muted-color, #888888);background-color:#eee}.tag.suspended{color:var(--dark-color, #212529);background-color:#7e8b98}.tag.expired{color:var(--light-color, #f1f3f5);background-color:#fff}.tag.rejected{color:var(--error-color, #dc3545);background-color:#fae3e5}.tag.approved{color:var(--success-color, #28a745);background-color:#afecbd}.tag.active{color:var(--prim-color, #007bff);background-color:#cce5ff}.tag.draft{color:var(--text-color, #888888);background-color:#b0b6bc}.form-group{display:flex;align-items:center;gap:0}.form-group>*{border-radius:0;transition:.4s}.form-group>*:not(:last-child){border-right:none}.form-group>*:first-child{border-radius:5px 0 0 5px}.form-group>*:only-child{border-radius:5px!important}.form-group>*:last-child{border-radius:0 5px 5px 0}.form-group>*:focus{outline:none;box-shadow:none}.form-group>*:active{border-color:#e7e7e7}.form-group>*.active{background-color:#eee;color:#63634e}.form-group>*.active span{color:#63634e}.form-group>*.active i{color:#0173df}.checkbox-wrapper{padding:0}.checkbox-wrapper .cbx{-webkit-user-select:none;user-select:none;display:flex;gap:15px;align-items:center;justify-content:flex-start;min-width:55px;cursor:pointer}.checkbox-wrapper .cbx .btn{padding:0;height:auto}.checkbox-wrapper .cbx .checkbox{position:relative;width:24px;height:24px;border-radius:5px;border:2px solid #e7e7e7;transition:all .2s ease}.checkbox-wrapper .cbx .checkbox svg{position:absolute;top:6px;left:4px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:16px;stroke-dashoffset:16px;transition:all .3s ease;transition-delay:.1s}.checkbox-wrapper .cbx .checkbox:before{content:\"\";width:100%;height:100%;background:var();transform:scale(0);opacity:1;border-radius:50%;transition-delay:.2s}.checkbox-wrapper .inp-cbx{display:none}.checkbox-wrapper .inp-cbx:checked+.cbx .checkbox:first-child{border-color:#0173df;background:#0173df;animation:check-15 .3s ease}.checkbox-wrapper .inp-cbx:checked+.cbx .checkbox:first-child svg{stroke-dashoffset:0}.checkbox-wrapper .inp-cbx:checked+.cbx .checkbox:first-child:before{transform:scale(2.2);opacity:0;transition:all .3s ease}.progress{height:2px;overflow:inherit;background-color:#e7e7e7;margin-top:0}.progress .progress-bar{height:100%;position:relative;overflow:inherit}.progress .progress-bar .tag{width:auto;height:auto;position:absolute;z-index:999;right:-5px;top:-10px;opacity:.9;transition:.4s}.progress .progress-bar.success,.progress .progress-bar.success .tag{color:var(--success-color, #28a745);background-color:#afecbd}.progress .progress-bar.pending,.progress .progress-bar.pending .tag{color:var(--warning-color, #f1a10a);background-color:#fdebca}.progress .progress-bar.info,.progress .progress-bar.info .tag{color:var(--info-color, #17a2b8);background-color:#a7e9f4}.progress .progress-bar.danger,.progress .progress-bar.danger .tag{color:var(--error-color, #dc3545);background-color:#fae3e5}.progress .progress-bar.warning,.progress .progress-bar.warning .tag{color:var(--warning-color, #f1a10a);background-color:#fdebca}.progress .progress-bar.primary,.progress .progress-bar.primary .tag{color:var(--prim-color, #007bff);background-color:#cce5ff}.progress .progress-bar.muted,.progress .progress-bar.muted .tag,.progress .progress-bar.secondary,.progress .progress-bar.secondary .tag{color:var(--muted-color, #888888);background-color:#eee}.progress .progress-bar.light,.progress .progress-bar.light .tag{color:var(--prim-bg, #888888);background-color:#fff}.progress .progress-bar.default,.progress .progress-bar.default .tag{color:var(--bg-color, #adb5bd);background-color:#fff}.progress .progress-bar.archived,.progress .progress-bar.archived .tag{color:var(--archived-color, #888888);background-color:#fff}.progress .progress-bar.processing,.progress .progress-bar.processing .tag{color:var(--processing-color, var(--info-color, #17a2b8));background-color:#a7e9f4}.progress .progress-bar.failed,.progress .progress-bar.failed .tag{color:var(--error-color, #dc3545);background-color:#fae3e5}.progress .progress-bar.queued,.progress .progress-bar.queued .tag{color:var(--info-color, #17a2b8);background-color:#a7e9f4}.progress .progress-bar.on-hold,.progress .progress-bar.on-hold .tag{color:var(--muted-color, #888888);background-color:#eee}.progress .progress-bar.suspended,.progress .progress-bar.suspended .tag{color:var(--dark-color, #212529);background-color:#7e8b98}.progress .progress-bar.expired,.progress .progress-bar.expired .tag{color:var(--light-color, #f1f3f5);background-color:#fff}.progress .progress-bar.rejected,.progress .progress-bar.rejected .tag{color:var(--error-color, #dc3545);background-color:#fae3e5}.progress .progress-bar.approved,.progress .progress-bar.approved .tag{color:var(--success-color, #28a745);background-color:#afecbd}.progress .progress-bar.active,.progress .progress-bar.active .tag{color:var(--prim-color, #007bff);background-color:#cce5ff}.progress .progress-bar.draft,.progress .progress-bar.draft .tag{color:var(--text-color, #888888);background-color:#b0b6bc}.moringa-wraper{position:relative;border:1px solid #e7e7e7;border-radius:0;min-height:60px;padding-bottom:0;transition:.4s}@media (max-width: 768px){.moringa-wraper{box-shadow:none!important}}.moringa-wraper:hover ::-webkit-scrollbar{display:block!important}.moringa-wraper .date-picker{position:absolute;padding:15px;box-shadow:0 0 16px #0000001a;top:0}.moringa-wraper .moringa-wraper-header{background:none;padding:0;border-bottom:1px solid #e7e7e7;height:60px;position:absolute;z-index:1;width:100%;left:0;border-radius:8px 8px 0 0;justify-content:center;align-items:center;flex-direction:column}.moringa-wraper .moringa-wraper-header .container-fluid{height:60px;display:flex;align-items:center;justify-content:space-between}.moringa-wraper .moringa-wraper-header .inner{width:100%;display:flex;justify-content:space-between;align-items:center}.moringa-wraper .moringa-wraper-header .form-select,.moringa-wraper .moringa-wraper-header .form-control{font-size:12px}.moringa-wraper .moringa-wraper-header .mobile-btn{display:none}@media (max-width: 768px){.moringa-wraper .moringa-wraper-header .mobile-btn{display:block}}.moringa-wraper .moringa-wraper-header .title-icon{color:#888}.moringa-wraper .moringa-wraper-header .table-title{margin:0;font-size:16px;display:flex;justify-content:center;flex-direction:column;text-transform:capitalize;color:#63634e}.moringa-wraper .moringa-wraper-header .table-title i{color:#888;font-size:18px}.moringa-wraper .moringa-wraper-body{transition:.4s;margin-top:60px}.moringa-wraper .moringa-wraper-body.no-header{margin-top:0!important}.moringa-wraper.collapsed{padding-bottom:0;height:60px}.moringa-wraper.collapsed .moringa-wraper-header{border-bottom:1px solid transparent}.moringa-wraper.collapsed .moringa-wraper-header .progress{margin-top:-4px}.moringa-wraper.collapsed .moringa-wraper-body{max-height:0;opacity:0;padding:0;margin-top:45px}@media (max-width: 768px){.moringa-wraper .moringa-wraper-body{max-height:inherit;height:auto}}.moringa-wraper.round-card{border-radius:8px}.moringa-wraper.shadowed{background-color:#fff}.moringa-wraper.no-bg{border:none;box-shadow:none}.moringa-wraper.no-bg>.moringa-wraper-header{border:none;padding:0!important}.moringa-wraper.no-bg>.moringa-wraper-body{padding:0!important;margin-top:60px}.moringa-wraper .calendar-trigger{display:flex;align-items:center;gap:6px;padding:8px 12px;border:1px solid #ddd;border-radius:6px;background-color:#fff;cursor:pointer;font-weight:500;font-size:14px}.moringa-wraper .custom-calendar-popup{position:absolute;background:#eee;width:280px;border-radius:8px;box-shadow:0 0 16px #0000001a;padding:16px;z-index:99999;margin-top:10px}.moringa-wraper .custom-calendar-popup .calendar-header{display:flex;justify-content:space-between;gap:8px;margin-bottom:16px}.moringa-wraper .custom-calendar-popup .calendar-header select{padding:6px 10px;border-radius:6px;border:1px solid #ccc;font-size:14px;width:48%}.moringa-wraper .custom-calendar-popup .calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;gap:4px}.moringa-wraper .custom-calendar-popup .calendar-grid .day-name{font-weight:600;font-size:13px;color:#63634e}.moringa-wraper .custom-calendar-popup .calendar-grid .day-cell{padding:8px;font-size:14px;border-radius:6px;cursor:pointer;transition:background-color .2s}.moringa-wraper .custom-calendar-popup .calendar-grid .day-cell:hover{background-color:#f0f0f0}.moringa-wraper .custom-calendar-popup .calendar-grid .day-cell.active{background-color:#0173df;color:#fff;font-weight:600}.moringa-wraper .custom-calendar-popup .calendar-grid .day-cell:empty{pointer-events:none}.moringa-wraper .custom-calendar-popup .calendar-footer{display:flex;justify-content:space-between;margin-top:16px}.moringa-wraper .custom-calendar-popup .calendar-footer button{background:none;border:none;font-weight:600;font-size:14px;cursor:pointer;padding:4px 10px}.moringa-wraper .custom-calendar-popup .calendar-footer .cancel-btn{color:#999}.moringa-wraper .custom-calendar-popup .calendar-footer .confirm-btn{color:#0173df}.no-bg{border:none;background:none}table{width:100%;background:none}table .media-tile{display:flex;align-items:center;justify-content:flex-start;text-decoration:none;gap:15px}table .media-tile .media-img{background-color:#0173df;width:35px;height:35px;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;color:#fff;font-weight:700}table .media-tile .media-img i{font-size:40px}table .media-tile .media-img img{width:100%;height:100%;object-fit:cover}table .media-tile .media-img.success{background-color:var(--success-color, #28a745);border:3px solid rgb(175.1304347826,235.8695652174,189)}table .media-tile .media-img.pending{background-color:var(--warning-color, #f1a10a);border:3px solid rgb(252.8087649402,235.2788844622,202.1912350598)}table .media-tile .media-img.info{background-color:var(--info-color, #17a2b8);border:3px solid rgb(167,233.4782608696,244)}table .media-tile .media-img.danger{background-color:var(--error-color, #dc3545);border:3px solid rgb(250.1265822785,226.8734177215,229.1012658228)}table .media-tile .media-img.warning{background-color:var(--warning-color, #f1a10a);border:3px solid rgb(252.8087649402,235.2788844622,202.1912350598)}table .media-tile .media-img.primary{background-color:var(--prim-color, #007bff);border:3px solid rgb(204,228.6,255)}table .media-tile .media-img.muted,table .media-tile .media-img.secondary{background-color:var(--muted-color, #888888);border:3px solid #eeeeee}table .media-tile .media-img.light{background-color:var(--prim-bg, #888888);border:3px solid hsl(210,16.6666666667%,137.6470588235%)}table .media-tile .media-img.default{background-color:var(--bg-color, #adb5bd);border:3px solid hsl(210,10.8108108108%,110.9803921569%)}table .media-tile .media-img.archived{background-color:var(--archived-color, #888888);border:3px solid hsl(210,10.8108108108%,110.9803921569%)}table .media-tile .media-img.processing{background-color:var(--processing-color, var(--info-color, #17a2b8));border:3px solid rgb(167,233.4782608696,244)}table .media-tile .media-img.failed{background-color:var(--error-color, #dc3545);border:3px solid rgb(250.1265822785,226.8734177215,229.1012658228)}table .media-tile .media-img.queued{background-color:var(--info-color, #17a2b8);border:3px solid rgb(167,233.4782608696,244)}table .media-tile .media-img.on-hold{background-color:var(--muted-color, #888888);border:3px solid #eeeeee}table .media-tile .media-img.suspended{background-color:var(--dark-color, #212529);border:3px solid rgb(126.4594594595,139,151.5405405405)}table .media-tile .media-img.expired{background-color:var(--light-color, #f1f3f5);border:3px solid hsl(210,16.6666666667%,135.2941176471%)}table .media-tile .media-img.rejected{background-color:var(--error-color, #dc3545);border:3px solid rgb(250.1265822785,226.8734177215,229.1012658228)}table .media-tile .media-img.approved{background-color:var(--success-color, #28a745);border:3px solid rgb(175.1304347826,235.8695652174,189)}table .media-tile .media-img.active{background-color:var(--prim-color, #007bff);border:3px solid rgb(204,228.6,255)}table .media-tile .media-img.draft{background-color:var(--text-color, #888888);border:3px solid rgb(175.6125,182,188.3875)}table .media-tile .name{font-size:.8rem;text-align:left;width:100px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}table .media-tile .name p{font-size:.7;color:#888}table .ellipsize{max-width:200px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}table .key{display:none}table th{font-size:12px;font-weight:500;color:#888;text-transform:uppercase;padding:15px}table th:last-child>div{justify-content:flex-end}table thead{border-bottom:1px solid #e7e7e7;text-transform:capitalize}table tr{border-bottom:1px solid #e7e7e7;position:relative}table tr .mobile-btn{display:none;position:absolute;right:0;top:18px}table tr .mobile-btn .btn{border:none!important;background:none}table tr .mobile-btn .btn i{color:#888}table tr td{padding:15px;font-size:14px}table tr:last-child{border:none}table tfoot{border-top:1px solid #e7e7e7}@media (max-width: 992px){table.responsive tr{width:100%;display:flex;flex-direction:column}table.responsive .key{display:block}table.responsive thead{display:none}table.responsive tbody tr{max-height:80px;overflow:hidden}table.responsive tbody tr td{display:flex;flex-direction:column;justify-content:center}table.responsive tbody tr td:first-child{min-height:80px}table.responsive tbody tr .mobile-btn{display:flex}table.responsive tbody tr.dynamic-row{max-height:inherit;display:inline}}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i1.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "pipe", type: i1.DatePipe, name: "date" }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i2.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: NgMoringaTableComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-moringa-table', standalone: true, imports: [CommonModule, FormsModule], template: "<div class=\"moringa-wraper\"  [class.collapsed]=\"isCollapsed\">\r\n \r\n  <div class=\"moringa-wraper-header\" *ngIf=\"moringaHeader\">\r\n    <div class=\"container-fluid \">\r\n      \r\n        <div class=\"d-flex align-items-center gap-2\">\r\n          <ng-content select=\"[header-component]\"></ng-content>\r\n         <i class=\"title-icon\" *ngIf=\"icon\" [class]=\"icon\"></i>\r\n          <h6 class=\"table-title\"> \r\n            {{ title }}\r\n            <span class=\"text-muted\">{{ sub }}</span>\r\n          </h6>\r\n        </div>\r\n        <div class=\"d-flex align-items-center flex-wrap gap-2 justify-content-end\">\r\n          <div class=\"form-group mb-0\">\r\n            <button *ngIf=\"searchFilter\" class=\"btn \" (click)=\"toggleFilters()\">\r\n              <i class=\"bi bi-search\"></i>\r\n            </button>\r\n\r\n            <ng-container *ngIf=\"dataFilters\">\r\n\r\n              <select class=\"form-select\" [(ngModel)]=\"selectedOption\" (change)=\"applyFilters()\">\r\n                <option value=\"\">All</option>\r\n                <option *ngFor=\"let option of searchOptions\" [value]=\"option\">{{ option }}</option>\r\n              </select>\r\n\r\n              <!-- Keyword input -->\r\n              <input type=\"text\" class=\"form-control\" placeholder=\"Search...\" [(ngModel)]=\"searchKeyword\"\r\n                (ngModelChange)=\"onSearchKeywordChange($event)\" />\r\n\r\n              <!-- Date calendar button -->\r\n              <input class=\"btn\" (click)=\"toggleCalendar()\" style=\"min-width: 120px;\" value=\"{{ selectedDate | date: 'y, MMMM, d' }}\">\r\n              \r\n                \r\n           \r\n\r\n\r\n              <!-- Calendar Popup -->\r\n              <div class=\"date-picker\" *ngIf=\"datePicker\" style=\"min-width: 350px;\">\r\n                <div class=\"d-flex justify-content-between gap-2 mb-2\">\r\n                  <select class=\"form-select\" [(ngModel)]=\"selectedMonth\">\r\n                    <option *ngFor=\"let m of months; let i = index\" [value]=\"i\">{{ m }}</option>\r\n                  </select>\r\n                  <select class=\"form-select\" [(ngModel)]=\"selectedYear\">\r\n                    <option *ngFor=\"let y of years\" [value]=\"y\">{{ y }}</option>\r\n                  </select>\r\n                </div>\r\n\r\n                <div class=\"d-grid\" style=\"grid-template-columns: repeat(7, 1fr); gap: 4px;\">\r\n                  <div class=\"text-center fw-bold\" *ngFor=\"let d of dayNames\">{{ d }}</div>\r\n                  <div *ngFor=\"let day of calendarDays\" class=\"text-center p-1 border rounded\"\r\n                    [class.bg-primary]=\"isSelected(day)\" [class.text-white]=\"isSelected(day)\" (click)=\"selectDate(day)\"\r\n                    style=\"cursor: pointer;\">\r\n                    {{ day.getDate() }}\r\n                  </div>\r\n                </div>\r\n\r\n                <div class=\"d-flex justify-content-between mt-3\">\r\n                  <button class=\"btn btn-sm\" (click)=\"cancel()\">Cancel</button>\r\n                  <button class=\"btn btn-sm btn-primary\" (click)=\"confirm()\">Confirm</button>\r\n                </div>\r\n              </div>\r\n            </ng-container>\r\n          </div>\r\n          <div class=\"btn-group\" role=\"group\" aria-label=\"Basic example\">\r\n            <button *ngFor=\"let button of headerButtons\" type=\"button\" class=\"btn \" [id]=\"button.targetId\"\r\n              (click)=\"executeAction(button)\">\r\n              <i *ngIf=\"button.icon\" [class]=\"button.icon\"></i>\r\n              <span *ngIf=\"button.label\">{{ button.label }}</span>\r\n            </button>\r\n\r\n            <button *ngIf=\"collapsible\" class=\"btn \" type=\"button\" (click)=\"toggleCard()\">\r\n              <i [class]=\"isCollapsed ? 'bi bi-arrows-expand' : 'bi bi-arrows-collapse'\"></i>\r\n            </button>\r\n          </div>\r\n        </div>\r\n     \r\n    </div>\r\n    \r\n   <div *ngIf=\"progressBy\" class=\"progress\">\r\n      <div class=\"progress-bar\" [ngClass]=\"getStatusStyles(selectedOption || progressBy).progressClass\"\r\n        role=\"progressbar\" [style.width.%]=\"progressValue\" [attr.aria-valuenow]=\"progressValue\" aria-valuemin=\"0\"\r\n        aria-valuemax=\"100\">\r\n        <p class=\"tag\">{{ progressValue }}%</p>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  \r\n  <div class=\"moringa-wraper-body  p-0\">\r\n   \r\n    <div class=\"pt-2 \">\r\n      <table [ngClass]=\"variant\">\r\n        <thead>\r\n          <tr>\r\n            <th *ngFor=\"let column of columns; let colIndex = index\" (click)=\"Sorting ? sortByColumn(column.key) : null\"\r\n              class=\"text-nowrap text-start align-middle \" style=\"cursor: pointer;\" scope=\"col\">\r\n              <div class=\"d-flex align-items-center gap-2\">\r\n                <!-- Always show Select All checkbox -->\r\n                <ng-container *ngIf=\"colIndex === 0\">\r\n                  <div class=\"checkbox-wrapper\">\r\n                    <input class=\"inp-cbx\" [id]=\"prefix + '-cbx-header'\" type=\"checkbox\"\r\n                      (click)=\"$event.stopPropagation()\" (change)=\"toggleAllRows($event)\" [checked]=\"isAllSelected()\" />\r\n\r\n                    <label class=\"cbx\" [for]=\"prefix + '-cbx-header'\">\r\n                      <div class=\"checkbox\">\r\n                        <svg width=\"12px\" height=\"10px\" viewBox=\"0 0 12 10\">\r\n                          <polyline points=\"1.5 6 4.5 9 10.5 1\"></polyline>\r\n                        </svg>\r\n                      </div>\r\n                      <div *ngIf=\"selectedRows.length > 1\" class=\"dropdown \">\r\n                        <button class=\"btn no-bg p-0\" type=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\"\r\n                          (click)=\"$event.stopPropagation()\">\r\n                          <i class=\"bi bi-three-dots-vertical\"></i>\r\n                        </button>\r\n                        <ul class=\"dropdown-menu\">\r\n                          <li *ngFor=\"let btn of actionButtons\">\r\n                            <button class=\"dropdown-item\" (click)=\"handleBulkAction(btn)\">\r\n                              {{ btn.label }}\r\n                            </button>\r\n                          </li>\r\n                        </ul>\r\n                      </div>\r\n                    </label>\r\n                  </div>\r\n                </ng-container>\r\n                <!-- Column Label -->\r\n                <span>{{ column.label }}</span>\r\n\r\n                <!-- Sort Icon -->\r\n                <i *ngIf=\"Sorting\" class=\"ms-1\" [ngClass]=\"{\r\n        'bi bi-arrow-up': sortKey === column.key && sortAsc,\r\n        'bi bi-arrow-down': sortKey === column.key && !sortAsc,\r\n        'bi bi-arrow-down-up': sortKey !== column.key\r\n      }\"></i>\r\n              </div>\r\n            </th>\r\n          </tr>\r\n        </thead>\r\n        <tbody>\r\n          <tr *ngFor=\"let row of pagedData; let i = index; trackBy: trackByIndex\"\r\n            [ngClass]=\"{ 'dynamic-row': activeRowIndex === i }\">\r\n            <td *ngFor=\"let column of columns\"  >\r\n              <ng-container [ngSwitch]=\"column.key\">\r\n                <ng-container *ngSwitchCase=\"'profileImage'\">\r\n                  <div class=\"d-flex align-items-center\">\r\n                    <div class=\"checkbox-wrapper\">\r\n                      <input class=\"inp-cbx\" [id]=\"prefix + '-cbx-' + i\" type=\"checkbox\"\r\n                        (change)=\"toggleSelectRow(row, $event)\" [checked]=\"selectedRows.includes(row)\" />\r\n                      <label class=\"cbx\" [for]=\"prefix + '-cbx-' + i\">\r\n                        <div class=\"checkbox\">\r\n                          <svg width=\"12px\" height=\"10px\" viewBox=\"0 0 12 10\">\r\n                            <polyline points=\"1.5 6 4.5 9 10.5 1\"></polyline>\r\n                          </svg>\r\n                        </div>\r\n                        <p class=\"mb-0\"></p>\r\n                      </label>\r\n                    </div>\r\n                    <div class=\"media-tile\">\r\n                      <div class=\"media-img sm  round-md\" [ngClass]=\" statusMap[row.status]\">\r\n                        <img class=\"img-fluid\" [src]=\"row.profileImage || 'assets/dummy.jpg'\" alt=\"Profile Picture\"\r\n                          (error)=\"handleImageError($event)\" />\r\n                      </div>\r\n                      <div class=\"profile-details\">\r\n                        <p class=\"mb-0 name  text-dark\">{{ row.name || 'Unknown' }}</p>\r\n                        <p class=\"mb-0 text-muted\">{{ row.source || 'No Information' }}</p>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </ng-container>\r\n                <ng-container *ngSwitchCase=\"'status'\">\r\n                  <span [ngClass]=\"getStatusStyles(row.status).tagClass\">\r\n                    {{ getValue(row, column.key) }}\r\n                  </span>\r\n                </ng-container>\r\n                <ng-container *ngSwitchCase=\"'action'\">\r\n                  <div class=\"form-group align-right mb-0\">\r\n                    <ng-container *ngFor=\"let btn of actionButtons\">\r\n                      <button *ngIf=\"!btn.isDropdown\" class=\"btn btn-sm\" [ngClass]=\"btn.className\"\r\n                        [attr.title]=\"btn.tooltip\" (click)=\"handleButtonClick(btn, row)\">\r\n                        <i *ngIf=\"btn.icon\" [class]=\"btn.icon\"></i>\r\n\r\n                      </button>\r\n                      <div *ngIf=\"btn.isDropdown\" class=\"dropdown btn btn-sm\">\r\n                        <button class=\"btn no-bg dropdown-toggle\" type=\"button\" data-bs-toggle=\"dropdown\"\r\n                          [ngClass]=\"btn.className\" [attr.title]=\"btn.tooltip\">\r\n                          {{ btn.label }}\r\n                        </button>\r\n                        <ul class=\"dropdown-menu\">\r\n                          <li *ngFor=\"let option of btn.options\">\r\n                            <button class=\"dropdown-item\" (click)=\"handleDropdownClick(option, btn, row)\">\r\n                              {{ option }}\r\n                            </button>\r\n                          </li>\r\n                        </ul>\r\n                      </div>\r\n                    </ng-container>\r\n                  </div>\r\n                </ng-container>\r\n                <ng-container *ngSwitchDefault>\r\n                  <span class=\"value\">{{ getValue(row, column.key) }}</span>\r\n                </ng-container>\r\n              </ng-container>\r\n            </td>\r\n            <td class=\"mobile-btn\">\r\n              <button class=\"btn\" (click)=\"toggleRowClass(i)\">\r\n                <i [ngClass]=\"{\r\n                'bi bi-chevron-down': activeRowIndex === i,\r\n                'bi bi-chevron-right': activeRowIndex !== i\r\n              }\"></i>\r\n              </button>\r\n            </td>\r\n          </tr>\r\n          <tr *ngIf=\"pagedData.length === 0\">\r\n            <td [attr.colspan]=\"columns.length + 2\" class=\"text-center py-3\">\r\n              No records found.\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n        <tfoot *ngIf=\"paginated\">\r\n          <tr>\r\n            <td [attr.colspan]=\"columns.length + 1\">\r\n              <div class=\"pagination form-group justify-content-end \">\r\n                <button class=\"btn\" (click)=\"prevPage()\" [disabled]=\"currentPage === 1\">\r\n                  <i class=\"bi bi-chevron-left\"></i>\r\n                </button>\r\n                <span class=\"btn\">Page {{ currentPage }} of {{ totalPages }}</span>\r\n                <button class=\"btn\" (click)=\"nextPage()\" [disabled]=\"currentPage === totalPages\">\r\n                  <i class=\"bi bi-chevron-right\"></i>\r\n                </button>\r\n              </div>\r\n            </td>\r\n          </tr>\r\n        </tfoot>\r\n      </table>\r\n    </div>\r\n  </div>\r\n</div>", styles: [".btn,.form-select,.form-control{border:1px solid #e7e7e7;color:#888;height:35px;outline:none}.btn:focus,.form-select:focus,.form-control:focus{border-color:#e7e7e7;box-shadow:none;color:#63634e}.btn{font-size:12px;display:flex;align-items:center;justify-content:center;gap:5px;border:1px solid #e7e7e7;color:#63634e;height:35px}.btn i{font-size:12px;color:#888}.btn:focus{box-shadow:none}.btn:disabled{border-color:#e7e7e7}.btn span{font-size:12px;color:#888}.btn.success{color:#28a745}.btn.pending{color:#f1a10a}.btn.info{color:#17a2b8}.btn.danger{color:#dc3545}.btn.warning{color:#f1a10a}.btn.primary{color:#007bff}.btn.muted,.btn.secondary{color:#888}.btn.light{color:#f8f9fa}.btn.default,.btn.archived{color:#adb5bd}.btn.processing{color:#17a2b8}.btn.failed{color:#dc3545}.btn.queued{color:#17a2b8}.btn.on-hold{color:#888}.btn.suspended{color:#212529}.btn.expired{color:#f1f3f5}.btn.rejected{color:#dc3545}.btn.approved{color:#28a745}.btn.active{color:#007bff}.btn.draft{color:#495057}.tag{border-radius:8px;padding:4px;background:#fff;color:#63634e;font-size:10px;text-transform:uppercase;height:auto}.tag.success{color:var(--success-color, #28a745);background-color:#afecbd}.tag.pending{color:var(--warning-color, #f1a10a);background-color:#fdebca}.tag.info{color:var(--info-color, #17a2b8);background-color:#a7e9f4}.tag.danger{color:var(--error-color, #dc3545);background-color:#fae3e5}.tag.warning{color:var(--warning-color, #f1a10a);background-color:#fdebca}.tag.primary{color:var(--prim-color, #007bff);background-color:#cce5ff}.tag.muted,.tag.secondary{color:var(--muted-color, #888888);background-color:#eee}.tag.light{color:var(--prim-bg, #888888);background-color:#fff}.tag.default{color:var(--bg-color, #adb5bd);background-color:#fff}.tag.archived{color:var(--archived-color, #888888);background-color:#fff}.tag.processing{color:var(--processing-color, var(--info-color, #17a2b8));background-color:#a7e9f4}.tag.failed{color:var(--error-color, #dc3545);background-color:#fae3e5}.tag.queued{color:var(--info-color, #17a2b8);background-color:#a7e9f4}.tag.on-hold{color:var(--muted-color, #888888);background-color:#eee}.tag.suspended{color:var(--dark-color, #212529);background-color:#7e8b98}.tag.expired{color:var(--light-color, #f1f3f5);background-color:#fff}.tag.rejected{color:var(--error-color, #dc3545);background-color:#fae3e5}.tag.approved{color:var(--success-color, #28a745);background-color:#afecbd}.tag.active{color:var(--prim-color, #007bff);background-color:#cce5ff}.tag.draft{color:var(--text-color, #888888);background-color:#b0b6bc}.form-group{display:flex;align-items:center;gap:0}.form-group>*{border-radius:0;transition:.4s}.form-group>*:not(:last-child){border-right:none}.form-group>*:first-child{border-radius:5px 0 0 5px}.form-group>*:only-child{border-radius:5px!important}.form-group>*:last-child{border-radius:0 5px 5px 0}.form-group>*:focus{outline:none;box-shadow:none}.form-group>*:active{border-color:#e7e7e7}.form-group>*.active{background-color:#eee;color:#63634e}.form-group>*.active span{color:#63634e}.form-group>*.active i{color:#0173df}.checkbox-wrapper{padding:0}.checkbox-wrapper .cbx{-webkit-user-select:none;user-select:none;display:flex;gap:15px;align-items:center;justify-content:flex-start;min-width:55px;cursor:pointer}.checkbox-wrapper .cbx .btn{padding:0;height:auto}.checkbox-wrapper .cbx .checkbox{position:relative;width:24px;height:24px;border-radius:5px;border:2px solid #e7e7e7;transition:all .2s ease}.checkbox-wrapper .cbx .checkbox svg{position:absolute;top:6px;left:4px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:16px;stroke-dashoffset:16px;transition:all .3s ease;transition-delay:.1s}.checkbox-wrapper .cbx .checkbox:before{content:\"\";width:100%;height:100%;background:var();transform:scale(0);opacity:1;border-radius:50%;transition-delay:.2s}.checkbox-wrapper .inp-cbx{display:none}.checkbox-wrapper .inp-cbx:checked+.cbx .checkbox:first-child{border-color:#0173df;background:#0173df;animation:check-15 .3s ease}.checkbox-wrapper .inp-cbx:checked+.cbx .checkbox:first-child svg{stroke-dashoffset:0}.checkbox-wrapper .inp-cbx:checked+.cbx .checkbox:first-child:before{transform:scale(2.2);opacity:0;transition:all .3s ease}.progress{height:2px;overflow:inherit;background-color:#e7e7e7;margin-top:0}.progress .progress-bar{height:100%;position:relative;overflow:inherit}.progress .progress-bar .tag{width:auto;height:auto;position:absolute;z-index:999;right:-5px;top:-10px;opacity:.9;transition:.4s}.progress .progress-bar.success,.progress .progress-bar.success .tag{color:var(--success-color, #28a745);background-color:#afecbd}.progress .progress-bar.pending,.progress .progress-bar.pending .tag{color:var(--warning-color, #f1a10a);background-color:#fdebca}.progress .progress-bar.info,.progress .progress-bar.info .tag{color:var(--info-color, #17a2b8);background-color:#a7e9f4}.progress .progress-bar.danger,.progress .progress-bar.danger .tag{color:var(--error-color, #dc3545);background-color:#fae3e5}.progress .progress-bar.warning,.progress .progress-bar.warning .tag{color:var(--warning-color, #f1a10a);background-color:#fdebca}.progress .progress-bar.primary,.progress .progress-bar.primary .tag{color:var(--prim-color, #007bff);background-color:#cce5ff}.progress .progress-bar.muted,.progress .progress-bar.muted .tag,.progress .progress-bar.secondary,.progress .progress-bar.secondary .tag{color:var(--muted-color, #888888);background-color:#eee}.progress .progress-bar.light,.progress .progress-bar.light .tag{color:var(--prim-bg, #888888);background-color:#fff}.progress .progress-bar.default,.progress .progress-bar.default .tag{color:var(--bg-color, #adb5bd);background-color:#fff}.progress .progress-bar.archived,.progress .progress-bar.archived .tag{color:var(--archived-color, #888888);background-color:#fff}.progress .progress-bar.processing,.progress .progress-bar.processing .tag{color:var(--processing-color, var(--info-color, #17a2b8));background-color:#a7e9f4}.progress .progress-bar.failed,.progress .progress-bar.failed .tag{color:var(--error-color, #dc3545);background-color:#fae3e5}.progress .progress-bar.queued,.progress .progress-bar.queued .tag{color:var(--info-color, #17a2b8);background-color:#a7e9f4}.progress .progress-bar.on-hold,.progress .progress-bar.on-hold .tag{color:var(--muted-color, #888888);background-color:#eee}.progress .progress-bar.suspended,.progress .progress-bar.suspended .tag{color:var(--dark-color, #212529);background-color:#7e8b98}.progress .progress-bar.expired,.progress .progress-bar.expired .tag{color:var(--light-color, #f1f3f5);background-color:#fff}.progress .progress-bar.rejected,.progress .progress-bar.rejected .tag{color:var(--error-color, #dc3545);background-color:#fae3e5}.progress .progress-bar.approved,.progress .progress-bar.approved .tag{color:var(--success-color, #28a745);background-color:#afecbd}.progress .progress-bar.active,.progress .progress-bar.active .tag{color:var(--prim-color, #007bff);background-color:#cce5ff}.progress .progress-bar.draft,.progress .progress-bar.draft .tag{color:var(--text-color, #888888);background-color:#b0b6bc}.moringa-wraper{position:relative;border:1px solid #e7e7e7;border-radius:0;min-height:60px;padding-bottom:0;transition:.4s}@media (max-width: 768px){.moringa-wraper{box-shadow:none!important}}.moringa-wraper:hover ::-webkit-scrollbar{display:block!important}.moringa-wraper .date-picker{position:absolute;padding:15px;box-shadow:0 0 16px #0000001a;top:0}.moringa-wraper .moringa-wraper-header{background:none;padding:0;border-bottom:1px solid #e7e7e7;height:60px;position:absolute;z-index:1;width:100%;left:0;border-radius:8px 8px 0 0;justify-content:center;align-items:center;flex-direction:column}.moringa-wraper .moringa-wraper-header .container-fluid{height:60px;display:flex;align-items:center;justify-content:space-between}.moringa-wraper .moringa-wraper-header .inner{width:100%;display:flex;justify-content:space-between;align-items:center}.moringa-wraper .moringa-wraper-header .form-select,.moringa-wraper .moringa-wraper-header .form-control{font-size:12px}.moringa-wraper .moringa-wraper-header .mobile-btn{display:none}@media (max-width: 768px){.moringa-wraper .moringa-wraper-header .mobile-btn{display:block}}.moringa-wraper .moringa-wraper-header .title-icon{color:#888}.moringa-wraper .moringa-wraper-header .table-title{margin:0;font-size:16px;display:flex;justify-content:center;flex-direction:column;text-transform:capitalize;color:#63634e}.moringa-wraper .moringa-wraper-header .table-title i{color:#888;font-size:18px}.moringa-wraper .moringa-wraper-body{transition:.4s;margin-top:60px}.moringa-wraper .moringa-wraper-body.no-header{margin-top:0!important}.moringa-wraper.collapsed{padding-bottom:0;height:60px}.moringa-wraper.collapsed .moringa-wraper-header{border-bottom:1px solid transparent}.moringa-wraper.collapsed .moringa-wraper-header .progress{margin-top:-4px}.moringa-wraper.collapsed .moringa-wraper-body{max-height:0;opacity:0;padding:0;margin-top:45px}@media (max-width: 768px){.moringa-wraper .moringa-wraper-body{max-height:inherit;height:auto}}.moringa-wraper.round-card{border-radius:8px}.moringa-wraper.shadowed{background-color:#fff}.moringa-wraper.no-bg{border:none;box-shadow:none}.moringa-wraper.no-bg>.moringa-wraper-header{border:none;padding:0!important}.moringa-wraper.no-bg>.moringa-wraper-body{padding:0!important;margin-top:60px}.moringa-wraper .calendar-trigger{display:flex;align-items:center;gap:6px;padding:8px 12px;border:1px solid #ddd;border-radius:6px;background-color:#fff;cursor:pointer;font-weight:500;font-size:14px}.moringa-wraper .custom-calendar-popup{position:absolute;background:#eee;width:280px;border-radius:8px;box-shadow:0 0 16px #0000001a;padding:16px;z-index:99999;margin-top:10px}.moringa-wraper .custom-calendar-popup .calendar-header{display:flex;justify-content:space-between;gap:8px;margin-bottom:16px}.moringa-wraper .custom-calendar-popup .calendar-header select{padding:6px 10px;border-radius:6px;border:1px solid #ccc;font-size:14px;width:48%}.moringa-wraper .custom-calendar-popup .calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;gap:4px}.moringa-wraper .custom-calendar-popup .calendar-grid .day-name{font-weight:600;font-size:13px;color:#63634e}.moringa-wraper .custom-calendar-popup .calendar-grid .day-cell{padding:8px;font-size:14px;border-radius:6px;cursor:pointer;transition:background-color .2s}.moringa-wraper .custom-calendar-popup .calendar-grid .day-cell:hover{background-color:#f0f0f0}.moringa-wraper .custom-calendar-popup .calendar-grid .day-cell.active{background-color:#0173df;color:#fff;font-weight:600}.moringa-wraper .custom-calendar-popup .calendar-grid .day-cell:empty{pointer-events:none}.moringa-wraper .custom-calendar-popup .calendar-footer{display:flex;justify-content:space-between;margin-top:16px}.moringa-wraper .custom-calendar-popup .calendar-footer button{background:none;border:none;font-weight:600;font-size:14px;cursor:pointer;padding:4px 10px}.moringa-wraper .custom-calendar-popup .calendar-footer .cancel-btn{color:#999}.moringa-wraper .custom-calendar-popup .calendar-footer .confirm-btn{color:#0173df}.no-bg{border:none;background:none}table{width:100%;background:none}table .media-tile{display:flex;align-items:center;justify-content:flex-start;text-decoration:none;gap:15px}table .media-tile .media-img{background-color:#0173df;width:35px;height:35px;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;color:#fff;font-weight:700}table .media-tile .media-img i{font-size:40px}table .media-tile .media-img img{width:100%;height:100%;object-fit:cover}table .media-tile .media-img.success{background-color:var(--success-color, #28a745);border:3px solid rgb(175.1304347826,235.8695652174,189)}table .media-tile .media-img.pending{background-color:var(--warning-color, #f1a10a);border:3px solid rgb(252.8087649402,235.2788844622,202.1912350598)}table .media-tile .media-img.info{background-color:var(--info-color, #17a2b8);border:3px solid rgb(167,233.4782608696,244)}table .media-tile .media-img.danger{background-color:var(--error-color, #dc3545);border:3px solid rgb(250.1265822785,226.8734177215,229.1012658228)}table .media-tile .media-img.warning{background-color:var(--warning-color, #f1a10a);border:3px solid rgb(252.8087649402,235.2788844622,202.1912350598)}table .media-tile .media-img.primary{background-color:var(--prim-color, #007bff);border:3px solid rgb(204,228.6,255)}table .media-tile .media-img.muted,table .media-tile .media-img.secondary{background-color:var(--muted-color, #888888);border:3px solid #eeeeee}table .media-tile .media-img.light{background-color:var(--prim-bg, #888888);border:3px solid hsl(210,16.6666666667%,137.6470588235%)}table .media-tile .media-img.default{background-color:var(--bg-color, #adb5bd);border:3px solid hsl(210,10.8108108108%,110.9803921569%)}table .media-tile .media-img.archived{background-color:var(--archived-color, #888888);border:3px solid hsl(210,10.8108108108%,110.9803921569%)}table .media-tile .media-img.processing{background-color:var(--processing-color, var(--info-color, #17a2b8));border:3px solid rgb(167,233.4782608696,244)}table .media-tile .media-img.failed{background-color:var(--error-color, #dc3545);border:3px solid rgb(250.1265822785,226.8734177215,229.1012658228)}table .media-tile .media-img.queued{background-color:var(--info-color, #17a2b8);border:3px solid rgb(167,233.4782608696,244)}table .media-tile .media-img.on-hold{background-color:var(--muted-color, #888888);border:3px solid #eeeeee}table .media-tile .media-img.suspended{background-color:var(--dark-color, #212529);border:3px solid rgb(126.4594594595,139,151.5405405405)}table .media-tile .media-img.expired{background-color:var(--light-color, #f1f3f5);border:3px solid hsl(210,16.6666666667%,135.2941176471%)}table .media-tile .media-img.rejected{background-color:var(--error-color, #dc3545);border:3px solid rgb(250.1265822785,226.8734177215,229.1012658228)}table .media-tile .media-img.approved{background-color:var(--success-color, #28a745);border:3px solid rgb(175.1304347826,235.8695652174,189)}table .media-tile .media-img.active{background-color:var(--prim-color, #007bff);border:3px solid rgb(204,228.6,255)}table .media-tile .media-img.draft{background-color:var(--text-color, #888888);border:3px solid rgb(175.6125,182,188.3875)}table .media-tile .name{font-size:.8rem;text-align:left;width:100px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}table .media-tile .name p{font-size:.7;color:#888}table .ellipsize{max-width:200px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}table .key{display:none}table th{font-size:12px;font-weight:500;color:#888;text-transform:uppercase;padding:15px}table th:last-child>div{justify-content:flex-end}table thead{border-bottom:1px solid #e7e7e7;text-transform:capitalize}table tr{border-bottom:1px solid #e7e7e7;position:relative}table tr .mobile-btn{display:none;position:absolute;right:0;top:18px}table tr .mobile-btn .btn{border:none!important;background:none}table tr .mobile-btn .btn i{color:#888}table tr td{padding:15px;font-size:14px}table tr:last-child{border:none}table tfoot{border-top:1px solid #e7e7e7}@media (max-width: 992px){table.responsive tr{width:100%;display:flex;flex-direction:column}table.responsive .key{display:block}table.responsive thead{display:none}table.responsive tbody tr{max-height:80px;overflow:hidden}table.responsive tbody tr td{display:flex;flex-direction:column;justify-content:center}table.responsive tbody tr td:first-child{min-height:80px}table.responsive tbody tr .mobile-btn{display:flex}table.responsive tbody tr.dynamic-row{max-height:inherit;display:inline}}\n"] }]
        }], propDecorators: { type: [{
                type: Input
            }], data: [{
                type: Input
            }], columns: [{
                type: Input
            }], showActions: [{
                type: Input
            }], variant: [{
                type: Input
            }], imgstatus: [{
                type: Input
            }], title: [{
                type: Input
            }], sub: [{
                type: Input
            }], icon: [{
                type: Input
            }], moringaHeader: [{
                type: Input
            }], showFooter: [{
                type: Input
            }], collapsible: [{
                type: Input
            }], idPrefix: [{
                type: Input
            }], headerButtons: [{
                type: Input
            }], actionButtons: [{
                type: Input
            }], searchBy: [{
                type: Input
            }], searchFilter: [{
                type: Input
            }], Sorting: [{
                type: Input
            }], autoGenerateColumns: [{
                type: Input
            }], excludeColumns: [{
                type: Input
            }], progressBy: [{
                type: Input
            }], paginated: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], statusMap: [{
                type: Input
            }], rowAction: [{
                type: Output
            }] } });

class NgMoringaTableModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: NgMoringaTableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.2.14", ngImport: i0, type: NgMoringaTableModule, imports: [CommonModule,
            FormsModule,
            NgMoringaTableComponent // ✅ IMPORT instead of DECLARE
        ], exports: [NgMoringaTableComponent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: NgMoringaTableModule, imports: [CommonModule,
            FormsModule,
            NgMoringaTableComponent // ✅ IMPORT instead of DECLARE
        ] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: NgMoringaTableModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        NgMoringaTableComponent // ✅ IMPORT instead of DECLARE
                    ],
                    exports: [NgMoringaTableComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { NgMoringaTableComponent, NgMoringaTableModule };
//# sourceMappingURL=ng-moringa-table.mjs.map
