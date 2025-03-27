<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Auth;

class PharmacistMiddleware 
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            // Ensure the user has the 'pharmacist' role (assuming role '2' indicates a pharmacist)
            if (Auth::user()->is_role == 2) {
                return $next($request);
            } else {
                // Log out non-pharmacist users and redirect to login
                Auth::logout();
                return redirect()->route('login');
            }
        } else {
            // Log out if no user is authenticated and redirect to login
            return redirect()->route('login');
        }
    }
}
