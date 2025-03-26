<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        $image = Image::storeImage($request);
        return response()->json(['message' => 'Image uploaded successfully', 'image' => $image], 201);
    }

    public function index()
    {
        return response()->json(Image::getAllImages(), 200);
    }

    public function show($id)
    {
        $image = Image::getImageById($id);
        return $image ? response()->json($image, 200) : response()->json(['message' => 'Image not found'], 404);
    }

    public function update(Request $request, $id)
    {
        $image = Image::updateImage($request, $id);
        return $image ? response()->json(['message' => 'Image updated successfully', 'image' => $image], 200) : response()->json(['message' => 'Image not found'], 404);
    }

    public function destroy($id)
    {
        return Image::deleteImage($id) 
            ? response()->json(['message' => 'Image deleted successfully'], 200)
            : response()->json(['message' => 'Image not found'], 404);
    }
}
