@extends('layouts.app')

@section('title', 'Create Event')

@section('content')
        <div class="row">
            <!-- Form Section -->
            <div class="col-12 col-lg-5 form-section">
                <form id="eventForm">
                    @csrf
                    <h2 class="heading-top">Create Event</h2>
                    <label for="name">Event Name:</label>
                    <input type="text" name="name" id="name" required>
                    <div id="nameError" class="error"></div>

                    <label for="description">Event Description:</label>
                    <textarea name="description" id="description"></textarea>
                    <div id="descriptionError" class="error"></div>

                    <label for="start_date">Start Date:</label>
                    <input type="date" name="start_date" id="start_date" required>
                    <div id="start_dateError" class="error"></div>

                    <label for="end_date">End Date:</label>
                    <input type="date" name="end_date" id="end_date" required >
                    <div id="end_dateError" class="error"></div>

                    <label for="organizer">Organizer:</label>
                    <input type="text" name="organizer" id="organizer" required>
                    <div id="organizerError" class="error"></div>

                    <div class="table-container">
                        <h3>Tickets</h3>
                        <button type="button" id="addTicket">Add New Ticket</button>
                        <table id="ticketTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ticket No</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <button type="submit">Save Event</button>
                    <div id="alertMessage"></div>
                </form>
            </div>
            <div class="col-12 col-lg-7 table-section">
                <div id="savedEventData"></div>
                <div id="alertMessagelist"></div>
            </div>
        </div>
    </div>
    <!-- Edit Modal -->
    <div id="editModal" style="display: none; position: fixed; top: 20%; left: 50%; transform: translate(-50%, -20%); width: 400px; background: white; padding: 20px; border: 1px solid #ccc; border-radius: 5px; z-index: 1000;">
        <h3>Edit Event</h3>
        <form id="editForm">
            <input type="hidden" id="editEventId">
            <div>
                <label for="editEventName">Event Name:</label>
                <input type="text" id="editEventName" required>
            </div>
            <div>
                <label for="editEventDescription">Description:</label>
                <textarea  id="editEventDescription" ></textarea>
            </div>
            <div>
                <label for="editEventOrganizer">Organizer:</label>
                <input type="text" id="editEventOrganizer" required>
            </div>
            <div>
                <label for="editEventStartDate">Start Date:</label>
                <input type="date" id="editEventStartDate" required>
            </div>
            <div>
                <label for="editEventEndDate">End Date:</label>
                <input type="date" id="editEventEndDate" required>
            </div>
            <button type="button" class="edit-event"onclick="update_event()">Update Event</button>
            <button type="button" class="delete-event" onclick="closeModal()">Cancel</button>
        </form>
    </div>

    <!-- Overlay (Optional) -->
    <div id="modalOverlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999;"></div>

    <div class="modal fade" id="ticketModal" tabindex="-1" role="dialog" aria-labelledby="ticketModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ticketModalLabel">Event Tickets</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Ticket details will be displayed here -->
                    <table class="table" id="ticketTableInModal">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ticket No</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Ticket data will be inserted dynamically here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

@endsection

