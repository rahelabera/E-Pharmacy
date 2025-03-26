<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @return Response
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if the user is authenticated
        if (Auth::check()) {
            // Check if the user is an admin (assuming 0 is the admin role)
            if (Auth::user()->is_role == 0) {
                // Proceed to the next middleware or controller
                return $next($request);
            } else {
                // If not an admin, logout and redirect to login
                Auth::logout();
                return redirect()->route('login'); // or your login route
            }
        }

        // If not authenticated, logout and redirect to login
        Auth::logout();
        return redirect()->route('login'); // or your login route
    }
}
