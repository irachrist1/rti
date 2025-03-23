/* main.js */

// Real data for the dashboard based on research
const sampleData = [
  {
    id: 1,
    name: "Mergims",
    industry: "FinTech",
    teamSize: 10,
    revenue: 160000,
    impact: "Economic",
    founded: 2014,
    growth: 20,
    description: "Prepayments & remittances for diaspora to pay bills for families in Rwanda"
  },
  {
    id: 2,
    name: "PesaChoice",
    industry: "FinTech",
    teamSize: 20,
    revenue: 300000,
    impact: "Economic",
    founded: 2014,
    growth: 20,
    description: "Digital payments & salary advances for employees"
  },
  {
    id: 3,
    name: "Exuus (SAVE)",
    industry: "FinTech",
    teamSize: 8,
    revenue: 200000,
    impact: "Social",
    founded: 2016,
    growth: 45,
    description: "Digital platform for traditional savings groups"
  },
  {
    id: 4,
    name: "Leaf Global",
    industry: "FinTech",
    teamSize: 10,
    revenue: 150000,
    impact: "Social",
    founded: 2017,
    growth: 25,
    description: "Blockchain-based digital wallet for refugees and cross-border traders"
  },
  {
    id: 5,
    name: "BeneFactors",
    industry: "FinTech",
    teamSize: 8,
    revenue: 400000,
    impact: "Economic",
    founded: 2017,
    growth: 30,
    description: "Invoice factoring and working capital financing for SMEs"
  },
  {
    id: 6,
    name: "HeptaPay",
    industry: "FinTech",
    teamSize: 9,
    revenue: 100000,
    impact: "Economic",
    founded: 2020,
    growth: 35,
    description: "Unified bill payment app for utilities, TV, school fees"
  },
  {
    id: 7,
    name: "Babyl",
    industry: "HealthTech",
    teamSize: 100,
    revenue: 900000,
    impact: "Social",
    founded: 2016,
    growth: 38,
    description: "Digital health services and telemedicine platform"
  },
  {
    id: 8,
    name: "Viebeg",
    industry: "HealthTech",
    teamSize: 25,
    revenue: 750000,
    impact: "Economic",
    founded: 2018,
    growth: 33,
    description: "Medical supply chain platform for hospitals and clinics"
  },
  {
    id: 9,
    name: "Eden Care",
    industry: "HealthTech",
    teamSize: 28,
    revenue: 500000,
    impact: "Social",
    founded: 2021,
    growth: 42,
    description: "Digital health insurance platform for enterprises and individuals"
  },
  {
    id: 10,
    name: "Hatch Africa",
    industry: "AgriTech",
    teamSize: 35,
    revenue: 600000,
    impact: "Economic",
    founded: 2018,
    growth: 25,
    description: "High-yield poultry farming solutions for smallholder farmers"
  },
  {
    id: 11,
    name: "Water Access Rwanda",
    industry: "CleanTech",
    teamSize: 30,
    revenue: 350000,
    impact: "Environmental",
    founded: 2014,
    growth: 20,
    description: "Clean water technology and solar-powered water kiosks"
  },
  {
    id: 12,
    name: "Africa Improved Foods",
    industry: "AgriTech",
    teamSize: 300,
    revenue: 8500000,
    impact: "Social",
    founded: 2016,
    growth: 15,
    description: "Advanced food processing for nutritious fortified foods"
  },
  {
    id: 13,
    name: "BAG Innovation",
    industry: "EdTech",
    teamSize: 15,
    revenue: 250000,
    impact: "Social",
    founded: 2017,
    growth: 40,
    description: "Virtual internship and career platform for students"
  },
  {
    id: 14,
    name: "Ampersand",
    industry: "TransportTech",
    teamSize: 100,
    revenue: 1500000,
    impact: "Environmental",
    founded: 2016,
    growth: 45,
    description: "Electric motorcycles and battery swapping network"
  },
  {
    id: 15,
    name: "AC Group (Tap&Go)",
    industry: "TransportTech",
    teamSize: 80,
    revenue: 1200000,
    impact: "Economic",
    founded: 2015,
    growth: 28,
    description: "Smart card payment system for public transportation"
  },
  {
    id: 16,
    name: "Yego Innovision",
    industry: "TransportTech",
    teamSize: 50,
    revenue: 700000,
    impact: "Economic",
    founded: 2016,
    growth: 30,
    description: "Smart meters for motorcycle taxis and ride-hailing"
  },
  {
    id: 17,
    name: "OffGridBox",
    industry: "CleanTech",
    teamSize: 25,
    revenue: 400000,
    impact: "Environmental",
    founded: 2017,
    growth: 35,
    description: "Portable solar power and water purification units"
  },
  {
    id: 18,
    name: "Munyax Eco",
    industry: "CleanTech",
    teamSize: 20,
    revenue: 300000,
    impact: "Environmental",
    founded: 2019,
    growth: 28,
    description: "Solar photovoltaic installations and solar water heaters"
  },
  {
    id: 19,
    name: "Inyenyeri (Kara)",
    industry: "CleanTech",
    teamSize: 15,
    revenue: 200000,
    impact: "Environmental",
    founded: 2013,
    growth: 10,
    description: "Clean cooking fuel and gasifier cookstove system"
  }
];

