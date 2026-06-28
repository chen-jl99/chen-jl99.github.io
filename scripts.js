// Global variables
let workingPapers = [];
let journalPublications = [];
let conferenceProceedings = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  loadPublications();

  // Initialize animation delays for sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
});

// Load publications from JSON file
function loadPublications() {
  fetch('publications.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      workingPapers = data.working_papers || [];
      journalPublications = data.journal_publications || [];
      conferenceProceedings = data.conference_proceedings || [];

      renderPublicationList('working-papers-container', workingPapers);
      renderPublicationList('journal-publications-container', journalPublications);
      renderPublicationList('conference-proceedings-container', conferenceProceedings);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      displayFallbackPublications();
    });
}

// Fallback if JSON loading fails
function displayFallbackPublications() {
  const containers = [
    'working-papers-container',
    'journal-publications-container',
    'conference-proceedings-container'
  ];

  containers.forEach(containerId => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = 'Error loading publications.';
    }
  });
}

// Render one publication category
function renderPublicationList(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  items.forEach(publication => {
    const pubElement = createPublicationElement(publication);
    container.appendChild(pubElement);
  });
}

// Create HTML element for a publication
function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';

  const content = document.createElement('div');
  content.className = 'pub-content';

  // Title
  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);

  // Authors
  const authors = document.createElement('div');
  authors.className = 'pub-authors';

  publication.authors.forEach((author, index) => {
    if (author.includes('Junlin Chen')) {
      const highlightedAuthor = document.createElement('span');
      highlightedAuthor.className = 'highlight-name';
      highlightedAuthor.textContent = author;
      authors.appendChild(highlightedAuthor);
    } else {
      authors.appendChild(document.createTextNode(author));
    }

    if (index < publication.authors.length - 1) {
      authors.appendChild(document.createTextNode(', '));
    }
  });

  content.appendChild(authors);

  // Venue and award
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';

  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueContainer.appendChild(venue);

  if (publication.award && publication.award.length > 0) {
    const award = document.createElement('div');
    award.className = 'pub-award';
    award.textContent = publication.award;
    venueContainer.appendChild(award);
  }

  content.appendChild(venueContainer);

  // Links
  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';

    if (publication.links.pdf && publication.links.pdf !== '#') {
      links.appendChild(createPublicationLink(publication.links.pdf, '[Paper]'));
    }

    if (publication.links.code && publication.links.code !== '#') {
      links.appendChild(createPublicationLink(publication.links.code, '[Code]'));
    }

    if (publication.links.project && publication.links.project !== '#') {
      links.appendChild(createPublicationLink(publication.links.project, '[Project]'));
    }

    if (links.children.length > 0) {
      content.appendChild(links);
    }
  }

  pubItem.appendChild(content);
  return pubItem;
}

function createPublicationLink(url, label) {
  const link = document.createElement('a');
  link.href = url;
  link.textContent = label;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

// Modal functionality for viewing original images
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = 'block';
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    closeModal();
  }
};
