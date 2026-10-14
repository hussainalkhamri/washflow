<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $cars = Car::where('user_id', $request->_authUserId)->get();
        return response()->json($cars);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string',
            'model' => 'required|string',
            'color' => 'required|string',
            'plate_number' => 'required|string',
            'year' => 'nullable|string'
        ], [
            'brand.required' => 'البيانات غير مكتملة',
            'model.required' => 'البيانات غير مكتملة',
            'color.required' => 'البيانات غير مكتملة',
            'plate_number.required' => 'البيانات غير مكتملة',
        ]);

        $car = Car::create(array_merge($validated, ['user_id' => $request->_authUserId]));

        return response()->json($car);
    }

    public function destroy(Request $request, $id)
    {
        $car = Car::find($id);

        if (!$car || $car->user_id !== $request->_authUserId) {
            return response()->json(['message' => 'غير موجود'], 404);
        }

        $car->delete();

        return response()->json(['success' => true]);
    }
}