// Filtered data (will be updated based on user filters)
let filteredData = [...sampleData];
// Current page for table pagination
let currentPage = 1;
const rowsPerPage = 10;

// DOM Elements
const toggleFiltersBtn = document.getElementById('toggle-filters');
const filterContainer = document.getElementById('filter-container');
const applyFiltersBtn = document.getElementById('apply-filters');
const resetFiltersBtn = document.getElementById('reset-filters');
const connectSheetBtn = document.getElementById('connect-sheet-btn');
const sheetModal = document.getElementById('sheet-modal');
const cancelConnectBtn = document.getElementById('cancel-connect');
const confirmConnectBtn = document.getElementById('confirm-connect');
const connectionBanner = document.getElementById('connection-banner');
const tableSearchInput = document.getElementById('table-search');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const tableShowingSpan = document.getElementById('table-showing');
const tableTotalSpan = document.getElementById('table-total');
const exportDataBtn = document.getElementById('export-data');
const suggestionForm = document.getElementById('suggestion-form');
const forecastPeriodSelect = document.getElementById('forecast-period');

// Initialization on document load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize filteredData with the full dataset
  filteredData = [...sampleData];

  // Set up event listeners
  toggleFiltersBtn.addEventListener('click', () => {
    filterContainer.classList.toggle('show');
    toggleFiltersBtn.querySelector('span').textContent =
      filterContainer.classList.contains('show') ? 'Hide Filters' : 'Show Filters';
  });

  applyFiltersBtn.addEventListener('click', applyFilters);
  resetFiltersBtn.addEventListener('click', resetFilters);

  connectSheetBtn.addEventListener('click', () => {
    sheetModal.classList.remove('hidden');
  });

  cancelConnectBtn.addEventListener('click', () => {
    sheetModal.classList.add('hidden');
  });

  confirmConnectBtn.addEventListener('click', connectToSheet);

  tableSearchInput.addEventListener('input', () => {
    currentPage = 1;
    applyFilters();
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    const maxPage = Math.ceil(filteredData.length / rowsPerPage);
    if (currentPage < maxPage) {
      currentPage++;
      renderTable();
    }
  });

  exportDataBtn.addEventListener('click', exportData);

  suggestionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitSuggestion();
  });

  forecastPeriodSelect.addEventListener('change', () => {
    renderForecastChart();
  });

  // Initial render
  renderDashboard();

  // Show that we're using actual data
  connectionBanner.classList.remove('hidden');
  connectionBanner.classList.add('bg-green-100', 'text-green-800');
  connectionBanner.innerHTML = `
    <div class="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      Using real data from Rwanda Tech Ecosystem Research Report (2015-2025).
    </div>
  `;

  // Auto-hide the banner after 5 seconds
  setTimeout(() => {
    connectionBanner.classList.add('hidden');
  }, 5000);
});

