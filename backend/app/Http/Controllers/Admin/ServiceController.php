<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return response()->json($services);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category' => 'nullable|string',
            'isActive' => 'nullable|boolean'
        ], [
            'name.required' => 'البيانات غير مكتملة',
            'price.required' => 'البيانات غير مكتملة'
        ]);

        $serviceData = array_merge($validated, [
            'category' => $request->category ?? 'main',
            'is_active' => $request->has('isActive') ? $request->isActive : true
        ]);
        unset($serviceData['isActive']);

        $service = Service::create($serviceData);

        return response()->json($service);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);
        
        if (!$service) {
             return response()->json(['message' => 'غير موجود'], 404);
        }

        $updateData = [];
        if ($request->has('name')) $updateData['name'] = $request->name;
        if ($request->has('description')) $updateData['description'] = $request->description;
        if ($request->has('price')) $updateData['price'] = $request->price;
        if ($request->has('category')) $updateData['category'] = $request->category;
        if ($request->has('isActive')) $updateData['is_active'] = $request->isActive;

        $service->update($updateData);

        return response()->json($service);
    }

    public function destroy($id)
    {
        $service = Service::find($id);
        
        if (!$service) {
             return response()->json(['message' => 'غير موجود'], 404);
        }

        $service->delete();

        return response()->json(['success' => true]);
    }
}
