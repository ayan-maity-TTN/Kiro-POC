package com.shopperspoint.controller;

import com.shopperspoint.dto.*;
import com.shopperspoint.service.CategoryService;
import com.shopperspoint.service.ProductService;
import com.shopperspoint.service.SellerService;
import com.shopperspoint.validation.OnUpdate;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/vendor")
public class SellerController {

    private final SellerService sellerService;
    private final CategoryService categoryService;
    private final ProductService productService;

    @Autowired
    public SellerController(SellerService sellerService, CategoryService categoryService, ProductService productService) {
        this.sellerService = sellerService;
        this.categoryService = categoryService;
        this.productService = productService;
    }

    @PostMapping("/register/seller")
    public ResponseEntity<GenericResponse> registerSeller(@Valid @RequestBody SellerDTO sellerDTO) {
        return sellerService.createSeller(sellerDTO, LocaleContextHolder.getLocale());
    }

    @GetMapping("/profile")
    public ResponseEntity<SellerViewProfileDTO> viewProfile(HttpServletRequest request) throws IOException {
        return ResponseEntity.ok(sellerService.getProfileDetails(request));
    }

    @PutMapping("/profile")
    public ResponseEntity<GenericResponse> updateProfile(@Valid @ModelAttribute SellerUpdateProfileDTO sellerUpdateProfileDTO,
                                                         HttpServletRequest request) {
        return sellerService.updateProfile(sellerUpdateProfileDTO, request, LocaleContextHolder.getLocale());
    }

    @PatchMapping("/password")
    public ResponseEntity<GenericResponse> updatePassword(@Valid @RequestBody PasswordDTO passwordDTO,
                                                          HttpServletRequest request) {
        return sellerService.updatePassword(passwordDTO, request);
    }

    @PutMapping("/address")
    public ResponseEntity<GenericResponse> updateAddress(@RequestParam(value = "id") Long id,
                                                         @Validated(OnUpdate.class) @RequestBody AddressDTO addressDTO,
                                                         HttpServletRequest request) {
        return sellerService.updateAddress(id, addressDTO, request);
    }

    @GetMapping("/categories/leaf")
    public List<SellerViewAllCategoryDTO> viewAllLeafCategories() {
        return categoryService.viewAllLeafCategory();
    }

    @PostMapping("/product")
    public ResponseEntity<GenericResponse> addProduct(@Valid @RequestBody ProductDTO productDTO,
                                                      HttpServletRequest request) {
        return productService.addProduct(productDTO, request, LocaleContextHolder.getLocale());
    }

    @GetMapping("/product")
    public ProductResponseDTO getProduct(@RequestParam(value = "productId") Long productId, HttpServletRequest request) {
        return productService.viewProductOfSeller(productId, request);
    }

    @DeleteMapping("/product")
    public ResponseEntity<GenericResponse> deleteProduct(@RequestParam(value = "productId") Long productId, HttpServletRequest request) {
        return productService.deleteProductOfSeller(productId, request);
    }

    @PutMapping("/product")
    public ResponseEntity<GenericResponse> updateProduct(@RequestParam(value = "productId") Long productId,
                                                         @Valid @RequestBody ProductUpdateDTO productUpdateDTO,
                                                         HttpServletRequest request) {
        return productService.updateProductOfSeller(productId, productUpdateDTO, request);
    }

    @GetMapping("/products")
    public List<ProductResponseDTO> getAllProduct(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "name") String sort,
            @RequestParam(value = "order", defaultValue = "asc") String order,
            @RequestParam(value = "query", required = false) String query,
            HttpServletRequest request) {
        return productService.viewAllProductOfSeller(page, size, sort, order, query, request);
    }

    @PostMapping("/product/variation")
    public ResponseEntity<GenericResponse> addProductVariation(
            @Valid @ModelAttribute ProductVariationRequestDTO productVariationRequestDTO,
            HttpServletRequest request) {
        return productService.addProductVariation(productVariationRequestDTO, request);
    }

    @GetMapping("/product/variation")
    public ProductVariationResponseDTO viewProductVariation(@RequestParam(value = "variationId") Long variationId,
                                                            HttpServletRequest request) {
        return productService.getProductVariation(variationId, request);
    }

    @GetMapping("/product/variations")
    public List<ProductVariationResponseDTO> viewAllVariationOfProduct(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort,
            @RequestParam(value = "order", defaultValue = "asc") String order,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "productId") Long productId,
            HttpServletRequest request) {
        return productService.getVariationsForProduct(page, size, sort, order, query, productId, request);
    }

    @PutMapping("/product/variation")
    public ResponseEntity<GenericResponse> updateProductVariation(
            @RequestParam(value = "variationId") Long variationId,
            @Valid @ModelAttribute ProductVariationUpdateDTO variationUpdateDTO,
            HttpServletRequest request) {
        return productService.updateProductVariation(variationId, variationUpdateDTO, request);
    }
}
