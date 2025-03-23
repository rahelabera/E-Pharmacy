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

    public function nearby(Request $request)
    {
        $lat = $request->lat;
        $lng = $request->lng;
        $radius = $request->radius;

        $places = Place::selectRaw("*, ( 6371 * acos( cos( radians(?) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(?) ) + sin( radians(?) ) * sin( radians( lat ) ) ) ) AS distance", [$lat, $lng, $lat])
            ->having("distance", "<", $radius)
            ->orderBy("distance")
            ->get();

        return response()->json($places);
    }
}