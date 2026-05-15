package com.shopperspoint.controller;

import com.shopperspoint.dto.GenericResponse;
import com.shopperspoint.service.LogoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserLogoutController {

    private final LogoutService logoutService;

    @Autowired
    public UserLogoutController(LogoutService logoutService) {
        this.logoutService = logoutService;
    }

    @PostMapping("/logout")
    public ResponseEntity<GenericResponse> userLogout(HttpServletRequest request, HttpServletResponse response) {
        return logoutService.logout(request, response, LocaleContextHolder.getLocale());
    }
}