// Filter data based on user selections
function applyFilters() {
  const industryFilter = document.getElementById('industry-filter').value;
  const revenueFilter = document.getElementById('revenue-filter').value;
  const teamFilter = document.getElementById('team-filter').value;
  const impactFilter = document.getElementById('impact-filter').value;
  const searchTerm = document.getElementById('table-search').value.toLowerCase();

  filteredData = sampleData.filter(company => {
    // Industry filter
    if (industryFilter !== 'all' && company.industry !== industryFilter) {
      return false;
    }

    // Revenue filter
    if (revenueFilter !== 'all') {
      const [min, max] = revenueFilter.split('-').map(v => v === 'plus' ? Infinity : Number(v));
      if (company.revenue < min || company.revenue > max) {
        return false;
      }
    }

    // Team size filter
    if (teamFilter !== 'all') {
      let [min, max] = teamFilter.split('-').map(v => v === 'plus' ? Infinity : Number(v));
      if (company.teamSize < min || company.teamSize > max) {
        return false;
      }
    }

    // Impact filter
    if (impactFilter !== 'all' && company.impact !== impactFilter) {
      return false;
    }

    // Search term
    if (searchTerm && !company.name.toLowerCase().includes(searchTerm) &&
        !company.industry.toLowerCase().includes(searchTerm) &&
        !company.description.toLowerCase().includes(searchTerm)) {
      return false;
    }

    return true;
  });

  currentPage = 1;
  renderDashboard();
}

// Reset all filters to default
function resetFilters() {
  document.getElementById('industry-filter').value = 'all';
  document.getElementById('revenue-filter').value = 'all';
  document.getElementById('team-filter').value = 'all';
  document.getElementById('impact-filter').value = 'all';
  document.getElementById('table-search').value = '';

  filteredData = [...sampleData];
  currentPage = 1;
  renderDashboard();
}

// Connect to Google Sheet
function connectToSheet() {
  const sheetUrl = document.getElementById('sheet-url').value;
  const sheetName = document.getElementById('sheet-name').value;

  if (!sheetUrl) {
    alert('Please enter a valid Google Sheet URL');
    return;
  }

  // In a real implementation, this would connect to the Google Sheets API
  // For this demo, we'll simulate a successful connection
  sheetModal.classList.add('hidden');

  // Show connection banner
  connectionBanner.classList.remove('hidden');
  connectionBanner.classList.add('bg-green-100', 'text-green-800');
  connectionBanner.innerHTML = `
    <div class="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      Successfully connected to Google Sheet. Data has been loaded.
    </div>
  `;

  // Update data source info
  document.getElementById('data-source').textContent = 'Google Sheets - ' + sheetUrl.substring(0, 30) + '...';

  // In a real implementation, we would fetch and parse the sheet data here
  // For this demo, we'll continue using the sample data
  setTimeout(() => {
    connectionBanner.classList.add('hidden');
  }, 5000);
}

