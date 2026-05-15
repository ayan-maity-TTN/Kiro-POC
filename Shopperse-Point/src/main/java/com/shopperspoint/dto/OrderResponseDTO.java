package com.shopperspoint.dto;

import com.shopperspoint.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private LocalDateTime dateCreated;
    private Double amountPaid;
    private PaymentMethod paymentMethod;
    private String addressLine;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    private String label;
    private List<OrderProductDTO> orderProducts;
}
