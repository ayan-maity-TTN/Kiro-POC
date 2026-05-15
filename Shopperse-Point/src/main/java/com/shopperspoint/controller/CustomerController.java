package com.shopperspoint.controller;

import com.shopperspoint.dto.*;
import com.shopperspoint.service.CategoryService;
import com.shopperspoint.service.CustomerService;
import com.shopperspoint.service.ProductService;
import com.shopperspoint.validation.OnUpdate;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/account")
public class CustomerController {

    private final CustomerService customerService;
    private final CategoryService categoryService;
    private final ProductService productService;

    @Autowired
    public CustomerController(CustomerService customerService, CategoryService categoryService, ProductService productService) {
        this.customerService = customerService;
        this.categoryService = categoryService;
        this.productService = productService;
    }

    @PostMapping("/register/customer")
    public ResponseEntity<GenericResponse> registerUser(@Valid @RequestBody CustomerDTO customer) {
        return customerService.registerCustomer(customer, LocaleContextHolder.getLocale());
    }

    @PutMapping("/activate")
    public ResponseEntity<GenericResponse> activateUser(@RequestHeader String token) {
        return customerService.activateAccount(token);
    }

    @PostMapping("/resendActivation")
    public ResponseEntity<GenericResponse> resendActvationLink(@RequestBody Map<String, String> requestbody) {
        return customerService.resendActivationLink(requestbody.get("email"));
    }

    @GetMapping("/profile")
    public ResponseEntity<CustomerViewProfileDTO> viewProfileOfCustomer(HttpServletRequest request) {
        return ResponseEntity.ok(customerService.getProfile(request));
    }

    @PutMapping("/profile")
    public ResponseEntity<GenericResponse> updateProfileOfCustomer(
            @Valid @ModelAttribute CustomerUpdateProfileDTO customerUpdateProfileDTO,
            HttpServletRequest request) {
        return customerService.updateProfile(customerUpdateProfileDTO, request, LocaleContextHolder.getLocale());
    }

    @PatchMapping("/password")
    public ResponseEntity<GenericResponse> updatePasswordOfCustomer(@Valid @RequestBody PasswordDTO passwordDTO,
                                                                    HttpServletRequest request) {
        return customerService.updatePassword(passwordDTO, request);
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressResponseDTO>> viewAddressOfCustomer(HttpServletRequest request) {
        return ResponseEntity.ok(customerService.getAllAddressesWithId(request));
    }

    @PostMapping("/addresses")
    public ResponseEntity<GenericResponse> addNewAddressOfCustomer(@Validated(OnUpdate.class) @RequestBody AddressDTO addressDTO,
                                                                   HttpServletRequest request) {
        return customerService.addNewAddress(addressDTO, request);
    }

    @PutMapping("/addresses")
    public ResponseEntity<GenericResponse> updateAddressOfCustomer(@RequestParam Long id,
                                                                   @Validated(OnUpdate.class) @RequestBody AddressDTO addressDTO,
                                                                   HttpServletRequest request) {
        return customerService.updateAddress(id, addressDTO, request);
    }

    @DeleteMapping("/addresses")
    public ResponseEntity<GenericResponse> deleteAddressOfCustomer(@RequestParam Long id,
                                                                   HttpServletRequest request) {
        return customerService.deleteAddress(id, request);
    }

    @GetMapping("/categories")
    public List<CustomerViewCategoryDTO> viewCategory(@RequestParam(required = false) Long categoryId) {
        return categoryService.viewCategoryCustomer(categoryId);
    }

    @GetMapping("/categories/filter")
    public CategoryFilterResponseDTO filterCategories(@RequestParam Long id) {
        return categoryService.getAllFilterCategoryDetails(id);
    }

    @GetMapping("/product")
    public ProductViewResponseDTO viewProduct(@RequestParam Long productId) {
        return productService.viewProductAndVariationDetails(productId);
    }

    @GetMapping("/products")
    public List<ProductViewDTO> viewAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String order,
            @RequestParam(required = false) String query,
            @RequestParam Long categoryId) {
        return productService.viewAllProductsByCustomer(page, size, sort, order, query, categoryId);
    }

    @GetMapping("/products/similar")
    public List<ProductViewDTO> viewAllSimilarProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String order,
            @RequestParam(required = false) String query,
            @RequestParam Long productId) {
        return productService.viewSimilarProducts(page, size, sort, order, query, productId);
    }
}
