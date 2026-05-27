package com.shopperspoint.controller;

import com.shopperspoint.dto.ProductViewDTO;
import com.shopperspoint.dto.ProductViewResponseDTO;
import com.shopperspoint.service.CategoryService;
import com.shopperspoint.service.ProductService;
import com.shopperspoint.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final ReviewService reviewService;

    @Autowired
    public PublicController(ProductService productService, CategoryService categoryService, ReviewService reviewService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.reviewService = reviewService;
    }

    @GetMapping("/homepage/products")
    public Map<String, List<ProductViewDTO>> getHomepageProducts() {
        return productService.getHomepageProducts();
    }

    @GetMapping("/search")
    public List<ProductViewDTO> searchProducts(
            @RequestParam(value = "query") String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        return productService.searchProducts(query, page, size);
    }

    @GetMapping("/categories")
    public List<Map<String, Object>> getCategories() {
        return categoryService.getPublicCategories();
    }

    @GetMapping("/product")
    public ProductViewResponseDTO getProduct(@RequestParam("productId") Long productId) {
        return productService.getProductView(productId);
    }

    @GetMapping("/products")
    public List<ProductViewDTO> getProducts(
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sort", defaultValue = "newest") String sort) {
        return productService.getPublicProducts(categoryId, page, size, sort);
    }

    @GetMapping("/products/similar")
    public List<ProductViewDTO> getSimilarProducts(
            @RequestParam(value = "productId") Long productId,
            @RequestParam(value = "limit", defaultValue = "8") int limit) {
        return productService.getSimilarProducts(productId, limit);
    }

    @GetMapping("/reviews")
    public List<?> getProductReviews(@RequestParam("productId") Long productId) {
        return reviewService.getProductReviews(productId);
    }
}