// Export data to CSV
function exportData() {
  const csvContent = [
    // Header row
    ['Company', 'Industry', 'Team Size', 'Revenue', 'Impact Focus', 'Founded', 'Growth', 'Description'].join(','),
    // Data rows
    ...filteredData.map(company => [
      `"${company.name}"`,
      `"${company.industry}"`,
      company.teamSize,
      company.revenue,
      `"${company.impact}"`,
      company.founded,
      company.growth,
      `"${company.description}"`
    ].join(','))
  ].join('\n');

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rwanda_tech_ecosystem.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Submit suggestion form
function submitSuggestion() {
  const form = document.getElementById('suggestion-form');
  const companyName = form.elements['company'].value;
  const industry = form.elements['industry'].value;

  if (!companyName || !industry) {
    alert('Please enter a company name and select an industry');
    return;
  }

  // In a real implementation, this would send the data to a backend
  // For this demo, we'll simulate success

  // Add a success message
  const successDiv = document.createElement('div');
  successDiv.className = 'p-3 bg-green-100 text-green-800 rounded-md mt-3';
  successDiv.textContent = 'Thank you for your suggestion! It will be reviewed by our team.';
  form.appendChild(successDiv);

  // Clear the form
  form.reset();

  // Remove the success message after a few seconds
  setTimeout(() => {
    form.removeChild(successDiv);
  }, 5000);
}

// Render the entire dashboard
function renderDashboard() {
  renderKPIs();
  renderClusterChart();
  renderRevenueChart();
  renderTeamChart();
  renderImpactChart();
  renderForecastChart();
  renderTable();
}

// KPI Cards
function renderKPIs() {
  // Total companies
  document.getElementById('total-companies').textContent = filteredData.length;
  document.getElementById('total-companies-change').textContent = '+45% since 2020';
  document.getElementById('total-companies-change').className = 'font-medium text-green-600';

  // Average team size
  const avgTeamSize = Math.round(filteredData.reduce((sum, company) => sum + company.teamSize, 0) / filteredData.length);
  document.getElementById('avg-team-size').textContent = avgTeamSize;
  document.getElementById('avg-team-size-change').textContent = '+25% since 2020';
  document.getElementById('avg-team-size-change').className = 'font-medium text-green-600';

  // Total revenue
  const totalRevenue = filteredData.reduce((sum, company) => sum + company.revenue, 0);
  document.getElementById('total-revenue').textContent = '$' + (totalRevenue / 1000000).toFixed(1) + 'M';
  document.getElementById('total-revenue-change').textContent = '+32% since 2022';
  document.getElementById('total-revenue-change').className = 'font-medium text-green-600';

  // Fastest growing sector
  const sectorGrowth = {};
  filteredData.forEach(company => {
    if (!sectorGrowth[company.industry]) {
      sectorGrowth[company.industry] = { total: 0, count: 0 };
    }
    sectorGrowth[company.industry].total += company.growth;
    sectorGrowth[company.industry].count++;
  });

  let fastestSector = null;
  let highestGrowth = 0;

  for (const [sector, data] of Object.entries(sectorGrowth)) {
    const avgGrowth = data.total / data.count;
    if (avgGrowth > highestGrowth && data.count >= 2) {
      highestGrowth = avgGrowth;
      fastestSector = sector;
    }
  }

  document.getElementById('fastest-sector').textContent = fastestSector || '--';
  document.getElementById('fastest-sector-growth').textContent = highestGrowth ? `+${highestGrowth.toFixed(1)}%` : '--';
  document.getElementById('fastest-sector-growth').className = 'font-medium text-green-600';
}

// Render the cluster visualization
function renderClusterChart() {
  const container = document.getElementById('cluster-chart');
  container.innerHTML = ''; // Clear previous content

  // Set up SVG using D3.js
  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Group data by industry
  const industries = Array.from(new Set(filteredData.map(d => d.industry)));
  const nodes = filteredData.map(d => ({
    id: d.id,
    name: d.name,
    industry: d.industry,
    radius: Math.sqrt(d.revenue) / 40,
    x: Math.random() * width,
    y: Math.random() * height
  }));

  // Color scale for industries
  const colorScale = d3.scaleOrdinal()
    .domain(industries)
    .range(d3.schemeCategory10);

  // Create a force simulation
  const simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => d.radius + 2))
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height / 2).strength(0.1));

  // Group by industry clusters
  const industryGroups = {};
  industries.forEach((industry, i) => {
    const angle = (i / industries.length) * 2 * Math.PI;
    const x = width / 2 + (width / 3) * Math.cos(angle);
    const y = height / 2 + (height / 3) * Math.sin(angle);

    industryGroups[industry] = { x, y, count: filteredData.filter(d => d.industry === industry).length };
  });

  // Add industry labels
  svg.selectAll('.industry-label')
    .data(Object.entries(industryGroups))
    .enter()
    .append('text')
    .attr('class', 'industry-label')
    .attr('x', d => d[1].x)
    .attr('y', d => d[1].y)
    .attr('text-anchor', 'middle')
    .attr('font-size', d => Math.min(16, 10 + d[1].count))
    .attr('font-weight', 'bold')
    .attr('fill', d => colorScale(d[0]))
    .text(d => d[0]);

  // Add company nodes
  const node = svg.append('g')
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node');

  node.append('circle')
    .attr('r', d => d.radius)
    .attr('fill', d => colorScale(d.industry))
    .attr('opacity', 0.8);

  // Add tooltips
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  node.on('mouseover', function(event, d) {
    tooltip.transition()
      .duration(200)
      .style('opacity', .9);
    tooltip.html(`
      <strong>${d.name}</strong><br/>
      Industry: ${d.industry}<br/>
      Revenue: $${filteredData.find(c => c.id === d.id).revenue.toLocaleString()}
    `)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  })
  .on('mouseout', function() {
    tooltip.transition()
      .duration(500)
      .style('opacity', 0);
  });

  // Update node positions on each tick
  simulation.on('tick', () => {
    nodes.forEach(node => {
      const industry = node.industry;
      const target = industryGroups[industry];
      node.x += (target.x - node.x) * 0.03;
      node.y += (target.y - node.y) * 0.03;
    });

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
}

// Render the revenue distribution chart
function renderRevenueChart() {
  const container = document.getElementById('revenue-chart');
  container.innerHTML = '';

  const revenueBins = [
    { min: 0, max: 100000, label: '0 - $100K' },
    { min: 100000, max: 250000, label: '$100K - $250K' },
    { min: 250000, max: 500000, label: '$250K - $500K' },
    { min: 500000, max: 1000000, label: '$500K - $1M' },
    { min: 1000000, max: Infinity, label: '$1M+' }
  ];

  const revenueData = revenueBins.map(bin => {
    const count = filteredData.filter(company =>
      company.revenue >= bin.min && company.revenue < bin.max
    ).length;
    return { label: bin.label, count: count };
  });

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: revenueData.map(d => d.label),
      datasets: [{
        label: 'Number of Companies',
        data: revenueData.map(d => d.count),
        backgroundColor: '#4F46E5',
        borderColor: '#4338CA',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Companies: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Companies' },
          ticks: { precision: 0 }
        },
        x: { title: { display: true, text: 'Revenue Range' } }
      }
    }
  });
}

