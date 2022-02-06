import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import Chart from 'chart.js/auto';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
@Component({
  selector: 'app-lightning-graph',
  templateUrl: './lightning-graph.component.html',
  styleUrls: ['./lightning-graph.component.scss'],
})
export class LightningGraphComponent implements OnInit {
  @Input() graphData;

  barChart;
  context: any;
  canvaElement: any;
  district;
  district_ory;
  lHelper;
  constructor(langHelper: LanguageHelperService) {
    this.lHelper = langHelper;
  }
  ngAfterViewInit() {
    this.loadGraph();
  }

  ngOnInit() {}

  ngOnChanges() {
    if (this.graphData != null) {
      this.loadGraph();
      console.log(this.graphData);
    }
  }
  loadGraph() {
    let chartStatus = Chart.getChart(this.canvaElement);
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
    this.district = this.graphData?.districtName;
    this.district_ory = this.graphData?.districtNameOry;
    console.log(this.district);
    this.canvaElement = <HTMLCanvasElement>document.getElementById('myChart');
    this.context = this.canvaElement.getContext('2d');
    this.barChart = new Chart(this.context, {
      type: 'bar',
      data: {
        labels: this.graphData?.period,
        datasets: [
          {
            label: '# of deaths',
            data: this.graphData?.deaths,
            backgroundColor: 'rgba(0, 102, 166,1)',
            borderColor: 'rgba(0, 102, 166, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(0, 102, 200,1)',
            hoverBorderWidth: 2,
            hoverBorderColor: 'rgba(0, 102, 166,1)',
          },
        ],
      },
      options: {
        transitions: {
          show: {
            animations: {
              x: {
                from: 0,
              },
              y: {
                from: 0,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              font: {
                size: 10,
                weight: 'bolder',
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Deaths',
              padding: 10,
              color: '#0066A6',
              font: {
                weight: 'bolder',
              },
            },
          },
          x: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
