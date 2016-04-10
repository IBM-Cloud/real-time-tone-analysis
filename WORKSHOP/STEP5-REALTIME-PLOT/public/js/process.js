var toneChart;
window.onload = function () {
    toneChart = new Chart('toneLine', 'timeLine', 'sentence', 'emotion');
    toneChart.createControllers('timeLine');
    toneChart.addTimeLines();
}
