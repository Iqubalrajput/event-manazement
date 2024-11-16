<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = ['event_id', 'ticketNo', 'price'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
