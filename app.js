const zipCoordinates = {
  "10001": { lat: 40.7506, lon: -73.9972 },
  "30301": { lat: 33.755, lon: -84.39 },
  "60601": { lat: 41.8864, lon: -87.6186 },
  "73301": { lat: 30.2669, lon: -97.7428 },
  "94103": { lat: 37.7725, lon: -122.4091 }
};

const events = [
  { title: "Downtown Jazz Night", date: "2026-05-02", zip: "10001", milesFromZip: 4, type: "Music", venue: "Bluebird Hall", isOnlineOnly: false },
  { title: "Food Truck Festival", date: "2026-05-07", zip: "10001", milesFromZip: 9, type: "Food", venue: "Pier 57", isOnlineOnly: false },
  { title: "Community Soccer Cup", date: "2026-05-10", zip: "30301", milesFromZip: 16, type: "Sports", venue: "Grant Park Fields", isOnlineOnly: false },
  { title: "Outdoor Sculpture Walk", date: "2026-05-14", zip: "60601", milesFromZip: 6, type: "Arts", venue: "Riverfront Plaza", isOnlineOnly: false },
  { title: "Family Science Day", date: "2026-05-16", zip: "73301", milesFromZip: 11, type: "Family", venue: "Discovery Center", isOnlineOnly: false },
  { title: "Indie Band Livestream", date: "2026-05-08", zip: "94103", milesFromZip: 0, type: "Music", venue: "Online", isOnlineOnly: true }
];

const form = document.getElementById("search-form");
const resultMeta = document.getElementById("result-meta");
const resultsList = document.getElementById("results");

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getSelectedTypes() {
  return Array.from(document.getElementById("event-types").selectedOptions).map((opt) => opt.value);
}

function searchEvents({ zip, radius, startDate, endDate, selectedTypes }) {
  if (!zipCoordinates[zip]) {
    return { error: "Zip code not in demo dataset yet. Try 10001, 30301, 60601, 73301, or 94103.", events: [] };
  }

  const filtered = events.filter((event) => {
    if (event.isOnlineOnly) return false;

    const inDateRange = event.date >= startDate && event.date <= endDate;
    const inRadius = event.milesFromZip <= radius;
    const typeMatches = selectedTypes.length === 0 || selectedTypes.includes(event.type);

    return inDateRange && inRadius && typeMatches;
  });

  return { error: null, events: filtered };
}

function renderResults(matches) {
  resultsList.innerHTML = "";

  if (matches.length === 0) {
    resultMeta.textContent = "No in-person events match your filters.";
    return;
  }

  resultMeta.textContent = `Found ${matches.length} local event${matches.length === 1 ? "" : "s"}.`;

  for (const event of matches) {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${event.title}</strong><br />
      ${formatDate(event.date)} · ${event.type}<br />
      ${event.venue} (ZIP ${event.zip}) · ${event.milesFromZip} miles away
    `;
    resultsList.appendChild(li);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const zip = document.getElementById("zip").value.trim();
  const radius = Number(document.getElementById("radius").value);
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const selectedTypes = getSelectedTypes();

  if (endDate < startDate) {
    resultMeta.textContent = "End date must be on or after start date.";
    resultsList.innerHTML = "";
    return;
  }

  const { error, events: matches } = searchEvents({ zip, radius, startDate, endDate, selectedTypes });

  if (error) {
    resultMeta.textContent = error;
    resultsList.innerHTML = "";
    return;
  }

  renderResults(matches);
});

const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 14);

const toIsoDate = (d) => d.toISOString().slice(0, 10);
document.getElementById("start-date").value = toIsoDate(today);
document.getElementById("end-date").value = toIsoDate(nextWeek);
