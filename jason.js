document.addEventListener('DOMContentLoaded', () => { 
  // Wait for the page to fully load
  const eventForm = document.getElementById('event-form'); 
  const postsContainerClone = document.getElementById('posts-container-clone'); // Container for event posts
  const eventModalTitle = document.getElementById('eventModalLabel'); 
  let currentEditItem = null; // Track the item being edited

  eventForm.addEventListener('submit', (event) => {
    event.preventDefault(); // stops the browser's default behavior for the event. In a form submission, it prevents the page from reloading.
    const name = document.getElementById('event-name').value; 
    const dateValue = document.getElementById('event-date').value; 
    const comment = document.getElementById('event-comment').value; 

    const date = new Date(dateValue); // used to convert the date to a Date object 
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }); // Format the date

    if (name && dateValue && comment) {
      if (currentEditItem) {
        // If we're editing an event
        currentEditItem.querySelector('h5').textContent = name; 
        currentEditItem.querySelector('p:nth-of-type(1)').textContent = formattedDate; 
        currentEditItem.querySelector('p:nth-of-type(2)').textContent = comment; 
        currentEditItem = null; // Reset edit item
      } else {
        // If we're adding a new event
        const postItem = document.createElement('div'); // Create a new div for the event
        postItem.className = 'd-flex align-items-center mb-3'; // styles
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
        `; // Set the content
        postsContainerClone.appendChild(postItem); // Add the event to the container

        const editBtn = postItem.querySelector('.edit-btn'); // Get the edit button
        const deleteBtn = postItem.querySelector('.delete-btn'); // Get the delete button

        editBtn.addEventListener('click', () => {
          editEvent(postItem);
        }); // Add click event to edit
        deleteBtn.addEventListener('click', () => {
          deleteEvent(postItem);
        }); // Add click event to delete
      }

      // Reset form fields
      document.getElementById('event-name').value = '';
      document.getElementById('event-date').value = '';
      document.getElementById('event-comment').value = '';

      // Hide the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
      modal.hide();
      eventModalTitle.textContent = 'Add Event'; // Reset modal title
    } else {
      console.log('Please fill in all fields');
    }
  });

  function editEvent(postItem) {
    // Edit an event
    const name = postItem.querySelector('h5').textContent; // Get the event name
    const date = postItem.querySelector('p:nth-of-type(1)').textContent; // Get the event date
    const comment = postItem.querySelector('p:nth-of-type(2)').textContent; // Get the event comment

    // Set form fields with the current values
    document.getElementById('event-name').value = name;
    document.getElementById('event-date').value = new Date(date).toISOString().split('T')[0];
    document.getElementById('event-comment').value = comment;

    currentEditItem = postItem; // Set the current item being edited
    eventModalTitle.textContent = 'Edit Event'; // Change modal title

    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    modal.show(); // Show the modal
  }

  function deleteEvent(postItem) {
    // Delete an event
    postsContainerClone.removeChild(postItem); // Remove the event from the container
  }
});
