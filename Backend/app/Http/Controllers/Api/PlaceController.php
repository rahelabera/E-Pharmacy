<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Place;

class PlaceController extends Controller
{
    public function store(Request $request)
    {
        $place = new Place();
        $place->name = $request->name;
        $place->address = $request->address;
        $place->lat = $request->lat;
        $place->lng = $request->lng;
        $place->save();

        return response()->json(['success' => true]);
    }
    public function index()
    {
        $places = Place::all();
        return response()->json($places);
    }

   
}