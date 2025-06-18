import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CardButton {
  label?: string;
  icon?: string;
  targetId: string;
  action?: () => void;
}

interface ActionButton {
  label?: string;
  tooltip: string;
  icon?: string;
  className?: string;
  isDropdown?: boolean;
  options?: string[];
  action?: (row: any) => void;
  dropdownAction?: (selected: string, row: any) => void;
}

let uniqueCounter = 0;
@Component({
  selector: 'ng-smart-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ng-smart-table.component.html',
  styleUrls: ['./ng-smart-table.component.css']
})
export class NGSmartTableComponent implements OnInit, OnChanges {
  @Input() type!: string;
  @Input() data: any[] = [];
  @Input() columns: { key: string; label: string }[] = [];
  @Input() showActions = true;
  @Input() variant = '';
  @Input() imgstatus = '';
  @Input() title?: string;
  @Input() sub?: string;
  @Input() icon?: string;
  @Input() showHeader = true;
  @Input() showFooter = false;
  @Input() collapsible = false;
  @Input() idPrefix?: string;
  @Input() headerButtons: CardButton[] = [];
  @Input() actionButtons: ActionButton[] = [];
  @Input() searchBy?: string;
  @Input() searchFilter = false;
  @Input() Sorting = false;
  @Input() autoGenerateColumns = true;
  @Input() excludeColumns: string[] = [];
  @Input() progressBy?: string;
  @Input() paginated = false;
  @Input() pageSize = 10;
  @Input() statusMap: Record<string, string> = {};
  @Output() rowAction = new EventEmitter<{ action: string; row: any }>();

  internalIdPrefix!: string;
  isCollapsed = false;
  activeRowIndex: number | null = null;
  selectedRows: any[] = [];
  filteredData: any[] = [];

  dataFilters = false;
  searchKeyword = '';
  selectedOption = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  currentPage = 1;

  selectedDate = new Date();
  selectedMonth = this.selectedDate.getMonth();
  selectedYear = this.selectedDate.getFullYear();
  datePicker = false;

  sortKey: string | null = null;
  sortAsc = true;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  years = Array.from({ length: 100 }, (_, i) => 1980 + i);
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: Date[] = [];

  ngOnInit(): void {
    this.internalIdPrefix = this.idPrefix || `smart-table-${uniqueCounter++}`;
    this.normalizeActionButtons();
    this.setColumns();
    this.filteredData = [...this.data];
    this.applyFilters();
  }

  ngOnChanges(): void {
    this.applyFilters();
  }

  toggleFilters(): void {
    this.dataFilters = !this.dataFilters;
    if (!this.dataFilters) {
      this.datePicker = false;
    }
  }

  applyFilters(): void {
    this.filteredData = this.data.filter(item => {
      const keywordMatch = !this.searchKeyword ||
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(this.searchKeyword.toLowerCase())
        );

      const optionMatch = !this.selectedOption || item[this.searchKey] === this.selectedOption;

      const itemDate = item.date ? new Date(item.date) : null;
      const dateMatch =
        (!this.startDate || (itemDate && itemDate >= this.startDate)) &&
        (!this.endDate || (itemDate && itemDate <= this.endDate));

      return keywordMatch && optionMatch && dateMatch;
    });

    if (this.sortKey) {
      this.filteredData.sort((a, b) => {
        const aVal = a[this.sortKey!];
        const bVal = b[this.sortKey!];
        return this.sortAsc
          ? (aVal > bVal ? 1 : aVal < bVal ? -1 : 0)
          : (aVal < bVal ? 1 : aVal > bVal ? -1 : 0);
      });
    }

