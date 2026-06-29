package com.example.medifind_springv.modules.profile.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("profileFrontendController")
public class FrontendController {

    @RequestMapping(value = {
        "/",
        "/buscar",
        "/login",
        "/registro",
        "/registro/**",
        "/perfil",
        "/pro",
        "/pro/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