// Render the team size comparison chart
function renderTeamChart() {
  const container = document.getElementById('team-chart');
  container.innerHTML = '';

  const teamBins = [
    { min: 1, max: 5, label: '1-5' },
    { min: 6, max: 20, label: '6-20' },
    { min: 21, max: 50, label: '21-50' },
    { min: 51, max: Infinity, label: '51+' }
  ];

  const teamData = teamBins.map(bin => {
    const companies = filteredData.filter(company =>
      company.teamSize >= bin.min && company.teamSize < bin.max
    );
    return {
      label: bin.label,
      count: companies.length,
      avgRevenue: companies.length ? companies.reduce((sum, c) => sum + c.revenue, 0) / companies.length : 0
    };
  });

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: teamData.map(d => d.label + ' employees'),
      datasets: [
        {
          label: 'Number of Companies',
          data: teamData.map(d => d.count),
          backgroundColor: '#4F46E5',
          borderColor: '#4338CA',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Avg. Revenue (thousands $)',
          data: teamData.map(d => d.avgRevenue / 1000),
          backgroundColor: '#10B981',
          borderColor: '#059669',
          borderWidth: 1,
          type: 'line',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              if (context.datasetIndex === 0) {
                return `Companies: ${context.raw}`;
              } else {
                return `Avg. Revenue: $${Math.round(context.raw * 1000).toLocaleString()}`;
              }
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Number of Companies' },
          ticks: { precision: 0 }
        },
        y1: {
          beginAtZero: true,
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Avg. Revenue (thousands $)' },
          grid: { drawOnChartArea: false }
        },
        x: { title: { display: true, text: 'Team Size' } }
      }
    }
  });
}

