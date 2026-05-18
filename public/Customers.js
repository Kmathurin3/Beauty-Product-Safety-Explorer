async function searchFDA() {
  const searchInput = document.getElementById('searchInput').value || 'skin';
  const resultsDiv = document.getElementById('results');

  resultsDiv.innerHTML = '<p>Loading...</p>';

  await saveSearch(searchInput);

  try {
    const response = await fetch(`/api/fda?search=${searchInput}`);
    const data = await response.json();

    resultsDiv.innerHTML = '';

    const reactions = {};

    if (data.results) {
      data.results.forEach((report) => {
        const product =
          report.products && report.products[0]
            ? report.products[0].product_name
            : 'Unknown Product';

        const reaction =
          report.reactions && report.reactions[0]
            ? report.reactions[0]
            : 'Unknown Reaction';

        reactions[reaction] = (reactions[reaction] || 0) + 1;

        resultsDiv.innerHTML += `
          <div class="card">
            <h3>${product}</h3>
            <p><strong>Reaction:</strong> ${reaction}</p>
          </div>
        `;
      });

      createChart(reactions);
      getSavedSearches();
    } else {
      resultsDiv.innerHTML = '<p>No results found. Try searching another product.</p>';
    }
  } catch (error) {
    resultsDiv.innerHTML = '<p>Error loading data. Please try again.</p>';
  }
}

async function saveSearch(searchTerm) {
  await fetch('/saved-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ searchTerm: searchTerm })
  });
}

async function getSavedSearches() {
  const savedDiv = document.getElementById('savedSearches');

  if (!savedDiv) {
    return;
  }

  const response = await fetch('/saved-searches');
  const savedSearches = await response.json();

  savedDiv.innerHTML = '<h2>Recent Saved Searches</h2>';

  savedSearches.forEach((item) => {
    savedDiv.innerHTML += `
      <div class="card">
        <p>${item.search_term}</p>
      </div>
    `;
  });
}

function createChart(reactions) {
  const ctx = document.getElementById('reactionChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(reactions),
      datasets: [
        {
          label: 'Reported Reactions',
          data: Object.values(reactions),
        },
      ],
    },
  });
}

getSavedSearches();
