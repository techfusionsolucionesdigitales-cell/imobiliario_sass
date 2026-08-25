<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inmobiliaria;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Registra una nueva inmobiliaria junto con su usuario administrador.
     */
    public function registerInmobiliaria(Request $request)
    {
        $data = $request->validate([
            'inmobiliaria_nombre' => ['required', 'string', 'max:255'],
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'email', 'unique:users,email'],
            'admin_password' => ['required', 'string', 'min:8'],
        ]);

        $inmobiliaria = Inmobiliaria::create([
            'nombre' => $data['inmobiliaria_nombre'],
            'slug' => Str::slug($data['inmobiliaria_nombre']).'-'.Str::random(6),
        ]);

        $user = User::create([
            'inmobiliaria_id' => $inmobiliaria->id,
            'name' => $data['admin_name'],
            'email' => $data['admin_email'],
            'password' => Hash::make($data['admin_password']),
        ]);

        $user->assignRole('admin_inmobiliaria');

        $token = JWTAuth::fromUser($user);

        return $this->respondWithToken($token, $user);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        return $this->respondWithToken($token, Auth::guard('api')->user());
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('inmobiliaria'));
    }

    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function refresh()
    {
        $token = Auth::guard('api')->refresh();

        return $this->respondWithToken($token, Auth::guard('api')->user());
    }

    protected function respondWithToken(string $token, User $user)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'user' => $user->load('inmobiliaria'),
            'roles' => $user->getRoleNames(),
        ]);
    }
}