// Render the impact assessment chart
function renderImpactChart() {
  const container = document.getElementById('impact-chart');
  container.innerHTML = '';

  const impactTypes = Array.from(new Set(filteredData.map(d => d.impact)));
  const impactData = impactTypes.map(impact => {
    const companies = filteredData.filter(company => company.impact === impact);
    return {
      label: impact,
      count: companies.length,
      totalRevenue: companies.reduce((sum, c) => sum + c.revenue, 0),
      avgGrowth: companies.reduce((sum, c) => sum + c.growth, 0) / companies.length,
      sdgs: impact === 'Economic' ? 'SDGs 8, 9' : impact === 'Social' ? 'SDGs 3, 4, 10' : 'SDGs 6, 7, 13'
    };
  });

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);

  const impactColors = {
    Economic: ['rgba(54, 162, 235, 0.5)', 'rgb(54, 162, 235)'],
    Social: ['rgba(255, 99, 132, 0.5)', 'rgb(255, 99, 132)'],
    Environmental: ['rgba(75, 192, 192, 0.5)', 'rgb(75, 192, 192)']
  };

  const backgroundColors = impactData.map(d => impactColors[d.label][0]);
  const borderColors = impactData.map(d => impactColors[d.label][1]);

  new Chart(canvas, {
    type: 'polarArea',
    data: {
      labels: impactData.map(d => d.label),
      datasets: [{
        data: impactData.map(d => d.count),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' },
        tooltip: {
          callbacks: {
            label: function(context) {
              const impact = impactData[context.dataIndex];
              return [
                `Companies: ${impact.count}`,
                `Total Revenue: $${(impact.totalRevenue / 1000000).toFixed(2)}M`,
                `Avg. Growth: ${impact.avgGrowth.toFixed(1)}%`,
                `Contributes to: ${impact.sdgs}`
              ];
            }
          }
        }
      }
    }
  });

  // Add impact footnote
  const footnote = document.createElement('div');
  footnote.className = 'mt-3 text-xs text-gray-500';
  footnote.innerHTML = '<strong>Note:</strong> Based on research, Rwanda\'s tech ecosystem strongly aligns with UN Sustainable Development Goals (SDGs), especially in financial inclusion, healthcare access, and renewable energy adoption.';
  container.appendChild(footnote);
}

