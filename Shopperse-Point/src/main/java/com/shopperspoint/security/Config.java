package com.shopperspoint.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class Config {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }



    /* Restore
Let me do a full audit of everything that's been done and what's still missing.

Searched workspace

Check all backend directories to see what exists

Check all frontend pages to see what exists

Read file(s)

CartService.java

ReviewService.java

OrderController.java

CartController.java

Dashboard.jsx

Variations.jsx

EditProduct.jsx

AddProduct.jsx

ProductViewResponseDTO.java

SecurityConfig.java

ProductVariationDTO.java

EmailService.java

Now I have a complete picture. Let me identify everything remaining:

Backend remaining:

CartService has a missing newline after constructor (cosmetic but could cause issues)

SecurityConfig — the GET /api/account/review is public but POST/PUT/DELETE should be customer-only — need to fix the permit pattern

ProductViewResponseDTO uses variations field with ProductVariationDTO which has metaData and primaryImageUrl — the frontend ProductDetail.jsx references product.variations and selectedVariation.imageUrl — need to verify field names match

Frontend remaining:

ProductDetail.jsx — references product.variations (correct) and selectedVariation.imageUrl but the DTO has primaryImageUrl — needs fix

CustomerProducts.jsx — need to check it's wired up

Admin Analytics.jsx — needs real order data wired in

Seller Dashboard — formatCurrency imported but unused

The Variations.jsx sends metadata as JSON string but backend expects Map<String,String> via @ModelAttribute — needs fix

Let me fix all of these now:

Read file(s)

ProductVariationRequestDTO.java

Products.jsx

Now I have a complete picture. Let me fix all remaining issues in one pass:

Issues to fix:

ProductDetail.jsx — selectedVariation.imageUrl should be selectedVariation.primaryImageUrl (matches DTO)

CustomerProducts.jsx — uses Redux for cart/wishlist instead of real API; also product.imageUrl but ProductViewDTO has imageUrls list

SecurityConfig — GET /api/account/review should be public but the current pattern "/api/account/review" only matches exact path, not GET vs POST — need to use HttpMethod matchers

CartService — missing newline after constructor closing brace

Seller Variations.jsx — sends metadata as JSON string but backend @ModelAttribute expects Map<String,String> — need to send as individual form fields

ProductViewDTO — check what imageUrl field is called

Read file(s)

ProductViewDTO.java

Now I have everything I need. Let me fix all issues:

Accepted edits to

SecurityConfig.java

Now fix the CartService missing newline:

Accepted edits to

CartService.java*/
}
