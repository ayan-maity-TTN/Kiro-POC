package com.shopperspoint.dto;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryMetadataFieldValuesDTO {

    @NotNull(message = "Category ID is required")
    private Long categoryId;


    @Size(min = 1, message = "At least one metadata field and value must be provided")

    @Valid
    private List<MetadataFieldValueRequestDTO> metadataFieldValues;
}
