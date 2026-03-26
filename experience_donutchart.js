// Years of Experience by Domain — doughnut chart (Chart.js)
window.addEventListener('load', function () {
  if (typeof Chart === 'undefined') return;

  const topicCtx = document.getElementById('topicChart').getContext('2d');
  new Chart(topicCtx, {
    type: 'doughnut',
    data: {
      labels: [
        'Project Mgmt', 'Business Analysis', 'Business Intelligence',
        'Data Analysis', 'Data Science', 'Data Engineering',
        'Machine Learning', 'AI / NLP'
      ],
      datasets: [{
        data: [15, 15, 9, 9, 6, 5, 6, 2],
        backgroundColor: [
          '#00e5ff', '#18cfeb', '#40b0d6', '#6690c0',
          '#9b5de5', '#c040b0', '#e8267a', '#f72585'
        ],
        borderColor: '#12122a',
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { color: '#7070a0', font: { size: 10 }, padding: 8, boxWidth: 12 }
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ~${ctx.raw} yrs`
          }
        }
      },
      cutout: '55%'
    }
  });
});
