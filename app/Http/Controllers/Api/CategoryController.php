<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // API lấy toàn bộ danh mục (cho Shop dropdown hoặc menu)
    public function index()
    {
        // Lấy danh mục, sắp xếp mới nhất
        $categories = Category::orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }
}