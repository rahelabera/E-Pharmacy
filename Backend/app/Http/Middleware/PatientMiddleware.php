<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Auth;

class PatientMiddleware 
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            // Ensure the user has the 'patient' role (assuming role '1' indicates a patient)
            if (Auth::user()->is_role == 1) {
                return $next($request);
            } else {
                // Log out non-patient users and redirect to login
                Auth::logout();
                return redirect()->route('login');
            }
        } else {
            // Log out if no user is authenticated and redirect to login
            return redirect()->route('login');
        }
    }
}
