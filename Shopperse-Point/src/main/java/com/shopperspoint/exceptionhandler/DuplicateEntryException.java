package com.shopperspoint.exceptionhandler;

import org.springframework.validation.FieldError;

import java.util.List;

public class DuplicateEntryException extends RuntimeException{
    public DuplicateEntryException(String message){

        super(message);
    }
}
