
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
                data.forEach(function(ticket) {
                    ticketsHtml += `
                        <tr>
                            <td>${ticket.ticketNo}</td>
                            <td>${ticket.price}</td>
                        </tr>
                    `;
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
                            <th>Event Name</th>
                            <th>Description</th>
                            <th>Organizer</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Tickets</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="6" style="text-align:center;">No events available</td>
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
                            <th>Event Name</th>
                            <th>Description</th>
                            <th>Organizer</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Tickets</th>
                        </tr>
                    </thead>
                    <tbody>`;
            function formatDate(dateString) {
                var options = { year: 'numeric', month: 'long', day: 'numeric' };
                var date = new Date(dateString);
                return date.toLocaleDateString('en-GB', options); // Format to "11 November 2024"
            }
            data.forEach(function(event) {
                var tickets = ''; 
                event.tickets.forEach(function(ticket) {
                    tickets += ``;
                });

                eventData += `
                    <tr>
                        <td>${event.name||'NA'}</td>
                        <td>${event.description || 'NA'}</td>
                        <td>${event.organizer || 'NA'}</td>
                        <td>${formatDate(event.start_date)}</td>
                        <td>${formatDate(event.end_date)}</td>
                        <td><button class="btn btn-info" onclick="viewTickets(${event.id})">Tickets</button></td>
                    </tr>
                    ${tickets}
                `;
            });

            eventData += `
                    </tbody>
                </table>
            `;

            // Insert the event data into the table-section div
            $('#savedEventData').html(eventData);
        },
        error: function(xhr, status, error) {
            console.error("Error fetching event data:", error);
            $('#savedEventData').html("<p>Failed to load events. Please try again.</p>");
        }
    });
}


// Add a new ticket row
$('#addTicket').click(function() {
const row = `
    <tr>
        <td><input type="text" class="ticket-no" ></td>
        <td><input type="number" class="ticket-price" ></td>
        <td>
            <button type="button" class="edit-ticket">Edit</button>
            <button type="button" class="delete-ticket">Delete</button>
        </td>
    </tr>`;
$('#ticketTable tbody').append(row);
});

// Edit ticket
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