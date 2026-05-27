<?php

namespace App\Http\Controllers\Api; // 👈 Vẫn nằm trong Api theo ý bạn

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCategoryController extends Controller // 👈 Đổi tên thành AdminCategoryController
{
    // Hiển thị danh sách
    public function index()
    {
        // giới hạn phân trang
        $categories = Category::latest()->paginate(10); 
        
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }

    // Trang thêm mới
    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    // Lưu
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:material,product',
        ]);

        Category::create($request->all());

        // Redirect về route index của admin
        return redirect()->route('admin.categories.index')->with('success', 'Đã thêm danh mục mới!');
    }

    // Trang sửa
    public function edit($id)
    {
        $category = Category::find($id);
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category
        ]);
    }

    // Cập nhật
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:material,product',
        ]);

        $category->update($request->all());

        return redirect()->route('admin.categories.index')->with('success', 'Cập nhật thành công!');
    }

    // Xóa
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // 🔥 LOGIC AN TOÀN: Kiểm tra xem có sản phẩm nào đang thuộc danh mục này không
        if ($category->products()->exists()) {
            // Nếu có -> Trả về lỗi, không xóa
            return back()->with('error', 'Không thể xóa! Danh mục này đang chứa sản phẩm.');
        }

        // Nếu danh mục rỗng -> Cho phép xóa
        $category->delete();
        return back()->with('success', 'Đã xóa danh mục thành công.');
    }
}