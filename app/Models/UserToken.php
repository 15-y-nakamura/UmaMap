<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Str;
use APIResponse;
use Illuminate\Support\Facades\Log;

class UserToken extends Model
{
    use HasFactory;

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

    public static function checkToken($token)
    {
        try {
            $user = UserToken::where('token', $token);
            if ($user->doesntExist() || now() > $user->first()->expiration_time) {
                return response([], 200);
            }
            return $user->first()->user;
        } catch (\Exception $e) {
            return response([], 500);
        }
    }
}
