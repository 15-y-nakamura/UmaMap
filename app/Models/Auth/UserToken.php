<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class UserToken extends Model
{
    protected $primaryKey = 'user_id';
    public $incrementing = false;

    protected $fillable = [
        'token',
        'expiration_time'
    ];

    protected $hidden = [
        'token'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function createToken(User $user)
    {
        while (!$this->token || self::where('token', $this->token)->exists()) {
            $this->token = Str::random(128);
        }
        $this->expiration_time = now()->addMonth();
        $this->user_id = $user->id;
        return $this->saveOrFail();
    }
}