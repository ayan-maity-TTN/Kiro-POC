package com.shopperspoint.controller;

import com.shopperspoint.dto.*;
import com.shopperspoint.exceptionhandler.BadRequestException;
import com.shopperspoint.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/management")
public class AdminController {

    private final CategoryService categoryService;
    private final MetadataFieldService metadataFieldService;
    private final CustomerService customerService;
    private final SellerService sellerService;
    private final UserActivationService userActivationService;
    private final ProductService productService;

    @Autowired
    public AdminController(CategoryService categoryService, MetadataFieldService metadataFieldService, CustomerService customerService,
                           SellerService sellerService, UserActivationService userActivationService, ProductService productService) {
        this.categoryService = categoryService;
        this.metadataFieldService = metadataFieldService;
        this.customerService = customerService;
        this.sellerService = sellerService;
        this.userActivationService = userActivationService;
        this.productService = productService;
    }


    @GetMapping("/customers")
    public List<CustomerResponseDTO> getAllCustomer(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort,
            @RequestParam(value = "email", required = false) String email
    ) {
        return customerService.getAllCustomer(page, size, sort, email);
    }

    @GetMapping("/sellers")
    public List<SellerResponseDTO> getAllSeller(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort,
            @RequestParam(value = "email", required = false) String email
    ) {
        return sellerService.getAllSellers(page, size, sort, email);
    }

    @PatchMapping("/activate/customer")
    public ResponseEntity<GenericResponse> activateCustomerById(@RequestParam(value = "id") Long id) {
        return ResponseEntity.ok(userActivationService.activateCustomer(id));
    }

    @PatchMapping("/activate/seller")
    public ResponseEntity<GenericResponse> activateSellerByID(@RequestParam(value = "id") Long id) {
        return ResponseEntity.ok(userActivationService.activateSeller(id));
    }

    @PatchMapping("/deactivate/customer")
    public ResponseEntity<GenericResponse> deActivateCustomerById(@RequestParam(value = "id") Long id) {
        return ResponseEntity.ok(userActivationService.deActivateCustomer(id));
    }

    @PatchMapping("/deactivate/seller")
    public ResponseEntity<GenericResponse> deActivateSellerByID(@RequestParam(value = "id") Long id) {
        return ResponseEntity.ok(userActivationService.deActivateSeller(id));
    }

    @PostMapping("/add/category")
    public ResponseEntity<GenericResponse> addNewCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        Long id = categoryService.createCategory(categoryDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new GenericResponse("Category created with id: " + id, "SUCCESS", LocalDateTime.now()));
    }

    @PostMapping("/add/metadataField")
    public ResponseEntity<GenericResponse> addMetadataField(@Valid @RequestBody CategoryMetadataFieldDTO categoryMetadataFieldDTO) {
        return metadataFieldService.addMetadata(categoryMetadataFieldDTO);
    }

    @PostMapping("/category/metadataValues")
    public ResponseEntity<GenericResponse> addNewMetadataValues(@Valid @RequestBody CategoryMetadataFieldValuesDTO categoryMetadataFieldValuesDTO) {
        return metadataFieldService.addMetadataValues(categoryMetadataFieldValuesDTO);
    }

    @PutMapping("/categories")
    public ResponseEntity<GenericResponse> updateCategory(@Valid @RequestBody CategoryUpdateDTO categoryUpdateDTO) {
        return categoryService.updateCategory(categoryUpdateDTO, LocaleContextHolder.getLocale());
    }

    @PutMapping("/categories/metadataField/values")
    public ResponseEntity<GenericResponse> updateMetadataFieldValues(@Valid @RequestBody CategoryMetadataFieldValuesDTO categoryMetadataFieldValuesDTO) {
        return metadataFieldService.updateMetadataFieldValues(categoryMetadataFieldValuesDTO);
    }

    @GetMapping("/all/categories")
    public List<CategoryResponseDTO> viewAllCategory(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort,
            @RequestParam(value = "order", defaultValue = "asc") String order,
            @RequestParam(value = "filter", defaultValue = "") String filter
    ) {
        return categoryService.getAllCategories(page, size, sort, order, filter);
    }

    @GetMapping("/category/{id}")
    public CategoryResponseDTO viewCategory(@PathVariable(name = "id") Long id) {
        return categoryService.viewCategory(id);
    }

    @GetMapping("/all/metadataFields")
    public List<CategoryMetadataFieldDTO> getAllMetadataFields(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort,
            @RequestParam(value = "order", defaultValue = "asc") String order,
            @RequestParam(value = "filter", required = false) String filter
    ) {
        return metadataFieldService.getAllMetadata(page, size, sort, order, filter);
    }

    @GetMapping("/product")
    public ProductViewDTO viewProduct(@RequestParam(value = "productId") Long productId) {
        return productService.viewProductByAdmin(productId);
    }

    @PutMapping("/product/status")
    public ResponseEntity<GenericResponse> changeProductStatus(@RequestParam(value = "productId") Long productId, @RequestParam(value = "isActive") boolean isActive) {
        return productService.changeProductStatus(productId, isActive);
    }

    @GetMapping("/products")
    public List<ProductViewDTO> viewAllProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort,
            @RequestParam(value = "order", defaultValue = "asc") String order,
            @RequestParam(value = "filter", required = false) String filter
    ) {

        return productService.viewAllProductsByAdmin(page, size, sort, order, filter);

    }


}
