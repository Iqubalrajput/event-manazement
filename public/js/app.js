
$(document).ready(function() {
    // Fetch all events and display them in the table
    $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
fetchEventData();

window.viewTickets = function(eventId) {
    $.ajax({
        url: `/events/${eventId}/tickets`, 
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data); 
            var ticketsHtml = '';
            if (data.length === 0) {
                ticketsHtml = `
                    <tr>
                        <td colspan="2" style="text-align:center;">No tickets available</td>
                    </tr>
                `;
            } else {
                let ticketCount = 1;
                data.forEach(function(ticket) {
                    ticketsHtml += `
                        <tr>
                            <td>${ticketCount}</td>
                            <td>${ticket.ticketNo}</td>
                            <td>${ticket.price}</td>
                        </tr>
                    `;
                    ticketCount++;
                });
            }
            $('#ticketTableInModal tbody').html(ticketsHtml);
            $('#ticketModal').modal('show');
        },
        error: function(xhr, status, error) {
            console.error("Error fetching ticket data:", error);
        }
    });
};
});
function fetchEventData() {
    $.ajax({
        url: '/events', 
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data); 
            if (!data || data.length === 0) {
            $('#savedEventData').html(`
                <h2>Event List</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Event Name</th>
                            <th>Description</th>
                            <th>Organizer</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Tickets</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="10" style="text-align:center;">No events available</td>
                        </tr>
                    </tbody>
                </table>
            `);
            return;
          }

            var eventData = `
                <h2>Event List</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Event</th>
                            <th>Description</th>
                            <th>Organizer</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Tickets</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>`;
            function formatDate(dateString) {
                var options = { year: 'numeric', month: 'long', day: 'numeric' };
                var date = new Date(dateString);
                return date.toLocaleDateString('en-GB', options); // Format to "11 November 2024"
            }
            let eventCount = 1;
            data.forEach(function(event) {
                var tickets = ''; 
                event.tickets.forEach(function(ticket) {
                    tickets += ``;
                });

                eventData += `
                    <tr>
                        <td>${eventCount}</td>
                        <td>${event.name||'NA'}</td>
                        <td>${event.description || 'NA'}</td>
                        <td>${event.organizer || 'NA'}</td>
                        <td>${formatDate(event.start_date)}</td>
                        <td>${formatDate(event.end_date)}</td>
                        <td><button class="btn btn-info" onclick="viewTickets(${event.id})">Tickets</button></td>
                        <td>
                          <button type="button" class="edit-event" onclick="editEvent(${event.id})">Edit</button>
                            <button type="button" class="delete-event" onclick="deleteEvent(this, ${event.id})">Delete</button>
                        </td>
                    </tr>
                    
                    ${tickets}
                `;
                eventCount++;
            });

            eventData += `
                    </tbody>
                </table>
            `;
            $('#savedEventData').html(eventData);
        },
        error: function(xhr, status, error) {
            console.error("Error fetching event data:", error);
            $('#savedEventData').html("<p>Failed to load events. Please try again.</p>");
        }
    });
}

