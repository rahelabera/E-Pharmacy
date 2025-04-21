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
           
            if (Auth::user()->is_role == 1) {
                return $next($request);
            } else {
                
                Auth::logout();
                return redirect()->route('login');
            }
        } else {
            
            return redirect()->route('login');
        }
    }
}
