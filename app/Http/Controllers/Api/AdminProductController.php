<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    // 1. Hiển thị danh sách
    public function index(Request $request)
{
    $query = Product::with('category'); // Load category để hiển thị

    if ($request->search) {
        $query->where('name', 'like', '%' . $request->search . '%');
    }

    // withQueryString() giúp giữ lại từ khóa tìm kiếm khi chuyển trang (Pagination)
    $products = $query->latest()->paginate(10)->withQueryString();

    return Inertia::render('Admin/Products/Index', [
        'products' => $products
    ]);
}

    // 2. Trả về trang Thêm Mới
    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories
        ]);
    }

    // 3. Lưu mới
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0', 
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'images' => 'nullable|array|max:5', 
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $data = $request->except('images');

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $file) {
                // Lưu vào storage/app/public/products
                $path = $file->store('products', 'public');
                $imagePaths[] = '/storage/' . $path;
            }
            $data['image'] = json_encode($imagePaths); 
        } else {
            $data['image'] = json_encode([]);
        }

        Product::create($data);

        return redirect()->route('admin.products.index')->with('message', 'Đã thêm sản phẩm thành công!');
    }

    public function edit($id)
    {
        $product = Product::findOrFail($id);
        $categories = Category::all();
        
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'images' => 'nullable|array|max:5', // Ảnh mới
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'existing_images' => 'nullable|array', // Ảnh cũ giữ lại
        ]);

        $data = $request->except(['images', 'existing_images']);

        // Lấy danh sách ảnh hiện tại trong DB
        $currentImagesInDb = json_decode($product->image, true) ?? [];
        if (!is_array($currentImagesInDb)) {
            // Trường hợp DB lưu string path đơn lẻ (legacy data), convert thành mảng
            $currentImagesInDb = !empty($product->image) ? [$product->image] : [];
        }

        // Danh sách ảnh cũ người dùng muốn giữ lại
        $imagesToKeep = $request->input('existing_images', []);

        // Tìm ảnh cần xóa
        $imagesToDelete = array_diff($currentImagesInDb, $imagesToKeep);

        foreach ($imagesToDelete as $deletePath) {
            $relativePath = str_replace('/storage/', '', $deletePath);
            if (Storage::disk('public')->exists($relativePath)) {
                Storage::disk('public')->delete($relativePath);
            }
        }

        // ---  Upload ảnh mới ---
        $newImagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');
                $newImagePaths[] = '/storage/' . $path;
            }
        }

        // --- BƯỚC 3: Gộp và Lưu ---
        // Tổng hợp ảnh cuối cùng = Ảnh cũ giữ lại + Ảnh mới upload
        $finalImages = array_merge($imagesToKeep, $newImagePaths);

        // Reset key mảng về 0,1,2... để JSON đẹp
        $data['image'] = json_encode(array_values($finalImages));

        $product->update($data);
        return redirect()->route('admin.products.index')->with('message', 'Cập nhật sản phẩm thành công!');
    }

    // 6. Xóa sản phẩm
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        $images = json_decode($product->image, true);
        
        // Fallback nếu dữ liệu cũ không phải JSON array
        if (!is_array($images) && !empty($product->image)) {
            $images = [$product->image];
        }

        if (is_array($images)) {
            foreach ($images as $path) {
                $relativePath = str_replace('/storage/', '', $path);
                if (Storage::disk('public')->exists($relativePath)) {
                    Storage::disk('public')->delete($relativePath);
                }
            }
        }

        $product->delete();

        return redirect()->route('admin.products.index')->with('message', 'Đã xóa sản phẩm!');
    }
}