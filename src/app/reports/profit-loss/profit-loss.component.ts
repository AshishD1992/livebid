import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { CellClassParams } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss'],
  providers: [DatePipe]
})
export class ProfitLossComponent implements OnInit {
  dataa: any;
  startDate: Date;
  endDate: Date;
  startformat: any;
  endformat: any;

  constructor(private reportService: ReportService, private dateformat: DatePipe) {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.endDate.setDate(this.endDate.getDate());
  }
  columnDefs = [
    { headerName: 'Settled', field: 'settleDate', width: 200 },
    {
      headerName: ' Market Name', field: 'market', width: 500,
    },
    { headerName: 'Profit/Loss', field: 'pnl', width: 200, },
    {
      headerName: ' Market Name', field: 'market', width: 500, cellClass: (params: CellClassParams) => params.value ? 'blue' : 'blue',
    },
    { headerName: 'Profit/Loss', field: 'pnl', width: 200, cellClass: (params: CellClassParams) => params.value > 0 ? 'text-success' : 'text-danger', },
  ];
  rowData = [];

  gridOptions = {
    // enable sorting on all columns by default
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      lockPosition: true,
    }
  };

  ngOnInit(): void {
    this.pnl()
  }
  pnl() {
    this.startformat = this.dateformat.transform(this.startDate, 'yyyy-MM-dd 00:00:00');
    this.endformat = this.dateformat.transform(this.endDate, 'yyyy-MM-dd 23:59:00');
    this.reportService.GetProfitLoss(this.startformat, this.endformat).subscribe(data => {
      this.dataa = data.data;
      console.log(this.dataa);

    })


  }

}
