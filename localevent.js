document.addEventListener('DOMContentLoaded', () => {
  const eventForm = document.getElementById('event-form');
  const postsContainerClone = document.getElementById('posts-container-clone');
  const eventModalTitle = document.getElementById('eventModalLabel');
  let currentEditItem = null; // Track the item being edited

  // Load events from localStorage on page load
  loadEventsFromLocalStorage();

  eventForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('event-name').value;
    const dateValue = document.getElementById('event-date').value;
    const comment = document.getElementById('event-comment').value;

    const date = new Date(dateValue);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    if (name && dateValue && comment) {
      if (currentEditItem) {
        // If editing an existing event
        editExistingEvent(currentEditItem, name, formattedDate, comment);
        currentEditItem = null; // Reset edit item
      } else {
        // If adding a new event
        addNewEventToDOM(name, formattedDate, comment);
      }

      // Reset form fields
      resetFormFields();

      // Hide the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
      modal.hide();
      eventModalTitle.textContent = 'Add Event'; // Reset modal title

      // Save events to localStorage
      saveEventsToLocalStorage();
    } else {
      console.log('Please fill in all fields');
    }
  });

  function editExistingEvent(postItem, name, formattedDate, comment) {
    // Update the DOM with edited event details
    postItem.querySelector('h5').textContent = name;
    postItem.querySelector('p:nth-of-type(1)').textContent = formattedDate;
    postItem.querySelector('p:nth-of-type(2)').textContent = comment;
  }

  function addNewEventToDOM(name, formattedDate, comment) {
    // Create a new event item in the DOM
    const postItem = document.createElement('div');
    postItem.className = 'd-flex align-items-center mb-3';
    postItem.innerHTML = `
      <div>
        <h5>${name}</h5>
        <p>${formattedDate}</p>
        <p>${comment}</p>
      </div>
      <div class="ms-auto">
        <button class="btn btn-dark btn-sm edit-btn">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
      </div>
    `;

    postsContainerClone.appendChild(postItem);

    // Add event listeners for edit and delete buttons
    const editBtn = postItem.querySelector('.edit-btn');
    const deleteBtn = postItem.querySelector('.delete-btn');

    editBtn.addEventListener('click', () => {
      editEvent(postItem);
    });

    deleteBtn.addEventListener('click', () => {
      deleteEvent(postItem);
    });
  }

  function resetFormFields() {
    // Reset form fields after submission
    document.getElementById('event-name').value = '';
    document.getElementById('event-date').value = '';
    document.getElementById('event-comment').value = '';
  }

  function editEvent(postItem) {
    // Populate form fields with existing event data for editing
    const name = postItem.querySelector('h5').textContent;
    const date = postItem.querySelector('p:nth-of-type(1)').textContent;
    const comment = postItem.querySelector('p:nth-of-type(2)').textContent;

    document.getElementById('event-name').value = name;
    document.getElementById('event-date').value = new Date(date).toISOString().split('T')[0];
    document.getElementById('event-comment').value = comment;

    currentEditItem = postItem; // Set the current item being edited
    eventModalTitle.textContent = 'Edit Event'; // Update modal title

    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    modal.show();
  }

  function deleteEvent(postItem) {
    // Remove event from the DOM
    postsContainerClone.removeChild(postItem);

    // Save events to localStorage after deletion
    saveEventsToLocalStorage();
  }

  function saveEventsToLocalStorage() {
    // Save events to localStorage
    const eventItems = postsContainerClone.querySelectorAll('.d-flex.align-items-center');
    const events = [];

    eventItems.forEach(item => {
      const name = item.querySelector('h5').textContent;
      const date = item.querySelector('p:nth-of-type(1)').textContent;
      const comment = item.querySelector('p:nth-of-type(2)').textContent;
      events.push({ name, date, comment });
    });

    localStorage.setItem('events', JSON.stringify(events));
  }

  function loadEventsFromLocalStorage() {
    // Load events from localStorage
    const events = JSON.parse(localStorage.getItem('events')) || [];

    events.forEach(event => {
      addNewEventToDOM(event.name, event.date, event.comment);
    });
  }
});
