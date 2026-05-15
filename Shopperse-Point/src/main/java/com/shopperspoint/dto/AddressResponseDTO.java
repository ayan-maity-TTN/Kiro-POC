package com.shopperspoint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponseDTO {
    private Long id;
    private String addressLine;
    private String label;
    private String city;
    private String state;
    private String country;
    private String zipCode;
}
