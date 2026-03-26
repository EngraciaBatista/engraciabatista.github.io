// Years of Experience by Technical Skills — horizontal bar chart (Chart.js)
window.addEventListener('load', function () {
  if (typeof Chart === 'undefined') return;

  const skillCtx = document.getElementById('skillChart').getContext('2d');
  new Chart(skillCtx, {
    type: 'bar',
    data: {
      labels: [
        'Process Mapping', 'Data Wrangling', 'Customer Profiling',
        'Feature Eng.', 'Pipeline Eng.', 'Sentiment Analysis',
        'AI / NLP / LLMs', 'MLOps'
      ],
      datasets: [{
        data: [15, 6, 9, 6, 6, 6, 2, 3],
        backgroundColor: [
          '#00e5ff', '#2ad0f0', '#55bbdf', '#80a6ce',
          '#9b5de5', '#c240c0', '#e8267a', '#f72585'
        ],
        borderRadius: 5,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ~${ctx.raw} years`
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#ffffff10' },
          ticks: { color: '#7070a0', font: { size: 10 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#c8c8e0', font: { size: 10 } }
        }
      }
    }
  });
});