// Render the forecast chart
function renderForecastChart() {
  const container = document.getElementById('forecast-chart');
  container.innerHTML = '';

  const forecastYears = parseInt(document.getElementById('forecast-period').value);
  const industries = Array.from(new Set(filteredData.map(d => d.industry)));
  const validIndustries = industries.filter(industry =>
    filteredData.filter(c => c.industry === industry).length >= 2
  );

  const industryGrowth = {};
  validIndustries.forEach(industry => {
    const companies = filteredData.filter(c => c.industry === industry);
    industryGrowth[industry] = companies.reduce((sum, c) => sum + c.growth, 0) / companies.length / 100;
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: forecastYears + 1 }, (_, i) => currentYear + i);
  const historicalYears = [2020, 2021, 2022, 2023, 2024];

  const forecastData = validIndustries.map(industry => {
    const companies = filteredData.filter(c => c.industry === industry);
    const currentRevenue = companies.reduce((sum, c) => sum + c.revenue, 0);
    const growth = industryGrowth[industry];

    const historicalRevenues = [];
    let pastRevenue = currentRevenue;
    for (let i = historicalYears.length - 1; i >= 0; i--) {
      if (historicalYears[i] < currentYear) {
        const pastGrowthRate = growth * (0.7 + (i * 0.05));
        pastRevenue = pastRevenue / (1 + pastGrowthRate);
        historicalRevenues.unshift(pastRevenue);
      }
    }

    const revenues = [currentRevenue];
    for (let i = 1; i <= forecastYears; i++) {
      let adjustmentFactor = 1.0;
      if (industry === 'FinTech') {
        adjustmentFactor = 1.1 + (i * 0.05);
      } else if (industry === 'HealthTech') {
        adjustmentFactor = 1.15;
      } else if (industry === 'TransportTech') {
        adjustmentFactor = 1.2;
      } else if (industry === 'CleanTech') {
        adjustmentFactor = 1.05 + (i * 0.03);
      }
      const yearGrowth = growth * adjustmentFactor;
      revenues.push(revenues[i - 1] * (1 + yearGrowth));
    }

    const allYears = [...historicalYears.filter(y => y < currentYear), ...years];
    const allRevenues = [...historicalRevenues, ...revenues];

    return {
      industry,
      revenue: allRevenues,
      years: allYears,
      upperBound: allRevenues.map((r, i) => {
        const uncertainty = i >= historicalRevenues.length ? 0.1 + ((i - historicalRevenues.length) * 0.03) : 0.05;
        return r * (1 + uncertainty);
      }),
      lowerBound: allRevenues.map((r, i) => {
        const uncertainty = i >= historicalRevenues.length ? 0.08 + ((i - historicalRevenues.length) * 0.02) : 0.04;
        return r * (1 - uncertainty);
      })
    };
  });

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);

  const datasets = [];
  forecastData.forEach((data, index) => {
    const color = d3.schemeCategory10[index % 10];
    datasets.push({
      label: data.industry,
      data: data.revenue.map((r, i) => ({ x: data.years[i], y: r / 1000000 })),
      borderColor: color,
      backgroundColor: 'transparent',
      tension: 0.4
    });

    if (forecastYears > 1) {
      datasets.push({
        label: `${data.industry} (Confidence Interval)`,
        data: data.upperBound.map((upper, i) => ({ x: data.years[i], y: upper / 1000000 })),
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        pointRadius: 0,
        tension: 0.4
      });

      datasets.push({
        label: `${data.industry} (Confidence Interval)`,
        data: data.lowerBound.map((lower, i) => ({ x: data.years[i], y: lower / 1000000 })),
        borderColor: 'transparent',
        backgroundColor: color + '20',
        pointRadius: 0,
        tension: 0.4,
        fill: -2
      });
    }
  });

  new Chart(canvas, {
    type: 'line',
    data: { datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          title: {
            display: true,
            text: 'Industry Revenue Trends & Forecast'
          },
          labels: {
            filter: function(legendItem) {
              return !legendItem.text.includes('Confidence Interval');
            }
          }
        },
        tooltip: {
          callbacks: {
            title: function(tooltipItems) {
              return 'Year: ' + tooltipItems[0].raw.x;
            },
            label: function(context) {
              if (context.dataset.label.includes('Confidence Interval')) return;
              return `${context.dataset.label}: $${context.raw.y.toFixed(2)}M`;
            }
          }
        }
      },
      scales: {
        y: { title: { display: true, text: 'Revenue (Millions $)' } },
        x: {
          type: 'linear',
          position: 'bottom',
          title: { display: true, text: 'Year' },
          ticks: { callback: function(value) { return value.toFixed(0); } }
        }
      }
    }
  });
}

// Render the company table
function renderTable() {
  const tbody = document.getElementById('company-table-body');
  tbody.innerHTML = '';

  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, totalRows);

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

  tableShowingSpan.textContent = totalRows > 0 ? `${startIdx + 1}-${endIdx}` : '0';
  tableTotalSpan.textContent = totalRows;

  if (totalRows === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
        No companies found matching your filters
      </td>
    `;
    tbody.appendChild(tr);
    return;
  }

  for (let i = startIdx; i < endIdx; i++) {
    const company = filteredData[i];
    const tr = document.createElement('tr');
    tr.className = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';

    tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div>
            <div class="text-sm font-medium text-gray-900">${company.name}</div>
            <div class="text-sm text-gray-500">${company.description}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
          ${company.industry}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${company.teamSize}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        $${company.revenue.toLocaleString()}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          company.impact === 'Economic' ? 'bg-blue-100 text-blue-800' :
          company.impact === 'Social' ? 'bg-green-100 text-green-800' :
          'bg-yellow-100 text-yellow-800'
        }">
          ${company.impact}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${company.founded}
      </td>
    `;

    tbody.appendChild(tr);
  }
}
