package com.shopperspoint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private Long variationId;
    private String productName;
    private String brand;
    private Long price;
    private Integer quantity;
    private String imageUrl;
    private Boolean isWishListItem;
    private Integer quantityAvailable;
}
