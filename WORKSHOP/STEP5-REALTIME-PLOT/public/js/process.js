var toneChart;
window.onload = function () {
    toneChart = new Chart('toneline', 'timeline', false, 'emotion');
    toneChart.addTimeLines();
}
