package com.eorion.bo.engine.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "camunda.bpm.run.cors")
@Data
public class CorsConfigurationProperties {
    private boolean enabled = false;
    private String allowedMethods = "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS";
    private String allowedOrigins = "http://localhost:8080";
    private String allowedHeaders = "Origin, Authorization, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers";
    private String exposedHeaders = "*";
    private boolean allowCredentials = true;
    private String urlPattern = "/*";
    private long preflightMaxAge = 1000L;
}
