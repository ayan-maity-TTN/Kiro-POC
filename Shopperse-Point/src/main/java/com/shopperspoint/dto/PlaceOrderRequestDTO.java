package com.shopperspoint.dto;

import com.shopperspoint.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PlaceOrderRequestDTO {

    @NotNull(message = "Address id is required")
    private Long addressId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}
