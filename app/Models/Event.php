<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['name', 'description', 'start_date', 'end_date', 'organizer'];

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}