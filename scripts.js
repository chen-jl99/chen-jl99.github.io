// Global variables
let workingPapers = [];
let publications = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  loadPublications();

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
      publications = data.publications || [];

      renderPublicationList('working-papers-container', workingPapers);
      renderPublicationList('publications-container', publications);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      displayFallbackPublications();
    });
}

// Fallback if JSON loading fails
function displayFallbackPublications() {
  const workingContainer = document.getElementById('working-papers-container');
  const publicationsContainer = document.getElementById('publications-container');

  if (workingContainer) {
    workingContainer.innerHTML = 'Error loading working papers.';
  }

  if (publicationsContainer) {
    publicationsContainer.innerHTML = 'Error loading publications.';
  }
}

// Render a list of publications into a given container
function renderPublicationList(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  items.forEach(item => {
    const pubElement = createPublicationElement(item);
    container.appendChild(pubElement);
  });
}

// Create HTML element for a publication
function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';

  const content = document.createElement('div');
  content.className = 'pub-content';

  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);

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

  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';

    if (publication.links.pdf && publication.links.pdf !== '#') {
      const pdfLink = createPublicationLink(publication.links.pdf, '[Paper]');
      links.appendChild(pdfLink);
    }

    if (publication.links.code && publication.links.code !== '#') {
      const codeLink = createPublicationLink(publication.links.code, '[Code]');
      links.appendChild(codeLink);
    }

    if (publication.links.project && publication.links.project !== '#') {
      const projectLink = createPublicationLink(publication.links.project, '[Project]');
      links.appendChild(projectLink);
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
