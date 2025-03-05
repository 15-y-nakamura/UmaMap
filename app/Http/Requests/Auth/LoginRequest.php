<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Models\Auth\User;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'userId' => ['required', 'regex:/^[0-9a-zA-Z_]+$/', 'max:30'],
            'password' => ['required', 'regex:/^[a-zA-Z0-9@#\$%!\^&*]+$/', 'min:8', 'max:30'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $user = $this->login();
            if ($user) {
                $this->merge(['user' => $user]);
            } else {
                $validator->errors()->add('userId', 'ユーザーIDまたはパスワードが違います');
            }
        });
    }

    private function login()
    {
        $user = User::where('login_id', $this->input('userId'))->first();
        if (!$user) return null;
        if (!Hash::check($this->input('password'), $user->password)) return null;
        if (!$user->isValid()) return null;
        return $user;
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                "errors" => 'ユーザーIDまたはパスワードが違います'
            ], 422, ['X-Inertia' => 'true']) // InertiaにJSON形式でエラーを渡す
        );
    }
}