package com.shopperspoint.controller;

import com.shopperspoint.dto.CartItemDTO;
import com.shopperspoint.dto.CartRequestDTO;
import com.shopperspoint.dto.GenericResponse;
import com.shopperspoint.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // ── Cart ──────────────────────────────────────────────────────────────────

    @GetMapping("/cart")
    public List<CartItemDTO> getCart(HttpServletRequest request) {
        return cartService.getCartItems(request);
    }

    @PostMapping("/cart")
    public ResponseEntity<GenericResponse> addToCart(@Valid @RequestBody CartRequestDTO dto,
                                                     HttpServletRequest request) {
        return cartService.addToCart(dto, request);
    }

    @PutMapping("/cart")
    public ResponseEntity<GenericResponse> updateCartItem(@RequestParam Long variationId,
                                                          @RequestParam Integer quantity,
                                                          HttpServletRequest request) {
        return cartService.updateCartItem(variationId, quantity, request);
    }

    @DeleteMapping("/cart")
    public ResponseEntity<GenericResponse> removeFromCart(@RequestParam Long variationId,
                                                          HttpServletRequest request) {
        return cartService.removeFromCart(variationId, request);
    }

    @DeleteMapping("/cart/clear")
    public ResponseEntity<GenericResponse> clearCart(HttpServletRequest request) {
        return cartService.clearCart(request);
    }

    // ── Wishlist ──────────────────────────────────────────────────────────────

    @GetMapping("/wishlist")
    public List<CartItemDTO> getWishlist(HttpServletRequest request) {
        return cartService.getWishlistItems(request);
    }

    @PostMapping("/wishlist")
    public ResponseEntity<GenericResponse> toggleWishlist(@RequestParam Long variationId,
                                                          HttpServletRequest request) {
        return cartService.toggleWishlist(variationId, request);
    }

    @DeleteMapping("/wishlist")
    public ResponseEntity<GenericResponse> removeFromWishlist(@RequestParam Long variationId,
                                                              HttpServletRequest request) {
        return cartService.removeFromWishlist(variationId, request);
    }
}