    this.currentPage = 1;
  }

  sortByColumn(key: string): void {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  onSearchKeywordChange(value: string): void {
    this.searchKeyword = value;
    this.applyFilters();
  }

  onSearchOptionChange(event: Event): void {
    this.selectedOption = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  toggleCalendar(): void {
    this.datePicker = !this.datePicker;
    this.generateCalendar();
  }

  generateCalendar(): void {
    const date = new Date(this.selectedYear, this.selectedMonth, 1);
    const days: Date[] = [];

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

  selectDate(date: Date): void {
    if (!isNaN(date.getTime())) {
      this.selectedDate = new Date(date);
    }
  }

  isSelected(date: Date): boolean {
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  cancel(): void {
    this.datePicker = false;
  }

  confirm(): void {
    this.startDate = this.selectedDate;
    this.endDate = this.selectedDate;
    this.applyFilters();
    this.datePicker = false;
  }

  setColumns(): void {
    if ((!this.columns || this.columns.length === 0) && this.autoGenerateColumns && this.data.length > 0) {
      const keys = Object.keys(this.data[0]).filter(k => !this.excludeColumns.includes(k));
      this.columns = keys.map(key => ({ key, label: this.toLabel(key) }));
    }

    if (this.showActions && this.actionButtons.length > 0 && !this.columns.some(c => c.key === 'action')) {
      this.columns.push({ key: 'action', label: 'Actions' });
    }
  }

  normalizeActionButtons(): void {
    this.actionButtons = this.actionButtons.map(btn =>
      typeof btn === 'string' ? { label: btn, tooltip: btn, className: 'btn' } : btn
    );
  }

  get prefix(): string {
    return this.internalIdPrefix;
  }

  get shouldShowSearchOptions(): boolean {
    return !!this.searchBy;
  }

  get searchKey(): string {
    return this.searchBy || '';
  }

  /** ✅ FIXED HERE */
  get searchOptions(): string[] {
    return [...new Set(this.data.map(item => item[this.searchKey]).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));
  }

  get pagedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.paginated ? this.filteredData.slice(start, start + this.pageSize) : this.filteredData;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get progressValue(): number {
    if (!this.progressBy || !this.searchKey || !this.data.length) return 0;

    const statusToCheck = this.selectedOption || this.progressBy;

    const total = this.data.length;
    const match = this.data.filter(item => item[this.searchKey] === statusToCheck).length;

    return Math.round((match / total) * 100);
  }

getStatusStyles(status: string): { tagClass: string; progressClass: string } {
  const key = status?.toLowerCase() || '';
  const color = this.statusMap?.[key] || 'info';
  return {
    tagClass: `tag ${color}`,
    progressClass: `progress-bar ${color}`
  };
}


  getValue(row: any, key: string): string {
    const val = row?.[key];
    return val !== undefined && val !== null ? String(val) : '-';
  }

  handleImageError(e: Event): void {
    (e.target as HTMLImageElement).src = 'assets/dummy.jpg';
  }

  handleButtonClick(btn: ActionButton, row: any): void {
    btn.action?.(row);
    this.rowAction.emit({ action: btn.label || '', row });
  }

  handleDropdownClick(option: string, btn: ActionButton, row: any): void {
    btn.dropdownAction?.(option, row);
  }

  toggleRowClass(i: number): void {
    this.activeRowIndex = this.activeRowIndex === i ? null : i;
  }

  toggleCard(): void {
    if (this.collapsible) this.isCollapsed = !this.isCollapsed;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  toggleSelectRow(row: any, e: Event): void {
    const cb = e.target as HTMLInputElement;
    cb.checked
      ? this.selectedRows.push(row)
      : this.selectedRows = this.selectedRows.filter(r => r !== row);
  }

  toggleAllRows(e: Event): void {
    const cb = e.target as HTMLInputElement;
    this.selectedRows = cb.checked ? [...this.pagedData] : [];
  }

  isAllSelected(): boolean {
    return this.pagedData.length > 0 && this.selectedRows.length === this.pagedData.length;
  }

  handleBulkAction(btn: ActionButton): void {
    if (!this.selectedRows.length) return alert('Please select at least one row.');
    if (btn.action) this.selectedRows.forEach(row => btn.action!(row));
    if (btn.dropdownAction && btn.options?.length) {
      const userChoice = prompt(`Choose an option: ${btn.options.join(', ')}`) || btn.options[0];
      this.selectedRows.forEach(row => btn.dropdownAction!(userChoice, row));
    }
  }

  executeAction(button: CardButton): void {
    button.action?.();
  }

  toLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  trackByIndex(index: number): number {
    return index;
  }

  get categoryBreakdown(): { name: string; count: number; percent: number }[] {
    if (!this.searchKey) return [];

    const total = this.filteredData.length;
    const counts: Record<string, number> = {};

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
}
