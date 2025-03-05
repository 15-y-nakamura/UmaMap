<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class User extends Model
{
    const NORMAL_STATUS = 1;
    const DELETED_STATUS = 9;

    protected $fillable = [
        'login_id',
        'nickname',
        'email',
        'password',
        'status'
    ];

    protected $casts = [
        'status' => 'int',
    ];

    protected $hidden = [
        'password'
    ];

    protected $attributes = [
        'status' => self::NORMAL_STATUS,
    ];

    public function isValid()
    {
        return $this->status === self::NORMAL_STATUS;
    }

    public function user_token()
    {
        return $this->hasOne(UserToken::class);
    }

    public function createUser($id, $nickname, $email, $password)
    {
        $this->login_id = $id;
        $this->nickname = $nickname;
        $this->email = $email;
        $this->password = Hash::make($password);
        return $this->saveOrFail();
    }
}