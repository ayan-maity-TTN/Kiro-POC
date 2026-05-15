package com.shopperspoint.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class GenericResponse {

    private String message;
    private String status;
    private LocalDateTime timestamp;

}
