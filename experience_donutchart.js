document.addEventListener("DOMContentLoaded", () => {
    const topics = [
      { label: "Data Science", years: 4, color: "#f8b195" },
      { label: "Data Analysis", years: 8, color: "#f67280" },
      { label: "Data Engineering", years: 2, color: "#c06c84" },
      { label: "Machine Learning", years: 3, color: "#6c5b7b" },
      { label: "Business Intelligence", years: 8, color: "#355c7d" },
      { label: "Business Analysis", years: 14, color: "#99b898" },
      { label: "Project Management", years: 14, color: "#f0c987" },
    ];

    const total = topics.reduce((sum, t) => sum + t.years, 0);
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
  
    const svg = document.querySelector(".donut");
    let offset = 0;
  
    const tooltip = document.createElement("div");
    tooltip.className = "donut-tooltip";
    document.body.appendChild(tooltip);
  
    topics.forEach(topic => {
      const percent = topic.years / total;
      const dash = percent * circumference;
  
      const segment = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      segment.setAttribute("class", "donut-segment");
      segment.setAttribute("cx", 18);
      segment.setAttribute("cy", 18);
      segment.setAttribute("r", radius);
      segment.setAttribute("stroke", topic.color);
      segment.setAttribute("stroke-dasharray", `${dash} ${circumference}`);
      segment.setAttribute("stroke-dashoffset", offset);
      segment.setAttribute("data-label", topic.label);
      segment.setAttribute("data-years", topic.years);
  
      segment.addEventListener("mousemove", (e) => {
        const label = segment.getAttribute("data-label");
        const years = segment.getAttribute("data-years");
        tooltip.textContent = `${label}: ${years} yrs`;
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY - 10}px`;
        tooltip.style.opacity = 1;
      });
  
      segment.addEventListener("mouseleave", () => {
        tooltip.style.opacity = 0;
      });
  
      svg.appendChild(segment);
      offset -= dash;
    });
  });
  
  
  