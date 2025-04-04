document.addEventListener("DOMContentLoaded", () => {
  const bars = document.querySelectorAll('.bar');
  const tooltip = document.createElement("div");
  tooltip.className = "bar-tooltip";
  document.body.appendChild(tooltip);

  let maxYears = 0;
  bars.forEach(bar => {
    const years = parseInt(bar.getAttribute('data-years'), 10);
    if (years > maxYears) maxYears = years;
  });

  bars.forEach(bar => {
    const years = parseInt(bar.getAttribute('data-years'), 10);
    const label = bar.getAttribute("data-label");

    // Proportional height based on max
    const maxHeight = 200; // px
    const height = (years / maxYears) * maxHeight;
    bar.style.height = `${height}px`;

    // Tooltip handling
    bar.addEventListener("mousemove", (e) => {
      tooltip.textContent = `${label}: ${years} yrs`;
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY - 10}px`;
      tooltip.style.opacity = 1;
    });

    bar.addEventListener("mouseleave", () => {
      tooltip.style.opacity = 0;
    });
  });
});



  
  
