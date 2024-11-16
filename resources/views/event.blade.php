@extends('layouts.app')

@section('title', 'Create Event')

@section('content')
        <div class="row">
            <!-- Form Section -->
            <div class="col-12 col-lg-5 form-section">
                <form id="eventForm">
                    @csrf
                    <h2 class="heading-top">Create Event</h2>
                    <div id="alertMessage"></div>
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
                </form>
            </div>

            <!-- Event Data Section -->
            <div class="col-12 col-lg-7 table-section" id="savedEventData">
                <!-- Event data will be displayed here after successful form submission -->
            </div>
        </div>
    </div>

    <!-- Modal for Viewing Tickets -->
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