function editEvent(eventId) {
    // Make an AJAX call to fetch the event data
    fetch(`/events/${eventId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch event data');
            }
            return response.json();
        })
        .then(data => {
            // Populate modal fields with fetched data
            document.getElementById('editEventId').value = data.id;
            document.getElementById('editEventName').value = data.name;
            document.getElementById('editEventDescription').value = data.description;
            document.getElementById('editEventOrganizer').value = data.organizer;
            document.getElementById('editEventStartDate').value = data.start_date;
            document.getElementById('editEventEndDate').value = data.end_date;

            // Show the modal
            document.getElementById('editModal').style.display = 'block';
            document.getElementById('modalOverlay').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching event data:', error);
            alert('An error occurred while fetching event data. Please try again.');
        });
}


function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
}

function update_event() {
    // Get updated data from modal
    const eventId = document.getElementById('editEventId').value;
    const eventName = document.getElementById('editEventName').value;
    const eventDescription = document.getElementById('editEventDescription').value;
    const eventOrganizer = document.getElementById('editEventOrganizer').value;
    const eventStartDate = document.getElementById('editEventStartDate').value;
    const eventEndDate = document.getElementById('editEventEndDate').value;

    // AJAX request to update data in the database
    $.ajax({
        url: `/events/${eventId}`,
        type: 'PUT',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            name: eventName,
            description: eventDescription,
            organizer: eventOrganizer,
            start_date: eventStartDate,
            end_date: eventEndDate
        },
        success: function (response) {
            closeModal();
            $('#alertMessagelist').text(response.message).css('background-color', '#4CAF50').css('color', '#fff').css('padding', '15px').show();
                fetchEventData(); 
                setTimeout(function() {
                    $('#alertMessagelist').fadeOut(); 
                }, 3000);
        },
        error: function (xhr) {
            alert(xhr.responseJSON.message || 'An error occurred.');
        }
    });
}
function openModal() {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
}
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
}


$('#addTicket').click(function() {
    var rowCount = $('#ticketTable tbody tr').length;
const row = `
    <tr>
        <td class="ticket-index">${rowCount + 1}</td>
        <td><input type="text" class="ticket-no" required></td>
        <td><input type="number" class="ticket-price" required></td>
        <td>
            <button type="button" class="edit-ticket">Edit</button>
            <button type="button" class="delete-ticket">Delete</button>
        </td>
    </tr>`;
$('#ticketTable tbody').append(row);
});

function deleteEvent(button, eventId) {
    if (confirm("Are you sure you want to delete this event?")) {
        // AJAX request to delete the event
        $.ajax({
            url: `/events/${eventId}`, // Laravel API endpoint
            type: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') // CSRF token
            },
            success: function (response) {
                $('#alertMessagelist').text(response.message).css('background-color', '#f44336').css('color', '#fff').css('padding', '15px').show();
                fetchEventData(); 
                setTimeout(function() {
                    $('#alertMessagelist').fadeOut(); 
                }, 2000);
            },
            error: function (xhr) {
                alert(xhr.responseJSON.message || 'An error occurred.');
            }
        });
    }
}

$(document).on('click', '.edit-ticket', function() {
const row = $(this).closest('tr');
const ticketNo = row.find('.ticket-no').val();
const price = row.find('.ticket-price').val();

row.find('.ticket-no').replaceWith(`<input type="text" class="ticket-no" value="${ticketNo}" >`);
row.find('.ticket-price').replaceWith(`<input type="number" class="ticket-price" value="${price}" >`);
$(this).text('Save').removeClass('edit-ticket').addClass('save-ticket');
});

// Save edited ticket
$(document).on('click', '.save-ticket', function() {
const row = $(this).closest('tr');
const ticketNo = row.find('.ticket-no').val();
const price = row.find('.ticket-price').val();

row.find('.ticket-no').replaceWith(`<input type="text" class="ticket-no" value="${ticketNo}"  readonly>`);
row.find('.ticket-price').replaceWith(`<input type="number" class="ticket-price" value="${price}"  readonly>`);
$(this).text('Edit').removeClass('save-ticket').addClass('edit-ticket');
});

// Delete ticket
$(document).on('click', '.delete-ticket', function() {
$(this).closest('tr').remove();
});
$('#eventForm').submit(function(e) {
e.preventDefault();

// Clear previous error messages
$('.error').text('');
$('#alertMessage').hide();

let hasTicket = false;
const tickets = [];
const startDate = $('#start_date').val();
const endDate = $('#end_date').val();

if (new Date(endDate) < new Date(startDate)) {
    $('#alertMessage').text('End date must be greater than or equal to start date.')
        .css('background-color', '#f44336')
        .css('color', '#fff')
        .show();
    setTimeout(function() {
        $('#alertMessage').fadeOut();
    }, 3000); 

    return;
}

$('#ticketTable tbody tr').each(function() {
    const ticketNo = $(this).find('.ticket-no').val();
    const price = $(this).find('.ticket-price').val();
    if (ticketNo && price) {
        tickets.push({ ticketNo, price });
        hasTicket = true;
    }
});

if (!hasTicket) {
    $('#alertMessage').text('Please add at least one ticket.')
        .css('background-color', '#f44336')
        .css('color', '#fff')
        .show();

    setTimeout(function() {
        $('#alertMessage').fadeOut();
    }, 3000); 
    return;
}
const formData = {
    name: $('#name').val(),
    description: $('#description').val(),
    start_date: startDate,
    end_date: endDate,
    organizer: $('#organizer').val(),
    tickets: tickets
};

$.ajax({
    url: '/save-event',
    type: 'POST',
    data: formData,
    success: function(response) {
        console.log('Event saved successfully:', response);
        $('#eventForm')[0].reset(); 
        $('#ticketTable tbody').empty(); 
        $('#alertMessage').text(response.message).css('background-color', '#4CAF50').css('color', '#fff').show();
        fetchEventData(); 
        setTimeout(function() {
            $('#alertMessage').fadeOut(); 
        }, 2000);
    },
    error: function(xhr) {
        $('#alertMessage').hide();
        const errors = xhr.responseJSON.errors;
        if (errors) {
            for (const field in errors) {
                if (errors.hasOwnProperty(field)) {
                    $(`#${field}Error`).text(errors[field].join(', ')).show();
                }
            }
            $('#alertMessage').text('Please correct the errors in the form and try again.').css('background-color', '#f44336').css('color', '#fff').show();
        } else {
            $('#alertMessage').text('Error saving event!').css('background-color', '#f44336').css('color', '#fff').show();
        }
    }
});
});
$(document).on('click', '.delete-ticket', function() {
$(this).closest('tr').remove();
});