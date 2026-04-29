package org.example.taskbrain.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map everything starting with /uploads/ to the file system path
        // Adjust the absolute path if necessary, but "file:uploads/" works for relative
        // to working dir
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
