package com.shopperspoint.service;

import com.shopperspoint.dto.CartItemDTO;
import com.shopperspoint.dto.CartRequestDTO;
import com.shopperspoint.dto.GenericResponse;
import com.shopperspoint.entity.Cart;
import com.shopperspoint.entity.Customer;
import com.shopperspoint.entity.ProductVariation;
import com.shopperspoint.exceptionhandler.BadRequestException;
import com.shopperspoint.exceptionhandler.ResouceNotFound;
import com.shopperspoint.key.CartKey;
import com.shopperspoint.repository.CartRepo;
import com.shopperspoint.repository.ProductVariationRepo;
import com.shopperspoint.utill.ImageUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class CartService {

    private final CartRepo cartRepo;
    private final ProductVariationRepo productVariationRepo;
    private final CustomerService customerService;

    @Autowired
    public CartService(CartRepo cartRepo,
                       ProductVariationRepo productVariationRepo,
                       CustomerService customerService) {
        this.cartRepo = cartRepo;
        this.productVariationRepo = productVariationRepo;
        this.customerService = customerService;
    }

    @Value("${image.product.variation}")
    private String imageType;

    @Value("${success.message}")
    private String message;

    // ── Cart ──────────────────────────────────────────────────────────────────

    public List<CartItemDTO> getCartItems(HttpServletRequest request) {
        Customer c = getCustomer(request);
        List<Cart> items = cartRepo.findCartItemsByCustomerId(c.getId());
        return items.stream().map(this::toDTO).toList();
    }

    @Transactional
    public ResponseEntity<GenericResponse> addToCart(CartRequestDTO dto, HttpServletRequest request) {
        Customer customer = getCustomer(request);
        ProductVariation variation = productVariationRepo.findById(dto.getProductVariationId())
                .orElseThrow(() -> new ResouceNotFound("Product variation not found"));

        if (Boolean.FALSE.equals(variation.getIsActive())) {
            throw new BadRequestException("Product variation is not active");
        }

        if (variation.getQuantityAvailable() < dto.getQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock");
        }

        Optional<Cart> existing = cartRepo.findByCustomerIdAndVariationId(customer.getId(), variation.getId());

        if (existing.isPresent()) {
            Cart cart = existing.get();
            int newQty = Integer.parseInt(cart.getQuality()) + dto.getQuantity();
            if (newQty > variation.getQuantityAvailable()) {
                throw new BadRequestException("Total quantity exceeds available stock");
            }
            cart.setQuality(String.valueOf(newQty));
            cart.setIsWishListItem(false);
            cartRepo.save(cart);
            log.info("Updated cart item quantity for customer {} variation {}", customer.getId(), variation.getId());
        } else {
            Cart cart = new Cart();
            cart.setId(new CartKey(customer.getId(), variation.getId()));
            cart.setCustomer(customer);
            cart.setProductVariation(variation);
            cart.setQuality(String.valueOf(dto.getQuantity()));
            cart.setIsWishListItem(false);
            cartRepo.save(cart);
            log.info("Added item to cart for customer {} variation {}", customer.getId(), variation.getId());
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new GenericResponse("Item added to cart", message, LocalDateTime.now()));
    }

    @Transactional
    public ResponseEntity<GenericResponse> updateCartItem(Long variationId, Integer quantity, HttpServletRequest request) {
        Customer customer = getCustomer(request);
        Cart cart = cartRepo.findByCustomerIdAndVariationId(customer.getId(), variationId)
                .orElseThrow(() -> new ResouceNotFound("Cart item not found"));

        if (quantity <= 0) {
            cartRepo.delete(cart);
            return ResponseEntity.ok(new GenericResponse("Item removed from cart", message, LocalDateTime.now()));
        }

        ProductVariation variation = cart.getProductVariation();
        if (quantity > variation.getQuantityAvailable()) {
            throw new BadRequestException("Requested quantity exceeds available stock");
        }

        cart.setQuality(String.valueOf(quantity));
        cartRepo.save(cart);
        log.info("Updated cart item for customer {} variation {}", customer.getId(), variationId);
        return ResponseEntity.ok(new GenericResponse("Cart updated", message, LocalDateTime.now()));
    }

    @Transactional
    public ResponseEntity<GenericResponse> removeFromCart(Long variationId, HttpServletRequest request) {
        Customer customer = getCustomer(request);
        Cart cart = cartRepo.findByCustomerIdAndVariationId(customer.getId(), variationId)
                .orElseThrow(() -> new ResouceNotFound("Cart item not found"));
        cartRepo.delete(cart);
        log.info("Removed cart item for customer {} variation {}", customer.getId(), variationId);
        return ResponseEntity.ok(new GenericResponse("Item removed from cart", message, LocalDateTime.now()));
    }

    @Transactional
    public ResponseEntity<GenericResponse> clearCart(HttpServletRequest request) {
        Customer customer = getCustomer(request);
        List<Cart> items = cartRepo.findCartItemsByCustomerId(customer.getId());
        cartRepo.deleteAll(items);
        log.info("Cleared cart for customer {}", customer.getId());
        return ResponseEntity.ok(new GenericResponse("Cart cleared", message, LocalDateTime.now()));
    }

    // ── Wishlist ──────────────────────────────────────────────────────────────

    public List<CartItemDTO> getWishlistItems(HttpServletRequest request) {
        Customer customer = getCustomer(request);
        List<Cart> items = cartRepo.findWishlistItemsByCustomerId(customer.getId());
        return items.stream().map(this::toDTO).toList();
    }

    @Transactional
    public ResponseEntity<GenericResponse> toggleWishlist(Long variationId, HttpServletRequest request) {
        Customer customer = getCustomer(request);
        ProductVariation variation = productVariationRepo.findById(variationId)
                .orElseThrow(() -> new ResouceNotFound("Product variation not found"));

        Optional<Cart> existing = cartRepo.findByCustomerIdAndVariationId(customer.getId(), variationId);

        if (existing.isPresent()) {
            Cart cart = existing.get();
            if (Boolean.TRUE.equals(cart.getIsWishListItem())) {
                cartRepo.delete(cart);
                return ResponseEntity.ok(new GenericResponse("Removed from wishlist", message, LocalDateTime.now()));
            } else {
                // Already in cart — just mark as wishlist too
                cart.setIsWishListItem(true);
                cartRepo.save(cart);
                return ResponseEntity.ok(new GenericResponse("Added to wishlist", message, LocalDateTime.now()));
            }
        }

        Cart cart = new Cart();
        cart.setId(new CartKey(customer.getId(), variationId));
        cart.setCustomer(customer);
        cart.setProductVariation(variation);
        cart.setQuality("1");
        cart.setIsWishListItem(true);
        cartRepo.save(cart);
        log.info("Added to wishlist for customer {} variation {}", customer.getId(), variationId);
        return ResponseEntity.ok(new GenericResponse("Added to wishlist", message, LocalDateTime.now()));
    }

    @Transactional
    public ResponseEntity<GenericResponse> removeFromWishlist(Long variationId, HttpServletRequest request) {
        Customer customer = getCustomer(request);
        Cart cart = cartRepo.findByCustomerIdAndVariationId(customer.getId(), variationId)
                .orElseThrow(() -> new ResouceNotFound("Wishlist item not found"));
        cartRepo.delete(cart);
        return ResponseEntity.ok(new GenericResponse("Removed from wishlist", message, LocalDateTime.now()));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public Customer getCustomer(HttpServletRequest request) {
        return customerService.getLoggedinCustomer(request);
    }

    private CartItemDTO toDTO(Cart cart) {
        ProductVariation v = cart.getProductVariation();
        String imageUrl = ImageUtils.getImage(v.getId(), imageType);
        return new CartItemDTO(
                v.getId(),
                v.getProduct().getName(),
                v.getProduct().getBrand(),
                v.getPrice(),
                Integer.parseInt(cart.getQuality() != null ? cart.getQuality() : "1"),
                imageUrl,
                cart.getIsWishListItem(),
                v.getQuantityAvailable()
        );
    }
}
