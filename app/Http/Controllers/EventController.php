<?php

namespace App\Http\Controllers;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    public function index()
    {
        return view('event');
    }
    public function getAllEvents()
    {
        try {
            $events = Event::with('tickets')->get(); 
            return response()->json($events);
        } catch (\Exception $e) {
            Log::error('Error fetching all events: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while fetching events. Please try again later.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getTickets(Event $event)
    {
        try {
            $tickets = $event->tickets; 
            return response()->json($tickets);
        } catch (\Exception $e) {
            Log::error('Error fetching tickets for event: ' . $e->getMessage(), [
                'event_id' => $event->id,
                'error' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'An error occurred while fetching the tickets. Please try again later.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'organizer' => 'required|string',
            'tickets' => 'required|array|min:1',
            'tickets.*.ticketNo' => 'required|string',
            'tickets.*.price' => 'required|numeric|min:0',
        ]);

        try {
            \DB::beginTransaction();
            $event = Event::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'organizer' => $validated['organizer'],
            ]);
            foreach ($validated['tickets'] as $ticket) {
                $event->tickets()->create($ticket);
            }
            \DB::commit();

            return response()->json(['message' => 'Event saved successfully!'], 200);
        } catch (\Exception $e) {
            \DB::rollBack();
            Log::error('Error saving event: ' . $e->getMessage());

            return response()->json([
                'message' => 'An error occurred while saving the event. Please try again later.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
